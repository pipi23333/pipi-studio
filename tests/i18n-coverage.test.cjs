'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const acorn = require('acorn');
const parse5 = require('parse5');
const I = require('../engine/i18n.js');
const root = path.join(__dirname, '..');
const failures = [],
  checked = new Set();
const invariant = new Set([
  'PIPI',
  '.',
  'STUDIO',
  'PIPI. STUDIO / R&D',
  'MultiView',
  '▦',
  'A / B',
  'INK',
  'Lab (L*, a*, b*)',
  'JSON',
  '62.7, -42.1, 30.4',
  '<2',
  '2–<5',
  '5–<10',
  '≥10',
  '0°',
]);
const norm = (s) => s.replace(/\s+/g, ' ').trim();
function check(s, location) {
  const key = norm(String(s));
  if (!key || invariant.has(key) || /^\d+(?:\s*×\s*\d+)?(?:\s*(?:cm|mm|°))?$/.test(key)) return;
  for (const lang of ['en', 'zh']) {
    checked.add(lang + ':' + key);
    if (!I.hasTranslation(key, lang)) failures.push(location + ' [' + lang + '] ' + key);
  }
}
function checkHTML(html, file) {
  const tree = parse5.parse(html, { sourceCodeLocationInfo: true });
  function walk(node) {
    const attrs = Object.fromEntries((node.attrs || []).map((a) => [a.name, a.value]));
    if (
      ['languageGate', 'languageSwitch'].includes(attrs.id) ||
      ['script', 'style', 'textarea', 'pre', 'code', 'noscript'].includes(node.tagName)
    )
      return;
    const location = file + ':' + (node.sourceCodeLocation?.startLine || '?');
    if (node.nodeName === '#text') check(node.value, location);
    for (const attr of ['aria-label', 'alt', 'placeholder', 'title'])
      if (attrs[attr]) check(attrs[attr], location + ' ' + attr);
    // Initial isolation is required even before the JS file loads.
    if (['header', 'main', 'footer'].includes(node.tagName)) {
      assert.ok(Object.hasOwn(attrs, 'inert'), location + ' initial inert');
      assert.equal(attrs['aria-hidden'], 'true', location + ' initial aria-hidden');
    }
    for (const child of node.childNodes || []) walk(child);
  }
  walk(tree);
}
const passThrough = new Set(['v', 'label', 'e.message', 'err.message']);
function checkJS(source, file) {
  const ast = acorn.parse(source, { ecmaVersion: 'latest', sourceType: 'script', locations: true });
  const fixture = {
    p: { length: 5 },
    used: { length: 5 },
    s: file.endsWith('studio.js') ? 60 : { mean: 1.2, p95: 3.4, max: 5.6, under2: 70 },
    n: 128,
    ms: { length: 3 },
    id: 'SAMPLE',
    i: 0,
    db: { profile: { id: 'demo', surface: 'top' }, recipes: { length: 95 } },
    r: {
      id: 'C',
      filaments: ['C'],
      ratios: [100],
      source: 'measured',
      usage: [{ id: 'C', count: 3 }],
    },
    e: { message: 'No hay recetas elegibles' },
    err: { message: 'No hay recetas elegibles' },
    $: () => ({ value: '45' }),
  };
  function sample(expr, location) {
    if (!expr) return;
    if (expr.type === 'ConditionalExpression') {
      sample(expr.consequent, location);
      sample(expr.alternate, location);
      return;
    }
    const raw = source.slice(expr.start, expr.end);
    if (passThrough.has(raw)) return;
    if (
      expr.type === 'CallExpression' &&
      expr.callee.type === 'MemberExpression' &&
      expr.callee.property.name === 'translate'
    )
      return;
    let value;
    try {
      value = vm.runInNewContext('(' + raw + ')', fixture, { timeout: 100 });
    } catch (error) {
      failures.push(
        location + ' [unresolved message expression] ' + raw + ' (' + error.message + ')',
      );
      return;
    }
    if (typeof value === 'string') check(value, location);
  }
  function walk(node) {
    if (!node || typeof node !== 'object') return;
    const location = file + ':' + (node.loc?.start.line || '?');
    if (node.type === 'CallExpression' || node.type === 'NewExpression') {
      const c = node.callee;
      const name =
        c.type === 'Identifier' ? c.name : c.type === 'MemberExpression' ? c.property.name : null;
      if (['setText', 'status', 'option'].includes(name)) sample(node.arguments[1], location);
      if (['translate', 'confirm', 'alert', 'Error'].includes(name))
        sample(node.arguments[0], location);
    }
    if (
      node.type === 'AssignmentExpression' &&
      node.left.type === 'MemberExpression' &&
      ['textContent', 'innerText', 'innerHTML'].includes(node.left.property.name)
    )
      sample(node.right, location);
    for (const value of Object.values(node))
      if (Array.isArray(value)) value.forEach(walk);
      else if (value && typeof value === 'object' && typeof value.type === 'string') walk(value);
  }
  walk(ast);
}
for (const file of fs.readdirSync(root).filter((x) => x.endsWith('.html')))
  checkHTML(fs.readFileSync(path.join(root, file), 'utf8'), file);
for (const file of fs
  .readdirSync(path.join(root, 'engine'))
  .filter((x) => x.endsWith('.js') && x !== 'i18n.js'))
  checkJS(fs.readFileSync(path.join(root, 'engine', file), 'utf8'), 'engine/' + file);
// Mutation regression: a new UI string must fail without both translations.
const before = failures.length;
checkHTML('<html><body><p>Texto nuevo de prueba sin traducir</p></body></html>', 'mutation.html');
checkJS("PipiI18n.setText(el, 'Nuevo aviso sin traducir');", 'mutation.js');
assert.equal(failures.length - before, 4, 'missing translations detected in both HTML and JS');
failures.splice(before);
assert.equal(failures.length, 0, 'Missing translations:\n' + failures.join('\n'));
console.log('Translation coverage passed: ' + checked.size + ' language/message pairs');
