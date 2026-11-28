'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const acorn=require('acorn'),parse5=require('parse5'),I=require('../engine/i18n.js');
const root=path.join(__dirname,'..'),failures=[],used=new Set();
const invariant=new Set(['PIPI','.','STUDIO','PIPI. STUDIO / R&D','PIPI. STUDIO','MultiView','▦','A / B','INK','Lab (L*, a*, b*)','JSON','62.7, -42.1, 30.4','<2','2–<5','5–<10','≥10','0°','Selecciona tu idioma · 请选择语言','Español','English','简体中文','Activa JavaScript / Enable JavaScript / 请启用 JavaScript','Idioma / Language / 语言']);
const norm=s=>s.replace(/\s+/g,' ').trim();
const fixed=s=>!s||invariant.has(s)||/^\d+(?:\s*×\s*\d+)?(?:\s*(?:cm|mm|°))?$/.test(s);
function checkKey(key,where,params){
  used.add(key);
  for(const lang of ['es','en','zh'])if(!I.hasTranslation(key,lang))failures.push(where+' missing '+lang+': '+key);
  if(!I.hasTranslation(key,'es'))return;
  const required=I.parameters(I.catalog[key].es);
  if(params!==undefined&&JSON.stringify([...params].sort())!==JSON.stringify(required))failures.push(where+' incorrect params: '+key+' expected '+required+' got '+params);
}
for(const [key,entry] of Object.entries(I.catalog)){
  assert.match(key,/^[a-z][a-zA-Z0-9]*(?:\.[a-zA-Z0-9]+)+$/);
  for(const lang of ['es','en','zh']){assert.ok(I.hasTranslation(key,lang),key+' '+lang);assert.deepEqual(I.parameters(entry[lang]),I.parameters(entry.es),key+' '+lang+' placeholders');}
}
function checkHTML(html,file){
  const tree=parse5.parse(html,{sourceCodeLocationInfo:true});
  function walk(node){
    const attrs=Object.fromEntries((node.attrs||[]).map(a=>[a.name,a.value])),where=file+':'+(node.sourceCodeLocation?.startLine||'?');
    if(['script','style','textarea','pre','code','noscript'].includes(node.tagName))return;
    if(['header','main','footer'].includes(node.tagName)){assert.ok(Object.hasOwn(attrs,'inert'),where);assert.equal(attrs['aria-hidden'],'true',where);}
    for(const attr of ['aria-label','alt','placeholder','title']){
      if(attrs['data-i18n-'+attr])checkKey(attrs['data-i18n-'+attr],where,[]);
      else if(attrs[attr]&&!fixed(norm(attrs[attr])) )failures.push(where+' unkeyed '+attr+': '+attrs[attr]);
    }
    if(attrs['data-i18n']){
      checkKey(attrs['data-i18n'],where,[]);
      if((node.childNodes||[]).some(n=>n.tagName))failures.push(where+' keyed text must not contain elements');
      return;
    }
    if(node.nodeName==='#text'&&!fixed(norm(node.value)))failures.push(where+' unkeyed text: '+norm(node.value));
    for(const child of node.childNodes||[])walk(child);
  }
  walk(tree);
}
const passThrough=new Set(['v','label','key','params','source']);
function checkJS(source,file){
  const ast=acorn.parse(source,{ecmaVersion:'latest',sourceType:'script',locations:true});
  const raw=n=>source.slice(n.start,n.end);
  function checkExpression(expr,params,where){
    if(!expr)return;
    if(expr.type==='ConditionalExpression'){checkExpression(expr.consequent,params,where);checkExpression(expr.alternate,params,where);return;}
    if(expr.type==='Literal'&&typeof expr.value==='string'){
      if(expr.value==='')return;
      const names=params?.type==='ObjectExpression'?params.properties.map(p=>p.key.name??p.key.value):params?undefined:[];
      checkKey(expr.value,where,names);return;
    }
    if(passThrough.has(raw(expr)))return;
    if(expr.type==='CallExpression'&&expr.callee.type==='MemberExpression'&&['message','lines','enumMessage','translate'].includes(expr.callee.property.name))return;
    failures.push(where+' unresolved translation expression: '+raw(expr));
  }
  function walk(node,parent){
    if(!node||typeof node!=='object')return;
    const where=file+':'+(node.loc?.start.line||'?');
    if(node.type==='CallExpression'||node.type==='NewExpression'){
      const c=node.callee,name=c.type==='Identifier'?c.name:c.type==='MemberExpression'?c.property.name:null;
      if(['setText','status','option'].includes(name))checkExpression(node.arguments[1],node.arguments[2],where);
      if(['translate','message'].includes(name))checkExpression(node.arguments[0],node.arguments[1],where);
      if(name==='enumMessage'){
        const ns=node.arguments[0]?.value;
        const values={source:['pending','illustrative','reference','measured'],surface:['top','left45','right45','vertical']}[ns];
        if(!values)failures.push(where+' unknown enum namespace');else values.forEach(v=>checkKey(ns+'.'+v,where,[]));
      }
      if(name==='Error'){
        const arg=node.arguments[0];
        let params;
        if(parent?.type==='CallExpression'&&parent.callee?.property?.name==='assign')params=parent.arguments[1]?.properties?.find(p=>p.key.name==='i18nParams')?.value;
        checkExpression(arg,params,where);
      }
      if(['confirm','alert'].includes(name)&&node.arguments[0]?.callee?.property?.name!=='translate')failures.push(where+' dialog without translation');
    }
    if(node.type==='AssignmentExpression'&&['textContent','innerText','innerHTML'].includes(node.left.property?.name)){
      if(raw(node.right)!=="$('angle').value + '°'")failures.push(where+' direct UI text assignment: '+raw(node.right));
    }
    for(const value of Object.values(node))if(Array.isArray(value))value.forEach(v=>walk(v,node));else if(value&&typeof value==='object'&&typeof value.type==='string')walk(value,node);
  }
  walk(ast);
}
for(const file of fs.readdirSync(root).filter(x=>x.endsWith('.html')))checkHTML(fs.readFileSync(path.join(root,file),'utf8'),file);
for(const file of fs.readdirSync(path.join(root,'engine')).filter(x=>x.endsWith('.js')&&!['i18n.js','messages.js'].includes(x)))checkJS(fs.readFileSync(path.join(root,'engine',file),'utf8'),'engine/'+file);
// Controller-only keys are explicit and checked without relying on Spanish wording.
for(const key of ['language.switch','language.recommendation','language.title','language.cancel','error.generic'])checkKey(key,'controller',I.parameters(I.catalog[key].es));
const before=failures.length;
checkHTML('<html><body><p>Texto nuevo de prueba sin traducir</p></body></html>','mutation.html');
checkJS("PipiI18n.setText(el, 'missing.key');",'mutation.js');
checkJS("PipiI18n.setText(el, 'pixel.pitch.digital', {count: 3});",'mutation-params.js');
assert.equal(failures.length-before,5,'detect unkeyed HTML, absent key in three languages, missing parameter');failures.splice(before);
assert.equal(failures.length,0,'Translation coverage failures:\n'+failures.join('\n'));
console.log('Semantic translation coverage passed: '+used.size+' keys; '+Object.keys(I.catalog).length+' catalog entries');
