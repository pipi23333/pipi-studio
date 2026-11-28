'use strict';
const $ = (id) => document.getElementById(id);
const cv = (w, h) => Object.assign(document.createElement('canvas'), { width: w, height: h });
function landscape(night = false) {
  let c = cv(256, 256),
    g = c.getContext('2d');
  g.fillStyle = night ? '#263052' : '#eec18c';
  g.fillRect(0, 0, 256, 256);
  g.fillStyle = night ? '#f5e6bf' : '#f9df92';
  g.beginPath();
  g.arc(night ? 180 : 125, 76, 35, 0, Math.PI * 2);
  g.fill();
  [
    [
      night ? '#50628a' : '#719487',
      [
        [0, 188],
        [72, 75],
        [135, 177],
        [194, 100],
        [256, 170],
      ],
    ],
    [
      night ? '#30435d' : '#3e6657',
      [
        [0, 195],
        [48, 155],
        [126, 210],
        [210, 147],
        [256, 181],
      ],
    ],
  ].forEach(([color, p]) => {
    g.fillStyle = color;
    g.beginPath();
    g.moveTo(0, 256);
    p.forEach((q) => g.lineTo(...q));
    g.lineTo(256, 256);
    g.fill();
  });
  return c;
}
function pet() {
  let c = cv(32, 32),
    g = c.getContext('2d');
  g.fillStyle = '#e3d6b9';
  g.fillRect(0, 0, 32, 32);
  for (let y = 0; y < 32; y++)
    for (let x = 0; x < 32; x++) {
      let u = (x - 15.5) / 15.5,
        v = (y - 15.5) / 15.5,
        col = null;
      if (u * u + (v + 0.1) ** 2 < 0.52) col = '#c78a4d';
      if ((Math.abs(u) - 0.56) ** 2 / 0.1 + (v + 0.12) ** 2 / 0.35 < 1) col = '#875438';
      if ((u * u) / 0.25 + (v - 0.15) ** 2 / 0.19 < 1) col = '#f3c58a';
      if ((Math.abs(u) - 0.23) ** 2 + (v + 0.19) ** 2 < 0.014) col = '#242824';
      if ((u * u) / 0.032 + (v - 0.12) ** 2 / 0.016 < 1) col = '#242824';
      if ((u * u) / 0.075 + (v - 0.43) ** 2 / 0.013 < 1) col = '#82513c';
      if (col) {
        g.fillStyle = col;
        g.fillRect(x, y, 1, 1);
      }
    }
  return c;
}
let source = pet(),
  left = landscape(),
  right = landscape(true);
$('hero').getContext('2d').drawImage(source, 0, 0);
function crop(img, w, h) {
  const c = cv(w, h),
    g = c.getContext('2d');
  g.fillStyle = '#fff';
  g.fillRect(0, 0, w, h);
  let iw = img.naturalWidth || img.width,
    ih = img.naturalHeight || img.height,
    s = Math.max(w / iw, h / ih);
  g.imageSmoothingEnabled = true;
  g.drawImage(img, (w - iw * s) / 2, (h - ih * s) / 2, iw * s, ih * s);
  return c;
}
// Weighted median-cut quantization of image pixels, followed by nearest RGB color assignment.
function quantize(data, max) {
  const hist = new Map();
  for (let i = 0; i < data.length; i += 4) {
    const k = (data[i] << 16) | (data[i + 1] << 8) | data[i + 2];
    hist.set(k, (hist.get(k) || 0) + 1);
  }
  let boxes = [[...hist].map(([k, n]) => ({ v: [k >> 16, (k >> 8) & 255, k & 255], n }))];
  const range = (b) =>
    [0, 1, 2].map((j) => {
      let lo = 255,
        hi = 0;
      for (const p of b) {
        lo = Math.min(lo, p.v[j]);
        hi = Math.max(hi, p.v[j]);
      }
      return hi - lo;
    });
  while (boxes.length < max) {
    let best = -1,
      score = -1,
      axis = 0;
    boxes.forEach((b, i) => {
      if (b.length < 2) return;
      let r = range(b),
        a = r.indexOf(Math.max(...r)),
        s = r[a] * Math.sqrt(b.reduce((sum, p) => sum + p.n, 0));
      if (s > score) {
        best = i;
        score = s;
        axis = a;
      }
    });
    if (best < 0) break;
    let b = boxes.splice(best, 1)[0].sort((a, b) => a.v[axis] - b.v[axis]);
    let half = b.reduce((s, p) => s + p.n, 0) / 2,
      acc = 0,
      k = 0;
    while (k < b.length - 1 && acc < half) {
      acc += b[k].n;
      k++;
    }
    k = Math.max(1, Math.min(b.length - 1, k));
    boxes.push(b.slice(0, k), b.slice(k));
  }
  let palette = boxes.map((b) => {
    let n = b.reduce((s, p) => s + p.n, 0);
    return [0, 1, 2].map((j) => Math.round(b.reduce((s, p) => s + p.v[j] * p.n, 0) / n));
  });
  for (let i = 0; i < data.length; i += 4) {
    let best = palette[0],
      dist = Infinity;
    for (let p of palette) {
      let d = (data[i] - p[0]) ** 2 + (data[i + 1] - p[1]) ** 2 + (data[i + 2] - p[2]) ** 2;
      if (d < dist) {
        dist = d;
        best = p;
      }
    }
    data.set(best, i);
    data[i + 3] = 255;
  }
  return palette;
}
let materialHex = [
  '#00B5DB',
  '#DC1685',
  '#F4D900',
  '#222222',
  '#FAFAFA',
  '#B77B45',
  '#E6BA90',
  '#456B9B',
  '#628B5A',
];
const { hexRGB: rgbHex, rgbToLab: lab } = PipiColor;
function mapMaterial(image, w, h) {
  const canvas = crop(image, w, h),
    ctx = canvas.getContext('2d'),
    d = ctx.getImageData(0, 0, w, h),
    rgb = materialHex.map(rgbHex),
    labs = rgb.map(lab),
    ids = new Uint8Array(w * h),
    cache = new Map();
  for (let i = 0; i < ids.length; i++) {
    const k = i * 4,
      key = (d.data[k] << 16) | (d.data[k + 1] << 8) | d.data[k + 2];
    let best = cache.get(key);
    if (best === undefined) {
      const c = lab([d.data[k], d.data[k + 1], d.data[k + 2]]);
      let dist = Infinity;
      best = 0;
      labs.forEach((v, j) => {
        const a = PipiColor.deltaE2000(c, v);
        if (a < dist) {
          dist = a;
          best = j;
        }
      });
      cache.set(key, best);
    }
    ids[i] = best;
    d.data.set([...rgb[best], 255], k);
  }
  ctx.putImageData(d, 0, 0);
  return { canvas, ids, w, h };
}
function parsePalette() {
  const a = $('physicalPalette')
    .value.trim()
    .split(/[\s,;]+/)
    .filter(Boolean)
    .map((s) => s.toUpperCase());
  if (
    a.length < 2 ||
    a.length > 9 ||
    a.some((s) => !/^#[0-9A-F]{6}$/.test(s)) ||
    new Set(a).size !== a.length
  )
    throw Error('Introduce de 2 a 9 colores HEX distintos, por ejemplo #FF0000.');
  return a;
}
function renderDigital() {
  let n = +$('res').value,
    m = +$('colors').value,
    s = +$('size').value,
    c = $('pixelCanvas');
  c.width = c.height = n;
  let g = c.getContext('2d');
  g.drawImage(crop(source, n, n), 0, 0);
  let d = g.getImageData(0, 0, n, n),
    p = quantize(d.data, m);
  g.putImageData(d, 0, 0);
  c.style.borderColor = $('frame').value;
  $('swatches').replaceChildren(
    ...p.map((v) => {
      let e = document.createElement('span');
      e.style.backgroundColor = `rgb(${v.join(',')})`;
      e.title = e.style.backgroundColor;
      return e;
    }),
  );
  PipiI18n.setPrice(
    $('quote'),
    PipiPricing.base[s] + (m > PipiPricing.digitalThreshold ? PipiPricing.digitalExtra : 0),
  );
  PipiI18n.setText(
    $('pitch'),
    `${p.length} colores digitales · ${(s / n).toFixed(2)} mm por píxel`,
  );
}
function update() {
  if ($('paletteMode').value === 'digital') {
    renderDigital();
    $('exportPixel').disabled = $('exportPixelStl').disabled = true;
    PipiI18n.setText($('exportStatus'), 'Selecciona Filamentos directos para exportar.');
    return;
  }
  const n = +$('res').value,
    s = +$('size').value,
    p = mapMaterial(source, n, n),
    c = $('pixelCanvas');
  c.width = c.height = n;
  c.getContext('2d').drawImage(p.canvas, 0, 0);
  c.style.borderColor = $('frame').value;
  const used = [...new Set(p.ids)];
  $('swatches').replaceChildren(
    ...used.map((i) => {
      const el = document.createElement('span');
      el.style.background = materialHex[i];
      el.title = materialHex[i];
      return el;
    }),
  );
  PipiI18n.setPrice($('quote'), PipiPricing.base[s]);
  PipiI18n.setText(
    $('pitch'),
    `${used.length} colores directos · ${(s / n).toFixed(2)} mm por píxel`,
  );
  const small = s / n < 0.6;
  $('exportPixel').disabled = $('exportPixelStl').disabled = small || exporting;
  PipiI18n.setText(
    $('exportStatus'),
    small
      ? 'Píxel inferior a 0,6 mm. Aumenta el tamaño o reduce la resolución.'
      : 'Modelo: base de 1,6 mm + píxeles de 0,8 mm. Prueba de fabricación, no validado en impresora.',
  );
}
function multiData() {
  const n = +$('mvN').value,
    w = +$('mvSize').value,
    h = (w * 2) / 3,
    rows = Math.max(1, Math.round((n * 2) / 3));
  return { n, w, h, rows, a: mapMaterial(left, n, rows), b: mapMaterial(right, n, rows) };
}
function drawMulti() {
  const { n, w, h, rows, a, b } = multiData(),
    c = $('multi'),
    g = c.getContext('2d'),
    angle = (+$('angle').value * Math.PI) / 180,
    co = Math.cos(angle),
    si = Math.sin(angle),
    p = w / n,
    depth = p / 2,
    k = Math.min(500 / w, 265 / h),
    H = h * k,
    top = (c.height - H) / 2,
    project = (x, z) => c.width / 2 + ((x - w / 2) * co - z * si) * k;
  g.fillStyle = '#ede9df';
  g.fillRect(0, 0, c.width, c.height);
  let faces = [];
  for (let j = 0; j < n; j++) {
    let x = j * p,
      mid = x + p / 2,
      end = x + p;
    for (let side = 0; side < 2; side++) {
      let x0 = side ? mid : x,
        x1 = side ? end : mid,
        z0 = side ? depth : 0,
        z1 = side ? 0 : depth,
        u0 = project(x0, z0),
        u1 = project(x1, z1);
      if (u1 <= u0 + 0.0001) continue;
      faces.push({
        u0,
        u1,
        j,
        img: side ? b.canvas : a.canvas,
        depth: ((x0 + x1) / 2) * si + ((z0 + z1) / 2) * co,
      });
    }
  }
  faces.sort((x, y) => x.depth - y.depth);
  g.imageSmoothingEnabled = false;
  for (let f of faces) g.drawImage(f.img, f.j, 0, 1, rows, f.u0, top, f.u1 - f.u0 + 0.15, H);
  $('angleLabel').textContent = $('angle').value + '°';
}

function buildPixel() {
  const n = +$('res').value,
    size = +$('size').value;
  if ($('paletteMode').value !== 'physical' || size / n < 0.6)
    throw Error('Selecciona filamentos directos y un píxel de al menos 0,6 mm.');
  return PipiGeometry.buildPixel({
    n,
    size,
    ids: mapMaterial(source, n, n).ids,
    colors: materialHex,
  });
}
function buildMulti() {
  const { n, w, h, rows, a, b } = multiData();
  return PipiGeometry.buildMulti({ n, w, h, rows, left: a.ids, right: b.ids, colors: materialHex });
}
function saveBlob(blob, name) {
  const u = URL.createObjectURL(blob),
    a = document.createElement('a');
  a.href = u;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(u), 5000);
}

let exporting = false;
async function output(kind, format) {
  if (exporting) return;
  exporting = true;
  const stat = $(kind === 'pixel' ? 'exportStatus' : 'multiStatus');
  const buttons = ['exportPixel', 'exportPixelStl', 'exportMulti', 'exportMultiStl'].map($);
  buttons.forEach((b) => (b.disabled = true));
  try {
    PipiI18n.setText(stat, 'Preparando archivo…');
    const ms = kind === 'pixel' ? buildPixel() : buildMulti(),
      name = 'pipi-' + kind;
    const files =
      format === '3mf'
        ? PipiGeometry.modelFiles(ms)
        : [
            ...ms.map((m) => [m.name + '.stl', PipiGeometry.stl(m)]),
            [
              'LEEME.txt',
              PipiI18n.translate(
                'Importa todos los STL juntos como partes de un único objeto. Conserva las coordenadas originales. Asigna cada parte al filamento indicado en su nombre. Modelo experimental; revisa contactos, solapamientos, escala y trayectorias antes de imprimir. No incluye recetas de mezcla.',
              ),
            ],
          ];
    const bytes = await PipiZip.zip(files);
    saveBlob(
      new Blob([bytes], { type: 'application/zip' }),
      name + (format === '3mf' ? '.3mf' : '-stl.zip'),
    );
    PipiI18n.setText(
      stat,
      'Archivo generado: ' +
        ms.length +
        ' piezas por color. Verifica escala, asignación de materiales y trayectorias en el laminador.',
    );
  } catch (e) {
    PipiI18n.setText(stat, 'Error: ' + e.message);
  } finally {
    exporting = false;
    const blocked =
      $('paletteMode').value !== 'physical' || +$('size').value / +$('res').value < 0.6;
    $('exportPixel').disabled = $('exportPixelStl').disabled = blocked;
    $('exportMulti').disabled = $('exportMultiStl').disabled = false;
  }
}
async function load(file) {
  if (!file) return null;
  if (
    !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ||
    file.size > 15 * 1024 * 1024
  )
    throw Error('Selecciona JPG, PNG o WebP de hasta 15 MB.');
  let url = URL.createObjectURL(file);
  try {
    let i = new Image();
    i.src = url;
    await i.decode();
    if (i.naturalWidth * i.naturalHeight > 30000000) throw Error('Imagen demasiado grande.');
    return i;
  } finally {
    URL.revokeObjectURL(url);
  }
}
$('upload').onchange = async (e) => {
  try {
    let i = await load(e.target.files[0]);
    if (i) {
      source = i;
      update();
      PipiI18n.setText($('pixelStatus'), 'Foto procesada localmente.');
    }
  } catch (err) {
    PipiI18n.setText($('pixelStatus'), err.message);
  }
};
['res', 'colors', 'size', 'frame'].forEach((id) => ($(id).onchange = update));
$('save').onclick = () => {
  let a = document.createElement('a'),
    p = $('pixelCanvas'),
    c = cv(768, 768),
    g = c.getContext('2d');
  g.fillStyle = $('frame').value;
  g.fillRect(0, 0, 768, 768);
  g.imageSmoothingEnabled = false;
  g.drawImage(p, 32, 32, 704, 704);
  a.href = c.toDataURL();
  a.download = 'pipi-pixel-preview.png';
  a.click();
};
$('paletteMode').onchange = () => {
  $('palettePanel').hidden = $('paletteMode').value !== 'physical';
  $('colors').disabled = $('paletteMode').value === 'physical';
  update();
};
$('applyPalette').onclick = () => {
  try {
    materialHex = parsePalette();
    PipiI18n.setText($('paletteError'), 'Paleta aplicada.');
    update();
    drawMulti();
  } catch (e) {
    PipiI18n.setText($('paletteError'), e.message);
  }
};
$('angle').oninput = drawMulti;
document.querySelectorAll('[data-angle]').forEach(
  (b) =>
    (b.onclick = () => {
      $('angle').value = b.dataset.angle;
      drawMulti();
    }),
);
[
  ['leftFile', 'left'],
  ['rightFile', 'right'],
].forEach(
  ([id, side]) =>
    ($(id).onchange = async (e) => {
      try {
        let i = await load(e.target.files[0]);
        if (i) {
          if (side === 'left') left = i;
          else right = i;
          drawMulti();
          PipiI18n.setText($('multiStatus'), 'Imagen procesada localmente.');
        }
      } catch (err) {
        PipiI18n.setText($('multiStatus'), err.message);
      }
    }),
);
['mvN', 'mvSize'].forEach((id) => ($(id).onchange = drawMulti));
$('exportPixel').onclick = () => output('pixel', '3mf');
$('exportPixelStl').onclick = () => output('pixel', 'stl');
$('exportMulti').onclick = () => output('multi', '3mf');
$('exportMultiStl').onclick = () => output('multi', 'stl');
update();
drawMulti();
