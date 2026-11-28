'use strict';
function initColorLab(E, doc, platform) {
  'use strict';
  const $ = (id) => doc.getElementById(id);
  let db = E.exampleDB(),
    img = null,
    result = null,
    chartURL = null,
    token = 0;
  const json = (v) => JSON.stringify(v, null, 2);
  function status(id, v) {
    PipiI18n.setText($(id), v);
  }
  function option(value, label) {
    const el = doc.createElement('option');
    el.value = value;
    PipiI18n.setText(el, label);
    return el;
  }
  function clearAnalysis() {
    result = null;
    for (const id of ['downloadHeat', 'downloadMap']) $(id).disabled = true;
    for (const id of ['mapped', 'heat']) {
      const c = $(id);
      c.getContext('2d').clearRect(0, 0, c.width, c.height);
    }
    status('stats', 'Analiza de nuevo con las opciones actuales.');
    status('usage', '');
  }
  function save(data, type, name) {
    const url = platform.URL.createObjectURL(new platform.Blob([data], { type })),
      a = doc.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    platform.setTimeout(() => platform.URL.revokeObjectURL(url), 1000);
  }
  function selectRecipe() {
    const r = db.recipes.find((r) => r.id === $('recipe').value) || db.recipes[0];
    $('recipe').value = r.id;
    $('origin').value = r.source;
    $('labValue').value = r.lab ? r.lab.map((x) => +x.toFixed(5)).join(', ') : '';
    $('notes').value = r.notes || '';
  }
  function updateChart() {
    const page = +$('page').value || 1;
    if (chartURL) platform.URL.revokeObjectURL(chartURL);
    chartURL = platform.URL.createObjectURL(
      new platform.Blob([E.chartSVG(db, page)], { type: 'image/svg+xml' }),
    );
    $('chart').src = chartURL;
  }
  function sync(selected) {
    const n = E.eligible(db).length;
    status(
      'dbSummary',
      db.profile.id +
        ' · ' +
        db.profile.surface +
        ' · ' +
        db.recipes.length +
        ' recetas · ' +
        n +
        ' medidas',
    );
    $('recipe').replaceChildren(
      ...db.recipes.map((r) =>
        option(
          r.id,
          r.id + ' / ' + r.filaments.join('+') + ' / ' + r.ratios.join(':') + ' / ' + r.source,
        ),
      ),
    );
    $('recipe').value =
      selected && db.recipes.some((r) => r.id === selected) ? selected : db.recipes[0].id;
    selectRecipe();
    $('json').value = json(db);
    $('page').replaceChildren(
      ...Array.from({ length: Math.ceil(db.recipes.length / 64) }, (_, i) =>
        option(String(i + 1), 'Hoja ' + (i + 1)),
      ),
    );
    $('page').value = '1';
    updateChart();
    clearAnalysis();
  }
  function attempt(id, fn) {
    return (...args) => {
      try {
        return fn(...args);
      } catch (e) {
        status(id, e.message);
      }
    };
  }
  function setDB(v) {
    E.validateDB(v);
    db = v;
    sync();
    status('dbStatus', 'Perfil validado. Descarga JSON para conservarlo.');
  }
  $('generate').onclick = attempt('dbStatus', () => {
    if (
      !platform.confirm(
        PipiI18n.translate('¿Sustituir el perfil actual? Descarga antes tus mediciones.'),
      )
    )
      return;
    setDB({
      version: 1,
      profile: {
        ...E.defaultProfile(),
        id: 'new-d65-top',
        material: 'PLA',
        printer: 'Specify printer',
      },
      recipes: E.candidates(+$('step').value),
    });
  });
  $('demo').onclick = attempt('dbStatus', () => {
    if (platform.confirm(PipiI18n.translate('¿Sustituir el perfil actual?'))) setDB(E.exampleDB());
  });
  $('recipe').onchange = selectRecipe;
  $('origin').onchange = () => {
    if ($('origin').value === 'pending') $('labValue').value = '';
  };
  $('saveRecipe').onclick = attempt('dbStatus', () => {
    const id = $('recipe').value,
      v = JSON.parse(json(db)),
      r = v.recipes.find((x) => x.id === id);
    r.source = $('origin').value;
    r.notes = $('notes').value.trim();
    const a = $('labValue')
      .value.split(',')
      .map((x) => x.trim());
    if (r.source !== 'pending' && (a.length !== 3 || a.some((x) => x === '')))
      throw Error('Introduce tres valores Lab separados por comas');
    r.lab = r.source === 'pending' ? null : a.map(Number);
    E.validateDB(v);
    db = v;
    sync(id);
    status('dbStatus', 'Receta ' + id + ' guardada en memoria.');
  });
  $('applyJSON').onclick = attempt('dbStatus', () => setDB(JSON.parse($('json').value)));
  $('importDB').onchange = async () => {
    const f = $('importDB').files[0];
    if (!f) return;
    try {
      if (f.size > 2e6) throw Error('Archivo demasiado grande (2 MB)');
      if (platform.confirm(PipiI18n.translate('¿Sustituir el perfil actual?')))
        setDB(JSON.parse(await f.text()));
    } catch (e) {
      status('dbStatus', e.message);
    } finally {
      $('importDB').value = '';
    }
  };
  $('exportDB').onclick = () => save(json(db), 'application/json', db.profile.id + '.json');
  function drawTarget() {
    if (!img) return null;
    const n = +$('resolution').value,
      c = $('target');
    c.width = c.height = n;
    const g = c.getContext('2d');
    g.fillStyle = '#fff';
    g.fillRect(0, 0, n, n);
    const w = img.naturalWidth || img.width,
      h = img.naturalHeight || img.height,
      s = Math.max(n / w, n / h);
    g.drawImage(img, (n - w * s) / 2, (n - h * s) / 2, w * s, h * s);
    return g.getImageData(0, 0, n, n);
  }
  $('photo').onchange = async () => {
    const mine = ++token,
      f = $('photo').files[0];
    if (!f) return;
    img = null;
    clearAnalysis();
    try {
      if (f.size > 15e6 || !['image/png', 'image/jpeg', 'image/webp'].includes(f.type))
        throw Error('Usa JPG, PNG o WebP de hasta 15 MB');
      const u = platform.URL.createObjectURL(f);
      try {
        const next = new platform.Image();
        next.src = u;
        await next.decode();
        if (mine !== token) return;
        img = next;
        drawTarget();
        status('stats', 'Imagen lista. Pulsa Analizar.');
      } finally {
        platform.URL.revokeObjectURL(u);
      }
    } catch (e) {
      if (mine === token) status('stats', e.message);
    }
  };
  $('resolution').onchange = () => {
    clearAnalysis();
    drawTarget();
  };
  $('mode').onchange = clearAnalysis;
  $('analyze').onclick = attempt('stats', () => {
    clearAnalysis();
    const d = drawTarget();
    if (!d) throw Error('Selecciona una imagen');
    const n = d.width,
      r = E.mapImage(d.data, n, n, db, $('mode').value);
    for (const [id, p] of [
      ['mapped', r.out],
      ['heat', r.heat],
    ]) {
      const c = $(id);
      c.width = c.height = n;
      const g = c.getContext('2d'),
        im = g.createImageData(n, n);
      im.data.set(p);
      g.putImageData(im, 0, 0);
    }
    result = {
      version: 1,
      profile: db.profile,
      mode: $('mode').value,
      width: n,
      height: n,
      ids: r.ids,
      recipes: db.recipes.filter((x) => r.usage.some((u) => u.id === x.id)),
      stats: r.stats,
      usage: r.usage,
    };
    const s = r.stats;
    status(
      'stats',
      'ΔE00 medio ' +
        s.mean.toFixed(2) +
        ' · P95 ' +
        s.p95.toFixed(2) +
        ' · máximo ' +
        s.max.toFixed(2) +
        ' · <2: ' +
        s.under2.toFixed(1) +
        '% · ' +
        r.usage.length +
        ' recetas',
    );
    status(
      'usage',
      r.usage
        .sort((a, b) => b.count - a.count)
        .map((x) => x.id + ': ' + x.count + ' píxeles')
        .join('\n'),
    );
    $('downloadHeat').disabled = $('downloadMap').disabled = false;
  });
  $('downloadHeat').onclick = () => {
    if (!result) return;
    const a = doc.createElement('a');
    a.download = 'pipi-deltaE00.png';
    a.href = $('heat').toDataURL('image/png');
    a.click();
  };
  $('downloadMap').onclick = () => {
    if (result) save(json(result), 'application/json', 'pipi-recipe-map.json');
  };
  $('page').onchange = updateChart;
  $('downloadSVG').onclick = () =>
    save(
      E.chartSVG(db, +$('page').value),
      'image/svg+xml',
      db.profile.id + '-page-' + $('page').value + '.svg',
    );
  $('downloadCSV').onclick = () =>
    save(E.chartCSV(db), 'text/csv;charset=utf-8', db.profile.id + '-samples.csv');
  $('downloadSTL').onclick = attempt('chartStatus', () => {
    save(E.couponSTL(+$('thickness').value), 'model/stl', 'pipi-coupon-15mm.stl');
    status('chartStatus', 'STL genérico generado; asigna recetas en el laminador.');
  });
  sync();
  return { getDB: () => db, getResult: () => result };
}
initColorLab(PipiColor, document, window);
