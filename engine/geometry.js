'use strict';
const PipiGeometry = (function(){
function meshSet(materialHex){return materialHex.map((hex,i)=>({hex,name:`Filament_${i+1}_${hex.slice(1)}`,v:[],t:[]}))}
function prism(m,poly,y0,y1){const off=m.v.length,N=poly.length;for(let y of [y0,y1])for(let [x,z] of poly)m.v.push([x,y,z]);const tri=(a,b,c)=>m.t.push([a+off,b+off,c+off]);for(let j=1;j<N-1;j++){tri(0,j,j+1);tri(N,N+j+1,N+j)}for(let j=0;j<N;j++){const q=(j+1)%N;tri(j,j+N,q+N);tri(j,q+N,q)}}
function rect(m,x0,x1,y0,y1,z0,z1){prism(m,[[x0,z0],[x1,z0],[x1,z1],[x0,z1]],y0,y1)}

function checkPalette(colors){
  if(!Array.isArray(colors)||colors.length<1||colors.length>9||colors.some(h=>typeof h!=='string'||!/^#[0-9A-F]{6}$/i.test(h)))throw Error('Invalid palette');
}
function checkGrid(ids,n,rows,colors){
  if(!Number.isInteger(n)||!Number.isInteger(rows)||n<1||rows<1||n>128||rows>128||!ids||ids.length!==n*rows||Array.from(ids).some(id=>!Number.isInteger(id)||id<0||id>=colors.length))throw Error('Invalid grid');
}
function buildPixel({n,size,ids,colors}){
  checkPalette(colors);checkGrid(ids,n,n,colors);
  if(!Number.isFinite(size)||size/n<.6||size>330)throw Error('Píxeles demasiado pequeños o dimensiones inválidas.');
  const p=size/n,ms=meshSet(colors);
  rect(ms[0],0,size,0,size,0,1.6);
  for(let y=0;y<n;y++)for(let x=0;x<n;){
    const id=ids[y*n+x];let e=x+1;
    while(e<n&&ids[y*n+e]===id)e++;
    rect(ms[id],x*p,e*p,size-(y+1)*p,size-y*p,1.6,2.4);x=e;
  }
  return ms.filter(m=>m.t.length);
}
function buildMulti({n,w,h,rows,left,right,colors}){
  checkPalette(colors);checkGrid(left,n,rows,colors);checkGrid(right,n,rows,colors);
  if(!Number.isFinite(w)||!Number.isFinite(h)||w<=0||h<=0||w>330||h>320)throw Error('Dimensiones inválidas.');
  const ms=meshSet(colors),p=w/n,r=h/rows,z=1.6;
  rect(ms[0],0,w,0,h,0,z);
  for(let x=0;x<n;x++)for(let side=0;side<2;side++){
    const data=side?right:left,lo=x*p,mid=lo+p/2,hi=lo+p;
    const poly=side?[[mid,z],[hi,z],[mid,z+p/2]]:[[lo,z],[mid,z],[mid,z+p/2]];
    for(let y=0;y<rows;){
      const id=data[y*n+x];let e=y+1;
      while(e<rows&&data[e*n+x]===id)e++;
      prism(ms[id],poly,h-e*r,h-y*r);y=e;
    }
  }
  return ms.filter(m=>m.t.length);
}
const utf8=new TextEncoder();const num=n=>Number(n.toFixed(5)).toString();
function modelXml(ms){const ns='http://schemas.microsoft.com/3dmanufacturing/core/2015/02',base=1,assembly=ms.length+2;return `<?xml version="1.0" encoding="UTF-8"?><model unit="millimeter" xml:lang="en-US" xmlns="${ns}"><metadata name="Title">PIPI Studio test model</metadata><resources><basematerials id="${base}">${ms.map(m=>`<base name="${m.name}" displaycolor="${m.hex}FF"/>`).join('')}</basematerials>${ms.map((m,i)=>`<object id="${i+2}" name="${m.name}" type="model" pid="${base}" pindex="${i}"><mesh><vertices>${m.v.map(([x,y,z])=>`<vertex x="${num(x)}" y="${num(y)}" z="${num(z)}"/>`).join('')}</vertices><triangles>${m.t.map(([a,b,c])=>`<triangle v1="${a}" v2="${b}" v3="${c}"/>`).join('')}</triangles></mesh></object>`).join('')}<object id="${assembly}" name="PIPI_Assembly" type="model"><components>${ms.map((m,i)=>`<component objectid="${i+2}"/>`).join('')}</components></object></resources><build><item objectid="${assembly}"/></build></model>`}
const contentTypes='<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="model" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml"/></Types>';
const rels='<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Target="/3D/3dmodel.model" Id="rel0" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel"/></Relationships>';
function stl(m){let data=new Uint8Array(84+50*m.t.length),d=new DataView(data.buffer);data.set(utf8.encode('PIPI Studio '+m.name).slice(0,80));d.setUint32(80,m.t.length,true);m.t.forEach((t,i)=>{const vs=t.map(j=>m.v[j]),[a,b,c]=vs,u=b.map((v,j)=>v-a[j]),v=c.map((v,j)=>v-a[j]),cross=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],length=Math.hypot(...cross)||1;[...cross.map(n=>n/length),...vs.flat()].forEach((n,j)=>d.setFloat32(84+50*i+4*j,n,true))});return data}

function modelFiles(ms){return [['[Content_Types].xml',contentTypes],['_rels/.rels',rels],['3D/3dmodel.model',modelXml(ms)]];}
return {buildPixel,buildMulti,modelXml,modelFiles,stl};

})();
if(typeof module!=='undefined')module.exports=PipiGeometry;
