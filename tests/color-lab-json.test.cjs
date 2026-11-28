'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const I = require('../engine/i18n.js');
const E = require('../engine/color-engine.js');

// Execute the real Color Lab controller with a minimal DOM and real validation.
const elements = new Map();
function makeElement() {
  return {
    value: '',
    textContent: '',
    files: [],
    disabled: false,
    width: 64,
    height: 64,
    replaceChildren() {},
    getContext() {
      return { clearRect() {} };
    },
  };
}
const doc = {
  getElementById(id) {
    if (!elements.has(id)) elements.set(id, makeElement());
    return elements.get(id);
  },
  createElement: makeElement,
};
const platform = {
  URL: { createObjectURL: () => 'blob:test', revokeObjectURL() {} },
  Blob,
  confirm: () => true,
};
const source = fs.readFileSync(path.join(__dirname, '../engine/color-lab.js'), 'utf8');
const app = new Function(
  'PipiI18n',
  'PipiColor',
  'document',
  'window',
  source.replace(/initColorLab\(PipiColor, document, window\);\s*$/, 'return initColorLab(PipiColor, document, window);'),
)(I, E, doc, platform);
const $ = doc.getElementById;
const titles = {
  zh: 'JSON 格式无效。',
  en: 'Invalid JSON format.',
  es: 'Formato JSON no válido.',
};
async function run() {
  const original = JSON.stringify(app.getDB());
  const invalid = '{ invalid }';
  let detail;
  try {
    JSON.parse(invalid);
  } catch (error) {
    detail = error.message;
  }
  assert.ok(detail);
  for (const lang of ['zh', 'en', 'es']) {
    I.apply(lang);
    $('json').value = invalid;
    $('applyJSON').onclick();
    assert.ok($('dbStatus').textContent.startsWith(titles[lang]));
    assert.ok($('dbStatus').textContent.endsWith(detail));
    assert.equal($('json').value, invalid);
    assert.equal(JSON.stringify(app.getDB()), original);
    $('importDB').files = [{ size: invalid.length, text: async () => invalid }];
    $('importDB').value = 'bad.json';
    await $('importDB').onchange();
    assert.ok($('dbStatus').textContent.startsWith(titles[lang]));
    assert.ok($('dbStatus').textContent.endsWith(detail));
    assert.equal($('importDB').value, '');
    assert.equal(JSON.stringify(app.getDB()), original);
  }
  // Existing error re-renders without reparsing, preserving native details.
  I.apply('zh');
  assert.ok($('dbStatus').textContent.startsWith(titles.zh));
  assert.ok($('dbStatus').textContent.endsWith(detail));
  $('json').value = '{}';
  $('applyJSON').onclick();
  assert.equal($('dbStatus').textContent, I.translate('error.color.schema'));
  assert.equal(JSON.stringify(app.getDB()), original);
  $('json').value = original;
  $('applyJSON').onclick();
  assert.equal($('dbStatus').textContent, I.translate('lab.profile.valid'));
  $('importDB').files = [{ size: original.length, text: async () => original }];
  await $('importDB').onchange();
  assert.equal($('dbStatus').textContent, I.translate('lab.profile.valid'));
  console.log('Localized JSON errors: paste/import, three languages, live switch, schema and recovery passed');
}
run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
