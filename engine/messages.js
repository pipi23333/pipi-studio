'use strict';
const PipiMessages = {
  'home.title': {
    es: 'PIPI Studio · Laboratorio V2',
    en: 'PIPI Studio · Creative Lab',
    zh: 'PIPI Studio · 创意实验室',
  },
  'lab.title': {
    es: 'PIPI Color Lab 3.4',
    en: 'PIPI Color Lab 3.4',
    zh: 'PIPI 色彩实验室 3.4',
  },
  'nav.collections': {
    es: 'Colecciones',
    en: 'Collections',
    zh: '产品系列',
  },
  'nav.customize': {
    es: 'Personaliza',
    en: 'Customize',
    zh: '个性定制',
  },
  'home.prototype': {
    es: 'Laboratorio V2 · Vista previa y archivos de prueba. No admite pedidos, pagos ni envíos. Los precios son orientativos.',
    en: 'Lab prototype · Previews and test files. Orders, payments and shipping are unavailable. Prices are indicative.',
    zh: '研发实验室 · 提供预览和测试文件。暂不支持下单、支付或配送。价格仅供参考。',
  },
  'home.eyebrow': {
    es: 'Concepto de estudio creativo · Madrid',
    en: 'Creative studio concept · Madrid',
    zh: '创意工作室概念 · 马德里',
  },
  'home.hero.title': {
    es: 'Tus recuerdos, en otra dimensión.',
    en: 'Your memories, in another dimension.',
    zh: '让回忆进入新的维度。',
  },
  'home.hero.description': {
    es: 'Explora el arte de píxeles y las imágenes que cambian con tu perspectiva.',
    en: 'Explore pixel art and images that change with your perspective.',
    zh: '探索像素艺术与随视角变化的图像。',
  },
  'home.hero.cta': {
    es: 'Prueba el personalizador',
    en: 'Try the customizer',
    zh: '体验定制工具',
  },
  'home.hero.alt': {
    es: 'Ilustración de ejemplo',
    en: 'Example illustration',
    zh: '示例插画',
  },
  'product.pixel.name': {
    es: 'Pixel Art',
    en: 'Pixel Art',
    zh: '像素艺术',
  },
  'product.pixel.description': {
    es: 'Retratos personalizados, cuadros y recuerdos.',
    en: 'Custom portraits, artwork and keepsakes.',
    zh: '定制肖像、艺术画与纪念品。',
  },
  'product.pixel.cta': {
    es: 'Probar · desde 19,90 €',
    en: 'Try · from €19.90',
    zh: '体验 · €19.90 起',
  },
  'product.multi.description': {
    es: 'Dos imágenes en una superficie de relieve.',
    en: 'Two images on one relief surface.',
    zh: '在同一浮雕表面呈现两幅图像。',
  },
  'product.multi.cta': {
    es: 'Explorar prototipo',
    en: 'Explore prototype',
    zh: '探索原型',
  },
  'product.ink.name': {
    es: 'Ink Art',
    en: 'Ink Art',
    zh: '电子墨水艺术',
  },
  'product.ink.description': {
    es: 'Marcos y carcasas para tinta electrónica.',
    en: 'Frames and cases for e-paper.',
    zh: '电子墨水屏相框与外壳。',
  },
  'product.ink.research': {
    es: 'En investigación',
    en: 'In research',
    zh: '研发中',
  },
  'pixel.title': {
    es: 'Personaliza tu Pixel Art',
    en: 'Customize your Pixel Art',
    zh: '定制你的像素画',
  },
  'pixel.preview.alt': {
    es: 'Vista previa pixelada',
    en: 'Pixelated preview',
    zh: '像素画预览',
  },
  'pixel.example': {
    es: 'Imagen de ejemplo. Tu foto se procesa en este navegador.',
    en: 'Example image. Your photo is processed in this browser.',
    zh: '示例图片。你的照片仅在本浏览器内处理。',
  },
  'pixel.palette.alt': {
    es: 'Paleta de colores',
    en: 'Color palette',
    zh: '调色板',
  },
  'pixel.upload': {
    es: 'Tu imagen (JPG, PNG, WebP)',
    en: 'Your image (JPG, PNG, WebP)',
    zh: '上传图片（JPG、PNG、WebP）',
  },
  'common.resolution': {
    es: 'Resolución',
    en: 'Resolution',
    zh: '分辨率',
  },
  'pixel.colors': {
    es: 'Máximo de colores',
    en: 'Maximum colors',
    zh: '最大颜色数',
  },
  'pixel.size': {
    es: 'Tamaño',
    en: 'Size',
    zh: '尺寸',
  },
  'pixel.mode': {
    es: 'Modo de color',
    en: 'Color mode',
    zh: '色彩模式',
  },
  'pixel.mode.digital': {
    es: 'Paleta digital de la foto',
    en: 'Digital photo palette',
    zh: '照片数字调色板',
  },
  'pixel.mode.physical': {
    es: 'Filamentos directos (hasta 9)',
    en: 'Direct filaments (up to 9)',
    zh: '直接耗材（最多9种）',
  },
  'pixel.palette.input': {
    es: 'Colores de filamento (HEX, separados por comas)',
    en: 'Filament colors (HEX, comma-separated)',
    zh: '耗材颜色（HEX，用逗号分隔）',
  },
  'pixel.palette.hint': {
    es: 'Valores ilustrativos. Sustitúyelos por colores medidos de tus filamentos. El primer color se usa también en la base.',
    en: 'Illustrative values. Replace them with measured filament colors. The first color is also used for the base.',
    zh: '示例色值。请替换为耗材实测颜色；第一种颜色也用于底板。',
  },
  'pixel.palette.apply': {
    es: 'Aplicar paleta',
    en: 'Apply palette',
    zh: '应用调色板',
  },
  'pixel.frame': {
    es: 'Marco',
    en: 'Frame',
    zh: '相框',
  },
  'pixel.frame.black': {
    es: 'Negro',
    en: 'Black',
    zh: '黑色',
  },
  'pixel.frame.white': {
    es: 'Blanco',
    en: 'White',
    zh: '白色',
  },
  'pixel.frame.sand': {
    es: 'Arena',
    en: 'Sand',
    zh: '沙色',
  },
  'pixel.frame.green': {
    es: 'Verde',
    en: 'Green',
    zh: '绿色',
  },
  'pixel.price.hint': {
    es: 'Precio orientativo con IVA, sin envío. No es una oferta.',
    en: 'Indicative price including VAT, excluding shipping. Not an offer.',
    zh: '参考价格含增值税，不含运费，非正式报价。',
  },
  'pixel.save': {
    es: 'Guardar vista previa PNG',
    en: 'Save PNG preview',
    zh: '保存 PNG 预览',
  },
  'pixel.export.3mf': {
    es: 'Exportar modelo Pixel 3MF',
    en: 'Export Pixel 3MF model',
    zh: '导出像素画 3MF',
  },
  'common.export.stl': {
    es: 'Exportar piezas STL (ZIP)',
    en: 'Export STL parts (ZIP)',
    zh: '导出 STL 部件（ZIP）',
  },
  'pixel.manufacturing.notice': {
    es: 'La paleta digital no representa colores físicos. Para fabricar, selecciona Filamentos directos. El 3MF contiene piezas por color, no recetas de mezcla ni un perfil de Bambu Studio. El marco de la vista previa no forma parte del modelo exportado.',
    en: 'The digital palette does not represent physical colors. Select Direct filaments for manufacturing. The 3MF contains parts by color, without mixing recipes or a Bambu Studio profile. The preview frame is not included in the exported model.',
    zh: '数字调色板不代表实体颜色。制造时请选择直接耗材。3MF 包含按颜色分组的部件，不含混色配方或 Bambu Studio 配置。预览相框不包含在导出模型中。',
  },
  'multi.title': {
    es: 'Dos imágenes, nuevas perspectivas',
    en: 'Two images, new perspectives',
    zh: '两幅图像，全新视角',
  },
  'multi.preview.alt': {
    es: 'Simulación geométrica de una superficie con facetas',
    en: 'Geometric simulation of a faceted surface',
    zh: '多面浮雕几何模拟',
  },
  'multi.left.upload': {
    es: 'Imagen izquierda',
    en: 'Left image',
    zh: '左侧图片',
  },
  'multi.right.upload': {
    es: 'Imagen derecha',
    en: 'Right image',
    zh: '右侧图片',
  },
  'multi.columns': {
    es: 'Crestas / columnas',
    en: 'Ridges / columns',
    zh: '棱柱／列数',
  },
  'multi.width': {
    es: 'Ancho del relieve',
    en: 'Relief width',
    zh: '浮雕宽度',
  },
  'multi.palette.hint': {
    es: 'MultiView usa la paleta de filamentos del apartado Pixel Art. Cada cresta tiene dos caras a 45°.',
    en: 'MultiView uses the Pixel Art filament palette. Each ridge has two 45° faces.',
    zh: 'MultiView 使用像素画的耗材调色板，每条棱柱具有两个45°斜面。',
  },
  'multi.angle': {
    es: 'Ángulo de observación',
    en: 'Viewing angle',
    zh: '观察角度',
  },
  'multi.left': {
    es: 'Izquierda',
    en: 'Left',
    zh: '左侧',
  },
  'multi.front': {
    es: 'Frontal',
    en: 'Front',
    zh: '正面',
  },
  'multi.right': {
    es: 'Derecha',
    en: 'Right',
    zh: '右侧',
  },
  'multi.projection.hint': {
    es: 'Proyección ortográfica de la geometría exportada, con oclusión por las crestas. Sin simulación de luz o mezcla óptica. El frontal combina las dos imágenes.',
    en: 'Orthographic projection of exported geometry with ridge occlusion. No lighting or optical mixing simulation. The front view combines both images.',
    zh: '导出几何的正交投影，包含棱柱遮挡。不模拟光照或光学混色，正面会结合两幅图像。',
  },
  'multi.export.3mf': {
    es: 'Exportar relieve 3MF',
    en: 'Export relief 3MF',
    zh: '导出浮雕 3MF',
  },
  'home.footer.title': {
    es: 'PIPI Studio · Laboratorio V3.4 de trabajo',
    en: 'PIPI Studio · V3.4 working lab',
    zh: 'PIPI Studio · V3.4 研发实验室',
  },
  'home.footer.notice': {
    es: 'Sin transacciones. Antes de publicar: verificar marca, datos legales, privacidad, seguridad de productos y precios. Las imágenes seleccionadas se procesan localmente y no se envían a ningún servidor.',
    en: 'No transactions. Before launch: verify branding, legal details, privacy, product safety and prices. Selected images are processed locally and never sent to a server.',
    zh: '暂不支持交易。正式上线前需核实品牌、法律信息、隐私、产品安全及价格。所选图片仅在本地处理，不会发送至服务器。',
  },
  'lab.nav.back': {
    es: 'Volver a Pixel / MultiView',
    en: 'Back to Pixel / MultiView',
    zh: '返回像素画／MultiView',
  },
  'lab.eyebrow': {
    es: 'V3.1–V3.4 · LABORATORIO DE COLOR',
    en: 'V3.1–V3.4 · COLOR LAB',
    zh: 'V3.1 至 V3.4 · 色彩实验室',
  },
  'lab.heading': {
    es: 'Color Lab.',
    en: 'Color Lab.',
    zh: '色彩实验室',
  },
  'nav.lab': {
    es: 'Color Lab V3.4',
    en: 'Color Lab V3.4',
    zh: '色彩实验室 V3.4',
  },
  'lab.description': {
    es: 'De la fotografía a recetas de color verificables mediante CIEDE2000.',
    en: 'From photographs to verifiable color recipes with CIEDE2000.',
    zh: '使用 CIEDE2000 将照片转换为可验证的色彩配方。',
  },
  'lab.prototype': {
    es: 'Prototipo. No contiene mezclas H3C medidas ni instrucciones de laminado. Los colores de pantalla son aproximaciones; la geometría 3MF/STL original sigue usando filamentos directos.',
    en: 'Prototype. No measured H3C mixes or slicer instructions are included. Screen colors are approximate; existing 3MF/STL geometry still uses direct filaments.',
    zh: '研发原型。尚无 H3C 实测混色或切片指令。屏幕颜色仅为近似值，原有 3MF/STL 几何仍采用直接耗材。',
  },
  'lab.profile.heading': {
    es: '01 · Perfil y recetas',
    en: '01 · Profile and recipes',
    zh: '01 · 校色配置与配方',
  },
  'lab.ratio.step': {
    es: 'Intervalo de proporciones (%)',
    en: 'Ratio interval (%)',
    zh: '配方比例间隔（%）',
  },
  'lab.profile.import': {
    es: 'Importar perfil JSON',
    en: 'Import JSON profile',
    zh: '导入 JSON 校色配置',
  },
  'lab.profile.new': {
    es: 'Nuevo perfil pendiente',
    en: 'New unmeasured profile',
    zh: '新建待测配置',
  },
  'lab.profile.demo': {
    es: 'Cargar ejemplo',
    en: 'Load example',
    zh: '加载示例',
  },
  'lab.profile.download': {
    es: 'Descargar JSON',
    en: 'Download JSON',
    zh: '下载 JSON',
  },
  'lab.profile.hint': {
    es: 'Los perfiles nuevos no tienen mediciones. Cambia ID, orientación, impresora, material, boquilla y capa en el JSON antes de registrar resultados. D65 / observador 2°. Conserva un archivo separado por configuración.',
    en: 'New profiles contain no measurements. Edit ID, orientation, printer, material, nozzle and layer in the JSON before recording results. D65 / 2° observer. Keep a separate file for each configuration.',
    zh: '新配置不含测量值。录入结果前，请在 JSON 中修改编号、朝向、打印机、材料、喷嘴和层高。采用 D65／2°观察者。每种配置单独保存。',
  },
  'lab.recipe.label': {
    es: 'Receta',
    en: 'Recipe',
    zh: '配方',
  },
  'lab.source.label': {
    es: 'Origen',
    en: 'Source',
    zh: '数据来源',
  },
  'lab.source.pending': {
    es: 'Pendiente',
    en: 'Pending',
    zh: '待测',
  },
  'lab.source.illustrative': {
    es: 'Ilustrativo',
    en: 'Illustrative',
    zh: '示例',
  },
  'lab.source.reference': {
    es: 'Referencia',
    en: 'Reference',
    zh: '参考',
  },
  'lab.source.measured': {
    es: 'Medido',
    en: 'Measured',
    zh: '实测',
  },
  'lab.notes.label': {
    es: 'Instrumento, lote, secuencia de capas, condiciones y notas',
    en: 'Instrument, batch, layer sequence, conditions and notes',
    zh: '仪器、批次、叠层顺序、测量条件及备注',
  },
  'lab.notes.placeholder': {
    es: 'Instrumento / geometría / fondo / lote / fecha',
    en: 'Instrument / geometry / background / batch / date',
    zh: '仪器／几何／背景／批次／日期',
  },
  'lab.recipe.save': {
    es: 'Guardar medición / referencia',
    en: 'Save measurement / reference',
    zh: '保存实测／参考数据',
  },
  'lab.json.editor': {
    es: 'Editor avanzado JSON: perfil, añadir, eliminar y modificar recetas',
    en: 'Advanced JSON editor: profile, add, remove and edit recipes',
    zh: '高级 JSON 编辑器：配置及配方增删改',
  },
  'lab.json.invalid': {
    es: 'Formato JSON no válido.\nDetalle técnico: {detail}',
    en: 'Invalid JSON format.\nTechnical detail: {detail}',
    zh: 'JSON 格式无效。\n技术细节：{detail}',
  },
  'lab.json.apply': {
    es: 'Validar y aplicar JSON',
    en: 'Validate and apply JSON',
    zh: '验证并应用 JSON',
  },
  'lab.analysis.heading': {
    es: '02 · Análisis de fotografía',
    en: '02 · Photo analysis',
    zh: '02 · 照片色彩分析',
  },
  'lab.image.upload': {
    es: 'Imagen local',
    en: 'Local image',
    zh: '本地图片',
  },
  'lab.recipe.set': {
    es: 'Conjunto de recetas',
    en: 'Recipe set',
    zh: '配方集合',
  },
  'lab.mode.measured': {
    es: 'Solo mediciones',
    en: 'Measured only',
    zh: '仅实测数据',
  },
  'lab.mode.preview': {
    es: 'Vista experimental (incluye ejemplos)',
    en: 'Experimental preview (includes examples)',
    zh: '实验预览（包含示例）',
  },
  'lab.analyze': {
    es: 'Analizar ΔE00',
    en: 'Analyze ΔE00',
    zh: '分析 ΔE00',
  },
  'lab.target': {
    es: 'Objetivo',
    en: 'Target',
    zh: '目标图像',
  },
  'lab.assigned': {
    es: 'Color asignado',
    en: 'Assigned color',
    zh: '匹配颜色',
  },
  'lab.error.heading': {
    es: 'Error ΔE00',
    en: 'ΔE00 error',
    zh: 'ΔE00 色差',
  },
  'lab.analysis.hint': {
    es: 'Selecciona una imagen y analiza. Sin mediciones, usa el modo experimental.',
    en: 'Select an image and analyze. Without measurements, use experimental mode.',
    zh: '请选择图片并分析。没有实测数据时，请使用实验预览模式。',
  },
  'lab.heat.download': {
    es: 'PNG del error',
    en: 'Error PNG',
    zh: '色差 PNG',
  },
  'lab.map.download': {
    es: 'JSON del mapa de recetas',
    en: 'Recipe map JSON',
    zh: '配方映射 JSON',
  },
  'lab.usage.heading': {
    es: 'Uso de recetas',
    en: 'Recipe usage',
    zh: '配方使用统计',
  },
  'lab.analysis.conditions': {
    es: 'Comparación en Lab D65/2°, sin compensación de iluminación, textura ni gamut de monitor. La resolución se obtiene recortando al centro; transparencia sobre blanco.',
    en: 'Comparison in Lab D65/2°, without lighting, texture or display gamut compensation. Resolution uses a center crop; transparency is composited over white.',
    zh: '在 Lab D65/2° 下比较，不补偿光照、纹理或显示器色域。图像按中心裁切，透明区域以白色为底。',
  },
  'lab.chart.heading': {
    es: '03 · Carta de calibración',
    en: '03 · Calibration chart',
    zh: '03 · 校准色卡',
  },
  'lab.chart.hint': {
    es: 'Guía de muestras de 15 × 15 mm, 3 mm de separación y hasta 64 posiciones por hoja. No es una simulación óptica de mezclas pendientes.',
    en: 'Guide for 15 × 15 mm samples, 3 mm spacing and up to 64 positions per sheet. It does not simulate unmeasured mixes optically.',
    zh: '15 × 15 mm 样块布局指南，间距3 mm，每页最多64个位置。不模拟待测配方的光学混色。',
  },
  'lab.chart.page': {
    es: 'Hoja',
    en: 'Sheet',
    zh: '页码',
  },
  'lab.chart.alt': {
    es: 'Carta digital de muestras numeradas',
    en: 'Digital numbered sample chart',
    zh: '数字编号校准色卡',
  },
  'lab.chart.svg': {
    es: 'SVG de esta hoja',
    en: 'SVG of this sheet',
    zh: '下载本页 SVG',
  },
  'lab.chart.csv': {
    es: 'CSV de todas las recetas',
    en: 'CSV of all recipes',
    zh: '下载全部配方 CSV',
  },
  'lab.chart.thickness': {
    es: 'Espesor de muestra (mm)',
    en: 'Sample thickness (mm)',
    zh: '样块厚度（mm）',
  },
  'lab.chart.stl': {
    es: 'STL de muestra 15 × 15 mm',
    en: '15 × 15 mm sample STL',
    zh: '15 × 15 mm 样块 STL',
  },
  'lab.chart.notice': {
    es: 'El STL es una muestra plana genérica sin asignación de material. Duplica e identifica cada pieza, configura las recetas admitidas en el laminador y verifica el orden de capas. Para caras inclinadas/verticales necesitarás probetas de la geometría y orientación correspondientes. Las coordenadas CSV son una guía de organización; no generan una placa multimaterial automática.',
    en: 'The STL is a generic flat sample without material assignment. Duplicate and label each part, configure supported recipes in the slicer and verify layer order. Inclined/vertical faces require matching geometry and orientation samples. CSV coordinates are an organization guide; they do not generate an automatic multimaterial plate.',
    zh: 'STL 为无材料分配的通用平面样块。请复制并标记各部件，在切片器中配置支持的配方并检查层序。斜面或垂直面需要对应几何和朝向的样块。CSV 坐标仅用于布局参考，不自动生成多材料打印板。',
  },
  'lab.footer.notice': {
    es: 'Todo se procesa en el navegador; no se envían imágenes ni datos de calibración. Descarga el JSON para conservarlo antes de salir.',
    en: 'Everything is processed in the browser; images and calibration data are not uploaded. Download JSON to keep it before leaving.',
    zh: '所有内容均在浏览器内处理；图片及校色数据不会上传。离开前请下载 JSON 保存。',
  },
  'lab.tests': {
    es: 'Pruebas reproducibles',
    en: 'Reproducible tests',
    zh: '可复现测试',
  },
  'pixel.export.selectPhysical': {
    es: 'Selecciona Filamentos directos para exportar.',
    en: 'Select Direct filaments to export.',
    zh: '请选择直接耗材模式后导出。',
  },
  'pixel.export.pitchSmall': {
    es: 'Píxel inferior a 0,6 mm. Aumenta el tamaño o reduce la resolución.',
    en: 'Pixel below 0.6 mm. Increase size or lower resolution.',
    zh: '像素小于0.6 mm，请增大尺寸或降低分辨率。',
  },
  'pixel.export.modelHint': {
    es: 'Modelo: base de 1,6 mm + píxeles de 0,8 mm. Prueba de fabricación, no validado en impresora.',
    en: 'Model: 1.6 mm base + 0.8 mm pixels. Manufacturing prototype, not printer-validated.',
    zh: '模型：1.6 mm 底板及0.8 mm 像素层。制造原型，尚未通过实体打印验证。',
  },
  'error.palette.hex': {
    es: 'Introduce de 2 a 9 colores HEX distintos, por ejemplo #FF0000.',
    en: 'Enter 2 to 9 distinct HEX colors, e.g. #FF0000.',
    zh: '请输入2至9种不同的 HEX 颜色，例如 #FF0000。',
  },
  'error.pixel.pitch': {
    es: 'Selecciona filamentos directos y un píxel de al menos 0,6 mm.',
    en: 'Select direct filaments and a pixel size of at least 0.6 mm.',
    zh: '请选择直接耗材，像素尺寸至少0.6 mm。',
  },
  'common.export.preparing': {
    es: 'Preparando archivo…',
    en: 'Preparing file…',
    zh: '正在生成文件…',
  },
  'error.image.format': {
    es: 'Selecciona JPG, PNG o WebP de hasta 15 MB.',
    en: 'Choose JPG, PNG or WebP up to 15 MB.',
    zh: '请选择不超过15 MB 的 JPG、PNG 或 WebP。',
  },
  'error.image.large': {
    es: 'Imagen demasiado grande.',
    en: 'Image too large.',
    zh: '图片尺寸过大。',
  },
  'pixel.photo.ready': {
    es: 'Foto procesada localmente.',
    en: 'Photo processed locally.',
    zh: '照片已在本地处理。',
  },
  'pixel.palette.applied': {
    es: 'Paleta aplicada.',
    en: 'Palette applied.',
    zh: '调色板已应用。',
  },
  'multi.image.ready': {
    es: 'Imagen procesada localmente.',
    en: 'Image processed locally.',
    zh: '图片已在本地处理。',
  },
  'common.export.stlInstructions': {
    es: 'Importa todos los STL juntos como partes de un único objeto. Conserva las coordenadas originales. Asigna cada parte al filamento indicado en su nombre. Modelo experimental; revisa contactos, solapamientos, escala y trayectorias antes de imprimir. No incluye recetas de mezcla.',
    en: 'Import all STL files together as parts of one object. Keep original coordinates. Assign each part to the filament in its name. Experimental model: inspect contacts, overlaps, scale and paths before printing. No mixing recipes included.',
    zh: '将全部 STL 一起作为同一对象的部件导入，保留原始坐标。按文件名分配耗材。实验模型，打印前检查接触面、重叠、尺寸及路径。不含混色配方。',
  },
  'lab.analysis.again': {
    es: 'Analiza de nuevo con las opciones actuales.',
    en: 'Analyze again with the current options.',
    zh: '请使用当前选项重新分析。',
  },
  'lab.profile.valid': {
    es: 'Perfil validado. Descarga JSON para conservarlo.',
    en: 'Profile validated. Download JSON to keep it.',
    zh: '配置验证通过，请下载 JSON 保存。',
  },
  'lab.profile.replaceWarning': {
    es: '¿Sustituir el perfil actual? Descarga antes tus mediciones.',
    en: 'Replace the current profile? Download your measurements first.',
    zh: '替换当前配置？请先下载实测数据。',
  },
  'lab.profile.replace': {
    es: '¿Sustituir el perfil actual?',
    en: 'Replace the current profile?',
    zh: '替换当前配置？',
  },
  'error.lab.values': {
    es: 'Introduce tres valores Lab separados por comas',
    en: 'Enter three comma-separated Lab values',
    zh: '请输入三个以逗号分隔的 Lab 值',
  },
  'error.lab.fileSize': {
    es: 'Archivo demasiado grande (2 MB)',
    en: 'File too large (2 MB)',
    zh: '文件过大（2 MB）',
  },
  'error.lab.imageFormat': {
    es: 'Usa JPG, PNG o WebP de hasta 15 MB',
    en: 'Use JPG, PNG or WebP up to 15 MB',
    zh: '请使用不超过15 MB 的 JPG、PNG 或 WebP',
  },
  'lab.image.ready': {
    es: 'Imagen lista. Pulsa Analizar.',
    en: 'Image ready. Click Analyze.',
    zh: '图片已就绪，点击分析。',
  },
  'error.lab.imageMissing': {
    es: 'Selecciona una imagen',
    en: 'Select an image',
    zh: '请选择图片',
  },
  'lab.chart.generated': {
    es: 'STL genérico generado; asigna recetas en el laminador.',
    en: 'Generic STL generated; assign recipes in the slicer.',
    zh: '通用 STL 已生成，请在切片器分配配方。',
  },
  'error.color.hex': {
    es: 'HEX inválido',
    en: 'Invalid HEX',
    zh: 'HEX 格式无效',
  },
  'error.color.step': {
    es: 'Paso inválido',
    en: 'Invalid interval',
    zh: '比例间隔无效',
  },
  'error.color.schema': {
    es: 'Esquema inválido (1–300 recetas)',
    en: 'Invalid schema (1–300 recipes)',
    zh: '数据结构无效（1至300种配方）',
  },
  'error.color.profile': {
    es: 'Perfil inválido: Lab D65/2°, material, impresora, boquilla y capa',
    en: 'Invalid profile: Lab D65/2°, material, printer, nozzle and layer',
    zh: '配置无效：请检查 Lab D65/2°、材料、打印机、喷嘴和层高',
  },
  'error.color.id': {
    es: 'ID inválido o duplicado',
    en: 'Invalid or duplicate ID',
    zh: '编号无效或重复',
  },
  'error.color.mode': {
    es: 'Modo inválido',
    en: 'Invalid mode',
    zh: '模式无效',
  },
  'error.color.noRecipes': {
    es: 'No hay recetas elegibles',
    en: 'No eligible recipes',
    zh: '没有符合条件的配方',
  },
  'error.color.dimensions': {
    es: 'Dimensiones inválidas',
    en: 'Invalid dimensions',
    zh: '尺寸无效',
  },
  'error.color.noMeasured': {
    es: 'No hay colores medidos para este perfil',
    en: 'No measured colors for this profile',
    zh: '当前配置没有实测颜色',
  },
  'error.color.page': {
    es: 'Página inválida',
    en: 'Invalid page',
    zh: '页码无效',
  },
  'error.color.thickness': {
    es: 'Espesor 1–10 mm',
    en: 'Thickness must be 1–10 mm',
    zh: '厚度必须在1至10 mm之间',
  },
  'error.geometry.pitch': {
    es: 'Píxeles demasiado pequeños o dimensiones inválidas.',
    en: 'Pixels too small or invalid dimensions.',
    zh: '像素过小或尺寸无效。',
  },
  'error.geometry.dimensions': {
    es: 'Dimensiones inválidas.',
    en: 'Invalid dimensions.',
    zh: '尺寸无效。',
  },
  'error.geometry.palette': {
    es: 'Invalid palette',
    en: 'Invalid palette',
    zh: '调色板无效',
  },
  'error.geometry.grid': {
    es: 'Invalid grid',
    en: 'Invalid grid',
    zh: '网格无效',
  },
  'error.zip.entries': {
    es: 'ZIP entry limit',
    en: 'ZIP entry limit',
    zh: 'ZIP 条目数超限',
  },
  'error.zip.entry': {
    es: 'Invalid ZIP entry',
    en: 'Invalid ZIP entry',
    zh: 'ZIP 条目无效',
  },
  'error.zip.size': {
    es: 'ZIP32 size limit',
    en: 'ZIP32 size limit',
    zh: 'ZIP32 文件大小超限',
  },
  'source.pending': {
    es: 'pending',
    en: 'Pending',
    zh: '待测',
  },
  'source.illustrative': {
    es: 'illustrative',
    en: 'Illustrative',
    zh: '示例',
  },
  'source.reference': {
    es: 'reference',
    en: 'Reference',
    zh: '参考',
  },
  'source.measured': {
    es: 'measured',
    en: 'Measured',
    zh: '实测',
  },
  'surface.top': {
    es: 'top',
    en: 'Top',
    zh: '顶面',
  },
  'surface.left45': {
    es: 'left45',
    en: 'Left 45°',
    zh: '左45°斜面',
  },
  'surface.right45': {
    es: 'right45',
    en: 'Right 45°',
    zh: '右45°斜面',
  },
  'surface.vertical': {
    es: 'vertical',
    en: 'Vertical',
    zh: '垂直面',
  },
  'error.generic': {
    es: 'Error: {detail}',
    en: 'Error: {detail}',
    zh: '错误：{detail}',
  },
  'error.color.recipe': {
    es: 'Receta inválida: {id}',
    en: 'Invalid recipe: {id}',
    zh: '配方无效：{id}',
  },
  'error.color.source': {
    es: 'Origen inválido: {id}',
    en: 'Invalid source: {id}',
    zh: '数据来源无效：{id}',
  },
  'error.color.lab': {
    es: 'Lab inválido: {id}',
    en: 'Invalid Lab: {id}',
    zh: 'Lab 无效：{id}',
  },
  'error.color.notes': {
    es: 'Indica instrumento y condiciones de medición: {id}',
    en: 'Specify instrument and measurement conditions: {id}',
    zh: '请注明仪器和测量条件：{id}',
  },
  'pixel.pitch.digital': {
    es: '{count} colores digitales · {pitch} mm por píxel',
    en: '{count} digital colors · {pitch} mm per pixel',
    zh: '{count} 种数字颜色 · 每像素 {pitch} mm',
  },
  'pixel.pitch.physical': {
    es: '{count} colores directos · {pitch} mm por píxel',
    en: '{count} direct filament colors · {pitch} mm per pixel',
    zh: '{count} 种直接耗材颜色 · 每像素 {pitch} mm',
  },
  'common.export.generated': {
    es: 'Archivo generado: {count} piezas por color. Verifica escala, asignación de materiales y trayectorias en el laminador.',
    en: 'File generated: {count} color parts. Verify scale, material assignment and paths in the slicer.',
    zh: '文件已生成：{count} 个颜色部件。请在切片器检查比例、材料分配及路径。',
  },
  'lab.profile.summary': {
    es: '{id} · {surface} · {count} recetas · {measured} medidas',
    en: '{id} · {surface} · {count} recipes · {measured} measured',
    zh: '{id} · {surface} · {count} 种配方 · {measured} 种实测',
  },
  'lab.recipe.option': {
    es: '{id} / {filaments} / {ratios} / {source}',
    en: '{id} / {filaments} / {ratios} / {source}',
    zh: '{id} / {filaments} / {ratios} / {source}',
  },
  'lab.recipe.saved': {
    es: 'Receta {id} guardada en memoria.',
    en: 'Recipe {id} saved in memory.',
    zh: '配方 {id} 已保存在内存中。',
  },
  'lab.chart.pageNumber': {
    es: 'Hoja {number}',
    en: 'Sheet {number}',
    zh: '第 {number} 页',
  },
  'lab.analysis.stats': {
    es: 'ΔE00 medio {mean} · P95 {p95} · máximo {max} · <2: {under2}% · {count} recetas',
    en: 'Mean ΔE00 {mean} · P95 {p95} · max {max} · <2: {under2}% · {count} recipes',
    zh: '平均 ΔE00 {mean} · P95 {p95} · 最大 {max} · <2：{under2}% · {count} 种配方',
  },
  'lab.usage.line': {
    es: '{id}: {count} píxeles',
    en: '{id}: {count} pixels',
    zh: '{id}: {count} 像素',
  },
  'language.switch': {
    es: 'Idioma · Español',
    en: 'Language · English',
    zh: '语言 · 简体中文',
  },
  'language.recommendation': {
    es: 'Recomendado según tu navegador: Español',
    en: 'Recommended for your browser: English',
    zh: '根据浏览器语言推荐：简体中文',
  },
  'language.title': {
    es: 'Elige tu idioma',
    en: 'Choose your language',
    zh: '选择你的语言',
  },
  'language.cancel': {
    es: 'Volver',
    en: 'Back',
    zh: '返回',
  },
};
if (typeof module !== 'undefined') module.exports = PipiMessages;
