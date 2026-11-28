'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs'),
  path = require('node:path');
const G = require('../engine/geometry.js'),
  Z = require('../engine/zip.js'),
  E = require('../engine/color-engine.js'),
  P = require('../engine/pricing.js');
function geometryTests(G, assert) {
  function inspect(ms) {
    let total = 0;
    for (const m of ms) {
      const edges = new Map();
      let volume = 0;
      for (const tri of m.t) {
        assert(
          tri.every((i) => Number.isInteger(i) && i >= 0 && i < m.v.length),
          'index',
        );
        const [a, b, c] = tri.map((i) => m.v[i]);
        const cross = [
          b[1] * c[2] - b[2] * c[1],
          b[2] * c[0] - b[0] * c[2],
          b[0] * c[1] - b[1] * c[0],
        ];
        volume += a.reduce((s, x, i) => s + x * cross[i], 0) / 6;
        for (let i = 0; i < 3; i++) {
          const a = tri[i],
            b = tri[(i + 1) % 3],
            k = Math.min(a, b) + ',' + Math.max(a, b),
            old = edges.get(k) || [0, 0];
          old[0]++;
          old[1] += a < b ? 1 : -1;
          edges.set(k, old);
        }
      }
      assert(
        [...edges.values()].every(([n, d]) => n === 2 && d === 0),
        'closed oriented index edges',
      );
      assert(volume > 0, 'positive volume');
      total += volume;
      const stl = G.stl(m);
      assert(
        stl.length === 84 + 50 * m.t.length &&
          new DataView(stl.buffer).getUint32(80, true) === m.t.length,
        'STL length/count',
      );
    }
    return total;
  }
  const colors = ['#FFFFFF', '#000000', '#CC1122'],
    ids = Uint8Array.from([0, 1, 1, 2]);
  const m = G.buildPixel({ n: 2, size: 60, ids, colors });
  assert(Math.abs(inspect(m) - 60 * 60 * 2.4) < 1e-6, 'pixel volume');
  const q = G.buildMulti({
    n: 2,
    w: 60,
    h: 40,
    rows: 2,
    left: ids,
    right: Uint8Array.from([2, 0, 1, 0]),
    colors,
  });
  assert(Math.abs(inspect(q) - 60 * 40 * (1.6 + 60 / 2 / 4)) < 1e-6, 'multiview volume');
  const xml = G.modelXml(m);
  assert(xml.includes('unit="millimeter"') && xml.includes('PIPI_Assembly'), '3MF metadata');
  let error = false;
  try {
    G.buildPixel({ n: 128, size: 60, ids: new Uint8Array(128 * 128), colors });
  } catch {
    error = true;
  }
  assert(error, 'pitch guard');
  error = false;
  try {
    G.buildPixel({ n: 2, size: 60, ids: [0, 1, 2, 9], colors });
  } catch {
    error = true;
  }
  assert(error, 'color index guard');
  return {
    pixelTriangles: m.reduce((s, m) => s + m.t.length, 0),
    multiTriangles: q.reduce((s, m) => s + m.t.length, 0),
  };
}
function uiTests(src, E, G, Z, P, assert) {
  const values = {
    res: '32',
    colors: '16',
    size: '120',
    frame: '#292c29',
    paletteMode: 'digital',
    physicalPalette: '#FFFFFF,#000000',
    mvN: '24',
    mvSize: '150',
    angle: '0',
  };
  const elements = new Map(),
    ctx = {
      fillRect() {},
      clearRect() {},
      beginPath() {},
      arc() {},
      fill() {},
      moveTo() {},
      lineTo() {},
      lineTo() {},
      drawImage() {},
      getImageData(x, y, w, h) {
        return { data: new Uint8ClampedArray(w * h * 4).fill(255) };
      },
      putImageData() {},
    };
  const make = (id) => ({
    id,
    value: values[id] || '',
    width: 32,
    height: 32,
    style: {},
    textContent: '',
    disabled: false,
    replaceChildren() {},
    getContext() {
      return ctx;
    },
    click() {},
    remove() {},
  });
  const doc = {
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, make(id));
      return elements.get(id);
    },
    createElement() {
      return make('');
    },
    querySelectorAll() {
      return [];
    },
  };
  new Function('document', 'PipiColor', 'PipiGeometry', 'PipiZip', 'PipiPricing', src)(
    doc,
    E,
    G,
    Z,
    P,
  );
  const $ = doc.getElementById;
  assert($('exportPixel').disabled, 'digital disabled');
  $('paletteMode').value = 'physical';
  $('paletteMode').onchange();
  assert(
    !$('exportPixel').disabled && $('pitch').textContent.includes('directos'),
    'physical selected',
  );
  $('res').value = '128';
  $('res').onchange();
  $('size').value = '60';
  $('size').onchange();
  assert(
    $('exportPixel').disabled &&
      $('exportPixelStl').disabled &&
      $('pitch').textContent.includes('0.47') &&
      $('pitch').textContent.includes('directos'),
    '128/60 regression',
  );
  $('frame').value = '#FFFFFF';
  $('frame').onchange();
  $('colors').value = '64';
  $('colors').onchange();
  assert(
    $('pitch').textContent.includes('directos') && $('exportPixel').disabled,
    'frame/colors stay direct',
  );
  $('size').value = '180';
  $('size').onchange();
  assert(!$('exportPixel').disabled, 'valid pitch restores export');
  $('paletteMode').value = 'digital';
  $('paletteMode').onchange();
  assert(
    $('exportPixel').disabled && $('pitch').textContent.includes('digitales'),
    'digital restored',
  );
  $('angle').value = '45';
  $('angle').oninput();
  assert($('angleLabel').textContent === '45°', 'angle');
}
console.log(geometryTests(G, assert.ok));
uiTests(
  fs.readFileSync(path.join(__dirname, '../engine/studio.js'), 'utf8'),
  E,
  G,
  Z,
  P,
  assert.ok,
);
console.log('UI regression passed (mock DOM)');
const { inflateRawSync, deflateRawSync } = require('node:zlib');
async function zipTest() {
  const data = new TextEncoder().encode('hello world '.repeat(1000));
  assert.equal(Z.crc32(new TextEncoder().encode('123456789')), 0xcbf43926);
  for (const options of [
    {},
    { compress: null },
    { compress: async (x) => new Uint8Array(deflateRawSync(x)) },
    {
      compress: async () => {
        throw Error('unsupported');
      },
    },
  ]) {
    const bytes = await Z.zip(
        [
          ['test.txt', data],
          ['empty', ''],
        ],
        options,
      ),
      d = new DataView(bytes.buffer);
    const method = d.getUint16(8, true),
      length = d.getUint32(18, true),
      at = 30 + d.getUint16(26, true);
    const packed = bytes.slice(at, at + length);
    assert.deepEqual(new Uint8Array(method === 8 ? inflateRawSync(packed) : packed), data);
    assert.equal(d.getUint32(14, true), Z.crc32(data));
    assert.equal(d.getUint32(22, true), data.length);
    const central = d.getUint32(bytes.length - 6, true);
    assert.equal(d.getUint32(central, true), 0x02014b50);
    assert.equal(d.getUint16(central + 10, true), method);
    assert.equal(d.getUint32(central + 20, true), length);
    if (options.compress === null) assert.equal(method, 0);
    if (options.compress && options.compress.toString().includes('deflateRawSync'))
      assert.equal(method, 8);
  }
  const n = 128,
    colors = ['#FFFFFF', '#000000', '#CC1122'],
    ids = Uint8Array.from({ length: n * n }, (_, i) => ((i + i / n) | 0) % 3);
  const ms = G.buildPixel({ n, size: 180, ids, colors }),
    files = G.modelFiles(ms),
    stored = await Z.zip(files, { compress: null }),
    deflated = await Z.zip(files, { compress: async (x) => new Uint8Array(deflateRawSync(x)) });
  assert.ok(deflated.length < stored.length * 0.5);
  console.log({ stored: stored.length, deflated: deflated.length });
}
zipTest().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
