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
I.setText(el, 'pixel.export.selectPhysical');
I.apply('zh');
assert.equal(el.textContent, '请选择直接耗材模式后导出。');
I.apply('en');
assert.equal(el.textContent, 'Select Direct filaments to export.');
I.apply('es');
assert.equal(el.textContent, 'Selecciona Filamentos directos para exportar.');
assert.match(I.translate('pixel.pitch.physical',{count:3,pitch:'0.47'},'zh'), /0\.47/);
assert.match(I.translate('lab.profile.summary',{id:'demo',surface:I.enumMessage('surface','top'),count:95,measured:0},'en'), /95 recipes/);
assert.match(
  I.translate('error.generic',{detail:I.message('error.color.noMeasured')},'zh'),
  /错误：当前配置没有实测颜色/,
);
assert.equal(I.translate('missing.key',{},'zh'),'[missing: missing.key]');
console.log('Language preference and translations passed');

assert.equal(I.recommendLanguage({ language: 'zh-Hant-TW' }), 'zh');
assert.equal(I.recommendLanguage({ language: 'en-US' }), 'en');
assert.equal(I.recommendLanguage({ language: 'es-MX' }), 'es');
assert.equal(I.recommendLanguage({ language: 'fr-FR', languages: ['fr-FR', 'en-GB'] }), 'en');
assert.equal(I.recommendLanguage({ language: 'de-DE' }), 'es');
assert.equal(I.recommendLanguage({}), 'es');
assert.equal(I.chooseInitial('?lang=es', { getItem: () => 'zh' }), 'es');
assert.equal(I.hasTranslation('error.geometry.palette', 'en'), true);
assert.equal(I.hasTranslation('Nueva frase sin traducción', 'en'), false);
assert.equal(I.hasTranslation('Nueva frase sin traducción', 'zh'), false);

const before=I.catalog['pixel.export.selectPhysical'].es;
I.catalog['pixel.export.selectPhysical'].es='Texto modificado';
assert.equal(I.translate('pixel.export.selectPhysical',{},'en'),'Select Direct filaments to export.');
assert.equal(I.translate('pixel.export.selectPhysical',{},'zh'),'请选择直接耗材模式后导出。');
assert.equal(I.translate('pixel.export.selectPhysical',{},'es'),'Texto modificado');
I.catalog['pixel.export.selectPhysical'].es=before;
