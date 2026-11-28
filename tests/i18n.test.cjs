'use strict';
const assert = require('node:assert/strict');
const I = require('../engine/i18n.js');
assert.equal(I.chooseInitial('', { getItem: () => null }), null);
assert.equal(I.chooseInitial('?lang=zh', { getItem: () => 'en' }), 'zh');
assert.equal(I.chooseInitial('?lang=bad', { getItem: () => 'en' }), 'en');
assert.equal(
  I.chooseInitial('', {
    getItem() {
      throw Error('blocked');
    },
  }),
  null,
);
const el = { textContent: '' };
I.setText(el, 'Selecciona Filamentos directos para exportar.');
I.apply('zh');
assert.equal(el.textContent, '请选择直接耗材模式后导出。');
I.apply('en');
assert.equal(el.textContent, 'Select Direct filaments to export.');
I.apply('es');
assert.equal(el.textContent, 'Selecciona Filamentos directos para exportar.');
assert.match(I.translate('3 colores directos · 0.47 mm por píxel', 'zh'), /0\.47/);
assert.match(I.translate('demo · top · 95 recetas · 0 medidas', 'en'), /95 recipes/);
assert.match(
  I.translate('Error: No hay colores medidos para este perfil', 'zh'),
  /错误：当前配置没有实测颜色/,
);
assert.equal(I.translate('unmapped user data', 'zh'), 'unmapped user data');
console.log('Language preference and translations passed');

assert.equal(I.recommendLanguage({ language: 'zh-Hant-TW' }), 'zh');
assert.equal(I.recommendLanguage({ language: 'en-US' }), 'en');
assert.equal(I.recommendLanguage({ language: 'es-MX' }), 'es');
assert.equal(I.recommendLanguage({ language: 'fr-FR', languages: ['fr-FR', 'en-GB'] }), 'en');
assert.equal(I.recommendLanguage({ language: 'de-DE' }), 'es');
assert.equal(I.recommendLanguage({}), 'es');
assert.equal(I.chooseInitial('?lang=es', { getItem: () => 'zh' }), 'es');
assert.equal(I.hasTranslation('Invalid palette', 'en'), true);
assert.equal(I.hasTranslation('Nueva frase sin traducción', 'en'), false);
assert.equal(I.hasTranslation('Nueva frase sin traducción', 'zh'), false);
