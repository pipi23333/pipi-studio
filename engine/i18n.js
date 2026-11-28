'use strict';
const PipiI18n = (function createI18n(rows) {
  const translations = new Map(rows.map(([es, en, zh]) => [es, { en, zh }]));
  const valid = (x) => ['es', 'en', 'zh'].includes(x),
    normalize = (s) => s.replace(/\s+/g, ' ').trim();
  let language = 'es',
    staticNodes = [],
    attributes = [],
    dynamic = new Map(),
    listeners = [],
    mounted = false;
  const locale = () => ({ es: 'es-ES', en: 'en-GB', zh: 'zh-CN' })[language];
  function translate(source, lang = language) {
    if (lang === 'es' || !valid(lang)) return source;
    const value = String(source);
    if (translations.has(value)) return translations.get(value)[lang];
    let m;
    if ((m = value.match(/^(\d+) colores (digitales|directos) · ([\d.]+) mm por píxel$/)))
      return lang === 'en'
        ? `${m[1]} ${m[2] === 'directos' ? 'direct filament' : 'digital'} colors · ${m[3]} mm per pixel`
        : `${m[1]} 种${m[2] === 'directos' ? '直接耗材' : '数字'}颜色 · 每像素 ${m[3]} mm`;
    if (
      (m = value.match(
        /^Archivo generado: (\d+) piezas por color\. Verifica escala, asignación de materiales y trayectorias en el laminador\.$/,
      ))
    )
      return lang === 'en'
        ? `File generated: ${m[1]} color parts. Verify scale, material assignment and paths in the slicer.`
        : `文件已生成：${m[1]} 个颜色部件。请在切片器检查比例、材料分配及路径。`;
    if ((m = value.match(/^(.+) · (top|left45|right45|vertical) · (\d+) recetas · (\d+) medidas$/)))
      return lang === 'en'
        ? `${m[1]} · ${translate(m[2], lang)} · ${m[3]} recipes · ${m[4]} measured`
        : `${m[1]} · ${translate(m[2], lang)} · ${m[3]} 种配方 · ${m[4]} 种实测`;
    if ((m = value.match(/^Receta (.+) guardada en memoria\.$/)))
      return lang === 'en' ? `Recipe ${m[1]} saved in memory.` : `配方 ${m[1]} 已保存在内存中。`;
    if ((m = value.match(/^Hoja (\d+)$/))) return lang === 'en' ? `Sheet ${m[1]}` : `第 ${m[1]} 页`;
    if ((m = value.match(/^(.* \/ )(pending|illustrative|reference|measured)$/)))
      return m[1] + translate(m[2], lang);
    if (
      (m = value.match(
        /^ΔE00 medio ([\d.]+) · P95 ([\d.]+) · máximo ([\d.]+) · <2: ([\d.]+)% · (\d+) recetas$/,
      ))
    )
      return lang === 'en'
        ? `Mean ΔE00 ${m[1]} · P95 ${m[2]} · max ${m[3]} · <2: ${m[4]}% · ${m[5]} recipes`
        : `平均 ΔE00 ${m[1]} · P95 ${m[2]} · 最大 ${m[3]} · <2：${m[4]}% · ${m[5]} 种配方`;
    if (/ píxeles(?:\n|$)/.test(value))
      return value.replace(/ píxeles(?=\n|$)/g, lang === 'en' ? ' pixels' : ' 像素');
    for (const prefix of [
      'Error: ',
      'Receta inválida: ',
      'Origen inválido: ',
      'Lab inválido: ',
      'Indica instrumento y condiciones de medición: ',
    ])
      if (value.startsWith(prefix))
        return translations.get(prefix)[lang] + translate(value.slice(prefix.length), lang);
    return source;
  }
  function setText(el, source) {
    dynamic.set(el, () => translate(source));
    el.textContent = translate(source);
  }
  function setPrice(el, amount) {
    const render = () =>
      new Intl.NumberFormat(locale(), { style: 'currency', currency: 'EUR' }).format(amount);
    dynamic.set(el, render);
    el.textContent = render();
  }
  function apply(lang) {
    if (!valid(lang)) throw Error('Unsupported language');
    language = lang;
    for (const [node, source] of staticNodes) {
      const key = normalize(source),
        translated = translate(key);
      node.nodeValue =
        language === 'es' || translated === key
          ? source
          : source.replace(/\S[\s\S]*\S|\S/, translated);
    }
    for (const [el, attr, source] of attributes)
      el.setAttribute(attr, translate(normalize(source)));
    for (const [el, render] of dynamic) {
      if (el.isConnected === false) {
        dynamic.delete(el);
        continue;
      }
      el.textContent = render();
    }
    for (const fn of listeners) fn(lang);
  }
  function chooseInitial(search, storage) {
    const q = String(search || '').match(/(?:^|[?&])lang=(es|en|zh)(?:&|$)/)?.[1];
    if (valid(q)) return q;
    try {
      const saved = storage?.getItem('pipi-language');
      if (valid(saved)) return saved;
    } catch {}
    return null;
  }
  // Browser preference is a recommendation, never an explicit saved choice.
  function recommendLanguage(navigator = {}) {
    for (const tag of [navigator.language, ...(navigator.languages || [])]) {
      const language = typeof tag === 'string' ? tag.toLowerCase().split(/[-_]/)[0] : '';
      if (valid(language)) return language;
    }
    return 'es';
  }
  function hasTranslation(source, lang) {
    if (!['en','zh'].includes(lang)) return false;
    const entry = translations.get(source);
    if (entry) return typeof entry[lang] === 'string' && entry[lang].trim().length > 0;
    return translate(source, lang) !== source;
  }
  function mount(doc, platform) {
    if (mounted) return;
    mounted = true;
    const gate = doc.getElementById('languageGate'),
      switcher = doc.getElementById('languageSwitch'),
      cancel = doc.getElementById('languageCancel');
    const page = [...doc.querySelectorAll('body > header, body > main, body > footer')];
    const recommendation = doc.getElementById('languageRecommendation');
    function setBackgroundHidden(hidden) {
      for (const el of page) {
        el.inert = hidden;
        if (hidden) el.setAttribute('aria-hidden', 'true');
        else el.removeAttribute('aria-hidden');
      }
    }
    const walker = doc.createTreeWalker(doc.body, 4);
    let node;
    while ((node = walker.nextNode())) {
      if (
        !node.parentElement.closest(
          '#languageGate,#languageSwitch,script,style,textarea,pre,code,noscript',
        ) &&
        normalize(node.nodeValue)
      )
        staticNodes.push([node, node.nodeValue]);
    }
    staticNodes.push([doc.querySelector('title').firstChild, doc.title]);
    for (const el of doc.querySelectorAll('[aria-label],[alt],[placeholder]')) {
      if (el.closest('#languageGate,#languageSwitch')) continue;
      for (const attr of ['aria-label', 'alt', 'placeholder'])
        if (el.hasAttribute(attr)) attributes.push([el, attr, el.getAttribute(attr)]);
    }
    let selected = false,
      previousFocus = null;
    const buttons = [...gate.querySelectorAll('[data-language]')];
    function close() {
      gate.hidden = true;
      doc.body.removeAttribute('data-language-pending');
      setBackgroundHidden(false);
      if (previousFocus?.isConnected && previousFocus !== doc.body) previousFocus.focus();
      else switcher.focus();
    }
    function open() {
      previousFocus = doc.activeElement;
      gate.hidden = false;
      cancel.hidden = !selected;
      doc.body.setAttribute('data-language-pending', '');
      for (const b of buttons) {
        if (b.dataset.language === language) b.setAttribute('data-recommended', '');
        else b.removeAttribute('data-recommended');
      }
      recommendation.hidden = selected;
      recommendation.textContent = {
        es: 'Recomendado según tu navegador: Español',
        en: 'Recommended for your browser: English',
        zh: '根据浏览器语言推荐：简体中文',
      }[language];
      recommendation.lang = language === 'zh' ? 'zh-CN' : language;
      buttons.find((b) => b.dataset.language === language)?.focus();
      setBackgroundHidden(true);
    }
    function select(lang) {
      selected = true;
      try {
        platform.localStorage.setItem('pipi-language', lang);
      } catch {}
      try {
        const u = new URL(platform.location.href);
        u.searchParams.set('lang', lang);
        platform.history.replaceState(null, '', u.href);
      } catch {}
      apply(lang);
      close();
    }
    listeners.push((lang) => {
      doc.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
      switcher.textContent = {
        es: 'Idioma · Español',
        en: 'Language · English',
        zh: '语言 · 简体中文',
      }[lang];
      for (const a of doc.querySelectorAll(
        'a[href="index.html"], a[href="color-lab.html"], a[data-language-link]',
      )) {
        const href = a.dataset.languageLink || a.getAttribute('href').split('?')[0];
        a.dataset.languageLink = href;
        a.setAttribute('href', href + '?lang=' + lang);
      }
    });
    buttons.forEach((b) => b.addEventListener('click', () => select(b.dataset.language)));
    switcher.addEventListener('click', open);
    cancel.addEventListener('click', close);
    gate.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && selected) {
        e.preventDefault();
        close();
      }
      if (e.key === 'Tab') {
        const focusable = [...buttons, ...(selected ? [cancel] : [])],
          i = focusable.indexOf(doc.activeElement),
          next = (i + (e.shiftKey ? -1 : 1) + focusable.length) % focusable.length;
        e.preventDefault();
        focusable[next].focus();
      }
    });
    let storage;
    try {
      storage = platform.localStorage;
    } catch {}
    const initial = chooseInitial(platform.location.search, storage);
    if (initial) {
      selected = true;
      apply(initial);
      close();
    } else {
      apply(recommendLanguage(platform.navigator));
      open();
    }
  }
  return { translate, setText, setPrice, apply, locale, chooseInitial, recommendLanguage, hasTranslation, mount };
})([
  ['PIPI Studio · Laboratorio V2', 'PIPI Studio · Creative Lab', 'PIPI Studio · 创意实验室'],
  ['PIPI Color Lab 3.4', 'PIPI Color Lab 3.4', 'PIPI 色彩实验室 3.4'],
  ['Colecciones', 'Collections', '产品系列'],
  ['Personaliza', 'Customize', '个性定制'],
  [
    'Laboratorio V2 · Vista previa y archivos de prueba. No admite pedidos, pagos ni envíos. Los precios son orientativos.',
    'Lab prototype · Previews and test files. Orders, payments and shipping are unavailable. Prices are indicative.',
    '研发实验室 · 提供预览和测试文件。暂不支持下单、支付或配送。价格仅供参考。',
  ],
  [
    'Concepto de estudio creativo · Madrid',
    'Creative studio concept · Madrid',
    '创意工作室概念 · 马德里',
  ],
  [
    'Tus recuerdos, en otra dimensión.',
    'Your memories, in another dimension.',
    '让回忆进入新的维度。',
  ],
  [
    'Explora el arte de píxeles y las imágenes que cambian con tu perspectiva.',
    'Explore pixel art and images that change with your perspective.',
    '探索像素艺术与随视角变化的图像。',
  ],
  ['Prueba el personalizador', 'Try the customizer', '体验定制工具'],
  ['Ilustración de ejemplo', 'Example illustration', '示例插画'],
  ['Pixel Art', 'Pixel Art', '像素艺术'],
  [
    'Retratos personalizados, cuadros y recuerdos.',
    'Custom portraits, artwork and keepsakes.',
    '定制肖像、艺术画与纪念品。',
  ],
  ['Probar · desde 19,90 €', 'Try · from €19.90', '体验 · €19.90 起'],
  [
    'Dos imágenes en una superficie de relieve.',
    'Two images on one relief surface.',
    '在同一浮雕表面呈现两幅图像。',
  ],
  ['Explorar prototipo', 'Explore prototype', '探索原型'],
  ['Ink Art', 'Ink Art', '电子墨水艺术'],
  [
    'Marcos y carcasas para tinta electrónica.',
    'Frames and cases for e-paper.',
    '电子墨水屏相框与外壳。',
  ],
  ['En investigación', 'In research', '研发中'],
  ['Personaliza tu Pixel Art', 'Customize your Pixel Art', '定制你的像素画'],
  ['Vista previa pixelada', 'Pixelated preview', '像素画预览'],
  [
    'Imagen de ejemplo. Tu foto se procesa en este navegador.',
    'Example image. Your photo is processed in this browser.',
    '示例图片。你的照片仅在本浏览器内处理。',
  ],
  ['Paleta de colores', 'Color palette', '调色板'],
  ['Tu imagen (JPG, PNG, WebP)', 'Your image (JPG, PNG, WebP)', '上传图片（JPG、PNG、WebP）'],
  ['Resolución', 'Resolution', '分辨率'],
  ['Máximo de colores', 'Maximum colors', '最大颜色数'],
  ['Tamaño', 'Size', '尺寸'],
  ['Modo de color', 'Color mode', '色彩模式'],
  ['Paleta digital de la foto', 'Digital photo palette', '照片数字调色板'],
  ['Filamentos directos (hasta 9)', 'Direct filaments (up to 9)', '直接耗材（最多9种）'],
  [
    'Colores de filamento (HEX, separados por comas)',
    'Filament colors (HEX, comma-separated)',
    '耗材颜色（HEX，用逗号分隔）',
  ],
  [
    'Valores ilustrativos. Sustitúyelos por colores medidos de tus filamentos. El primer color se usa también en la base.',
    'Illustrative values. Replace them with measured filament colors. The first color is also used for the base.',
    '示例色值。请替换为耗材实测颜色；第一种颜色也用于底板。',
  ],
  ['Aplicar paleta', 'Apply palette', '应用调色板'],
  ['Marco', 'Frame', '相框'],
  ['Negro', 'Black', '黑色'],
  ['Blanco', 'White', '白色'],
  ['Arena', 'Sand', '沙色'],
  ['Verde', 'Green', '绿色'],
  [
    'Precio orientativo con IVA, sin envío. No es una oferta.',
    'Indicative price including VAT, excluding shipping. Not an offer.',
    '参考价格含增值税，不含运费，非正式报价。',
  ],
  ['Guardar vista previa PNG', 'Save PNG preview', '保存 PNG 预览'],
  ['Exportar modelo Pixel 3MF', 'Export Pixel 3MF model', '导出像素画 3MF'],
  ['Exportar piezas STL (ZIP)', 'Export STL parts (ZIP)', '导出 STL 部件（ZIP）'],
  [
    'La paleta digital no representa colores físicos. Para fabricar, selecciona Filamentos directos. El 3MF contiene piezas por color, no recetas de mezcla ni un perfil de Bambu Studio. El marco de la vista previa no forma parte del modelo exportado.',
    'The digital palette does not represent physical colors. Select Direct filaments for manufacturing. The 3MF contains parts by color, without mixing recipes or a Bambu Studio profile. The preview frame is not included in the exported model.',
    '数字调色板不代表实体颜色。制造时请选择直接耗材。3MF 包含按颜色分组的部件，不含混色配方或 Bambu Studio 配置。预览相框不包含在导出模型中。',
  ],
  ['Dos imágenes, nuevas perspectivas', 'Two images, new perspectives', '两幅图像，全新视角'],
  [
    'Simulación geométrica de una superficie con facetas',
    'Geometric simulation of a faceted surface',
    '多面浮雕几何模拟',
  ],
  ['Imagen izquierda', 'Left image', '左侧图片'],
  ['Imagen derecha', 'Right image', '右侧图片'],
  ['Crestas / columnas', 'Ridges / columns', '棱柱／列数'],
  ['Ancho del relieve', 'Relief width', '浮雕宽度'],
  [
    'MultiView usa la paleta de filamentos del apartado Pixel Art. Cada cresta tiene dos caras a 45°.',
    'MultiView uses the Pixel Art filament palette. Each ridge has two 45° faces.',
    'MultiView 使用像素画的耗材调色板，每条棱柱具有两个45°斜面。',
  ],
  ['Ángulo de observación', 'Viewing angle', '观察角度'],
  ['Izquierda', 'Left', '左侧'],
  ['Frontal', 'Front', '正面'],
  ['Derecha', 'Right', '右侧'],
  [
    'Proyección ortográfica de la geometría exportada, con oclusión por las crestas. Sin simulación de luz o mezcla óptica. El frontal combina las dos imágenes.',
    'Orthographic projection of exported geometry with ridge occlusion. No lighting or optical mixing simulation. The front view combines both images.',
    '导出几何的正交投影，包含棱柱遮挡。不模拟光照或光学混色，正面会结合两幅图像。',
  ],
  ['Exportar relieve 3MF', 'Export relief 3MF', '导出浮雕 3MF'],
  [
    'PIPI Studio · Laboratorio V3.4 de trabajo',
    'PIPI Studio · V3.4 working lab',
    'PIPI Studio · V3.4 研发实验室',
  ],
  [
    'Sin transacciones. Antes de publicar: verificar marca, datos legales, privacidad, seguridad de productos y precios. Las imágenes seleccionadas se procesan localmente y no se envían a ningún servidor.',
    'No transactions. Before launch: verify branding, legal details, privacy, product safety and prices. Selected images are processed locally and never sent to a server.',
    '暂不支持交易。正式上线前需核实品牌、法律信息、隐私、产品安全及价格。所选图片仅在本地处理，不会发送至服务器。',
  ],
  ['Volver a Pixel / MultiView', 'Back to Pixel / MultiView', '返回像素画／MultiView'],
  ['V3.1–V3.4 · LABORATORIO DE COLOR', 'V3.1–V3.4 · COLOR LAB', 'V3.1 至 V3.4 · 色彩实验室'],
  ['Color Lab.', 'Color Lab.', '色彩实验室'],
  ['Color Lab V3.4', 'Color Lab V3.4', '色彩实验室 V3.4'],
  [
    'De la fotografía a recetas de color verificables mediante CIEDE2000.',
    'From photographs to verifiable color recipes with CIEDE2000.',
    '使用 CIEDE2000 将照片转换为可验证的色彩配方。',
  ],
  [
    'Prototipo. No contiene mezclas H3C medidas ni instrucciones de laminado. Los colores de pantalla son aproximaciones; la geometría 3MF/STL original sigue usando filamentos directos.',
    'Prototype. No measured H3C mixes or slicer instructions are included. Screen colors are approximate; existing 3MF/STL geometry still uses direct filaments.',
    '研发原型。尚无 H3C 实测混色或切片指令。屏幕颜色仅为近似值，原有 3MF/STL 几何仍采用直接耗材。',
  ],
  ['01 · Perfil y recetas', '01 · Profile and recipes', '01 · 校色配置与配方'],
  ['Intervalo de proporciones (%)', 'Ratio interval (%)', '配方比例间隔（%）'],
  ['Importar perfil JSON', 'Import JSON profile', '导入 JSON 校色配置'],
  ['Nuevo perfil pendiente', 'New unmeasured profile', '新建待测配置'],
  ['Cargar ejemplo', 'Load example', '加载示例'],
  ['Descargar JSON', 'Download JSON', '下载 JSON'],
  [
    'Los perfiles nuevos no tienen mediciones. Cambia ID, orientación, impresora, material, boquilla y capa en el JSON antes de registrar resultados. D65 / observador 2°. Conserva un archivo separado por configuración.',
    'New profiles contain no measurements. Edit ID, orientation, printer, material, nozzle and layer in the JSON before recording results. D65 / 2° observer. Keep a separate file for each configuration.',
    '新配置不含测量值。录入结果前，请在 JSON 中修改编号、朝向、打印机、材料、喷嘴和层高。采用 D65／2°观察者。每种配置单独保存。',
  ],
  ['Receta', 'Recipe', '配方'],
  ['Origen', 'Source', '数据来源'],
  ['Pendiente', 'Pending', '待测'],
  ['Ilustrativo', 'Illustrative', '示例'],
  ['Referencia', 'Reference', '参考'],
  ['Medido', 'Measured', '实测'],
  [
    'Instrumento, lote, secuencia de capas, condiciones y notas',
    'Instrument, batch, layer sequence, conditions and notes',
    '仪器、批次、叠层顺序、测量条件及备注',
  ],
  [
    'Instrumento / geometría / fondo / lote / fecha',
    'Instrument / geometry / background / batch / date',
    '仪器／几何／背景／批次／日期',
  ],
  ['Guardar medición / referencia', 'Save measurement / reference', '保存实测／参考数据'],
  [
    'Editor avanzado JSON: perfil, añadir, eliminar y modificar recetas',
    'Advanced JSON editor: profile, add, remove and edit recipes',
    '高级 JSON 编辑器：配置及配方增删改',
  ],
  ['Validar y aplicar JSON', 'Validate and apply JSON', '验证并应用 JSON'],
  ['02 · Análisis de fotografía', '02 · Photo analysis', '02 · 照片色彩分析'],
  ['Imagen local', 'Local image', '本地图片'],
  ['Conjunto de recetas', 'Recipe set', '配方集合'],
  ['Solo mediciones', 'Measured only', '仅实测数据'],
  [
    'Vista experimental (incluye ejemplos)',
    'Experimental preview (includes examples)',
    '实验预览（包含示例）',
  ],
  ['Analizar ΔE00', 'Analyze ΔE00', '分析 ΔE00'],
  ['Objetivo', 'Target', '目标图像'],
  ['Color asignado', 'Assigned color', '匹配颜色'],
  ['Error ΔE00', 'ΔE00 error', 'ΔE00 色差'],
  [
    'Selecciona una imagen y analiza. Sin mediciones, usa el modo experimental.',
    'Select an image and analyze. Without measurements, use experimental mode.',
    '请选择图片并分析。没有实测数据时，请使用实验预览模式。',
  ],
  ['PNG del error', 'Error PNG', '色差 PNG'],
  ['JSON del mapa de recetas', 'Recipe map JSON', '配方映射 JSON'],
  ['Uso de recetas', 'Recipe usage', '配方使用统计'],
  [
    'Comparación en Lab D65/2°, sin compensación de iluminación, textura ni gamut de monitor. La resolución se obtiene recortando al centro; transparencia sobre blanco.',
    'Comparison in Lab D65/2°, without lighting, texture or display gamut compensation. Resolution uses a center crop; transparency is composited over white.',
    '在 Lab D65/2° 下比较，不补偿光照、纹理或显示器色域。图像按中心裁切，透明区域以白色为底。',
  ],
  ['03 · Carta de calibración', '03 · Calibration chart', '03 · 校准色卡'],
  [
    'Guía de muestras de 15 × 15 mm, 3 mm de separación y hasta 64 posiciones por hoja. No es una simulación óptica de mezclas pendientes.',
    'Guide for 15 × 15 mm samples, 3 mm spacing and up to 64 positions per sheet. It does not simulate unmeasured mixes optically.',
    '15 × 15 mm 样块布局指南，间距3 mm，每页最多64个位置。不模拟待测配方的光学混色。',
  ],
  ['Hoja', 'Sheet', '页码'],
  ['Carta digital de muestras numeradas', 'Digital numbered sample chart', '数字编号校准色卡'],
  ['SVG de esta hoja', 'SVG of this sheet', '下载本页 SVG'],
  ['CSV de todas las recetas', 'CSV of all recipes', '下载全部配方 CSV'],
  ['Espesor de muestra (mm)', 'Sample thickness (mm)', '样块厚度（mm）'],
  ['STL de muestra 15 × 15 mm', '15 × 15 mm sample STL', '15 × 15 mm 样块 STL'],
  [
    'El STL es una muestra plana genérica sin asignación de material. Duplica e identifica cada pieza, configura las recetas admitidas en el laminador y verifica el orden de capas. Para caras inclinadas/verticales necesitarás probetas de la geometría y orientación correspondientes. Las coordenadas CSV son una guía de organización; no generan una placa multimaterial automática.',
    'The STL is a generic flat sample without material assignment. Duplicate and label each part, configure supported recipes in the slicer and verify layer order. Inclined/vertical faces require matching geometry and orientation samples. CSV coordinates are an organization guide; they do not generate an automatic multimaterial plate.',
    'STL 为无材料分配的通用平面样块。请复制并标记各部件，在切片器中配置支持的配方并检查层序。斜面或垂直面需要对应几何和朝向的样块。CSV 坐标仅用于布局参考，不自动生成多材料打印板。',
  ],
  [
    'Todo se procesa en el navegador; no se envían imágenes ni datos de calibración. Descarga el JSON para conservarlo antes de salir.',
    'Everything is processed in the browser; images and calibration data are not uploaded. Download JSON to keep it before leaving.',
    '所有内容均在浏览器内处理；图片及校色数据不会上传。离开前请下载 JSON 保存。',
  ],
  ['Pruebas reproducibles', 'Reproducible tests', '可复现测试'],
  [
    'Selecciona Filamentos directos para exportar.',
    'Select Direct filaments to export.',
    '请选择直接耗材模式后导出。',
  ],
  [
    'Píxel inferior a 0,6 mm. Aumenta el tamaño o reduce la resolución.',
    'Pixel below 0.6 mm. Increase size or lower resolution.',
    '像素小于0.6 mm，请增大尺寸或降低分辨率。',
  ],
  [
    'Modelo: base de 1,6 mm + píxeles de 0,8 mm. Prueba de fabricación, no validado en impresora.',
    'Model: 1.6 mm base + 0.8 mm pixels. Manufacturing prototype, not printer-validated.',
    '模型：1.6 mm 底板及0.8 mm 像素层。制造原型，尚未通过实体打印验证。',
  ],
  [
    'Introduce de 2 a 9 colores HEX distintos, por ejemplo #FF0000.',
    'Enter 2 to 9 distinct HEX colors, e.g. #FF0000.',
    '请输入2至9种不同的 HEX 颜色，例如 #FF0000。',
  ],
  [
    'Selecciona filamentos directos y un píxel de al menos 0,6 mm.',
    'Select direct filaments and a pixel size of at least 0.6 mm.',
    '请选择直接耗材，像素尺寸至少0.6 mm。',
  ],
  ['Preparando archivo…', 'Preparing file…', '正在生成文件…'],
  [
    'Selecciona JPG, PNG o WebP de hasta 15 MB.',
    'Choose JPG, PNG or WebP up to 15 MB.',
    '请选择不超过15 MB 的 JPG、PNG 或 WebP。',
  ],
  ['Imagen demasiado grande.', 'Image too large.', '图片尺寸过大。'],
  ['Foto procesada localmente.', 'Photo processed locally.', '照片已在本地处理。'],
  ['Paleta aplicada.', 'Palette applied.', '调色板已应用。'],
  ['Imagen procesada localmente.', 'Image processed locally.', '图片已在本地处理。'],
  [
    'Importa todos los STL juntos como partes de un único objeto. Conserva las coordenadas originales. Asigna cada parte al filamento indicado en su nombre. Modelo experimental; revisa contactos, solapamientos, escala y trayectorias antes de imprimir. No incluye recetas de mezcla.',
    'Import all STL files together as parts of one object. Keep original coordinates. Assign each part to the filament in its name. Experimental model: inspect contacts, overlaps, scale and paths before printing. No mixing recipes included.',
    '将全部 STL 一起作为同一对象的部件导入，保留原始坐标。按文件名分配耗材。实验模型，打印前检查接触面、重叠、尺寸及路径。不含混色配方。',
  ],
  [
    'Analiza de nuevo con las opciones actuales.',
    'Analyze again with the current options.',
    '请使用当前选项重新分析。',
  ],
  [
    'Perfil validado. Descarga JSON para conservarlo.',
    'Profile validated. Download JSON to keep it.',
    '配置验证通过，请下载 JSON 保存。',
  ],
  [
    '¿Sustituir el perfil actual? Descarga antes tus mediciones.',
    'Replace the current profile? Download your measurements first.',
    '替换当前配置？请先下载实测数据。',
  ],
  ['¿Sustituir el perfil actual?', 'Replace the current profile?', '替换当前配置？'],
  [
    'Introduce tres valores Lab separados por comas',
    'Enter three comma-separated Lab values',
    '请输入三个以逗号分隔的 Lab 值',
  ],
  ['Archivo demasiado grande (2 MB)', 'File too large (2 MB)', '文件过大（2 MB）'],
  [
    'Usa JPG, PNG o WebP de hasta 15 MB',
    'Use JPG, PNG or WebP up to 15 MB',
    '请使用不超过15 MB 的 JPG、PNG 或 WebP',
  ],
  ['Imagen lista. Pulsa Analizar.', 'Image ready. Click Analyze.', '图片已就绪，点击分析。'],
  ['Selecciona una imagen', 'Select an image', '请选择图片'],
  [
    'STL genérico generado; asigna recetas en el laminador.',
    'Generic STL generated; assign recipes in the slicer.',
    '通用 STL 已生成，请在切片器分配配方。',
  ],
  ['HEX inválido', 'Invalid HEX', 'HEX 格式无效'],
  ['Paso inválido', 'Invalid interval', '比例间隔无效'],
  [
    'Esquema inválido (1–300 recetas)',
    'Invalid schema (1–300 recipes)',
    '数据结构无效（1至300种配方）',
  ],
  [
    'Perfil inválido: Lab D65/2°, material, impresora, boquilla y capa',
    'Invalid profile: Lab D65/2°, material, printer, nozzle and layer',
    '配置无效：请检查 Lab D65/2°、材料、打印机、喷嘴和层高',
  ],
  ['ID inválido o duplicado', 'Invalid or duplicate ID', '编号无效或重复'],
  ['Modo inválido', 'Invalid mode', '模式无效'],
  ['No hay recetas elegibles', 'No eligible recipes', '没有符合条件的配方'],
  ['Dimensiones inválidas', 'Invalid dimensions', '尺寸无效'],
  [
    'No hay colores medidos para este perfil',
    'No measured colors for this profile',
    '当前配置没有实测颜色',
  ],
  ['Página inválida', 'Invalid page', '页码无效'],
  ['Espesor 1–10 mm', 'Thickness must be 1–10 mm', '厚度必须在1至10 mm之间'],
  [
    'Píxeles demasiado pequeños o dimensiones inválidas.',
    'Pixels too small or invalid dimensions.',
    '像素过小或尺寸无效。',
  ],
  ['Dimensiones inválidas.', 'Invalid dimensions.', '尺寸无效。'],
  ['Invalid palette', 'Invalid palette', '调色板无效'],
  ['Invalid grid', 'Invalid grid', '网格无效'],
  ['ZIP entry limit', 'ZIP entry limit', 'ZIP 条目数超限'],
  ['Invalid ZIP entry', 'Invalid ZIP entry', 'ZIP 条目无效'],
  ['ZIP32 size limit', 'ZIP32 size limit', 'ZIP32 文件大小超限'],
  ['pending', 'Pending', '待测'],
  ['illustrative', 'Illustrative', '示例'],
  ['reference', 'Reference', '参考'],
  ['measured', 'Measured', '实测'],
  ['top', 'Top', '顶面'],
  ['left45', 'Left 45°', '左45°斜面'],
  ['right45', 'Right 45°', '右45°斜面'],
  ['vertical', 'Vertical', '垂直面'],
  ['Error: ', 'Error: ', '错误：'],
  ['Receta inválida: ', 'Invalid recipe: ', '配方无效：'],
  ['Origen inválido: ', 'Invalid source: ', '数据来源无效：'],
  ['Lab inválido: ', 'Invalid Lab: ', 'Lab 无效：'],
  [
    'Indica instrumento y condiciones de medición: ',
    'Specify instrument and measurement conditions: ',
    '请注明仪器和测量条件：',
  ],
]);
if (typeof module !== 'undefined') module.exports = PipiI18n;
if (typeof document !== 'undefined' && typeof window !== 'undefined')
  PipiI18n.mount(document, window);
