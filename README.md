# PIPI Studio V2 | 3D 定制实验室

## 本地使用
解压后用 Chrome / Edge / Firefox 等浏览器打开 `index.html`。无需安装依赖、服务器、API 密钥或网络连接。网站默认西班牙语；这是研发原型，暂不提供真实下单或支付。

## Pixel Art
1. 上传 JPG、PNG 或 WebP 图片（15 MB 内）。图片在浏览器内处理，不发送到服务器。
2. 选择画幅及分辨率。数字调色板用于预览，实际制造请选择 `Filamentos directos`。
3. 输入 2 至 9 个不同的 HEX 颜色，用实测耗材颜色替换示例色，按 `Aplicar paleta`。程序使用 sRGB 转 CIELAB、CIEDE2000（ΔE00）最近邻映射，不模拟叠层混色。
4. 选择 `Exportar modelo Pixel 3MF`，或下载按颜色分组的 STL ZIP。像素小于 0.6 mm 时禁用导出，这只是研发阈值而非可打印保证。
5. 3MF 模型为 1.6 mm 底板加 0.8 mm 彩色像素层；第一个色号也用于底板。预览相框不包含在模型中。

## MultiView
分别选择两幅图像、棱柱数量及模型宽度。预览滑块显示指定角度的正交投影，左右图像在约 ±45° 分别可见，正面会混合。模型宽高比为 3:2，底板厚 1.6 mm，棱柱高度为间距的一半。使用 Pixel Art 中已应用的直接耗材色库，不支持三视角或光学真实色彩模拟。

## 切片与打印验证
- 3MF 使用通用 3MF 核心格式，按颜色组织网格，不是 Bambu 专属工程，未包含机器、喷嘴、耗材或混色参数。
- 若 Bambu Studio 没有正确保留颜色，解压 STL ZIP，选中所有 STL 一起导入为一个多部件对象，保留原始坐标并逐个指定耗材。不要自动分散排版。
- 各颜色网格由独立闭合棱柱构成，相邻区域共享接触平面，切片软件可能需要修复或合并。务必检查尺寸、边界、支撑、颜色映射和路径，再进行小尺寸打样。尚未通过 Bambu Studio 或实体机器测试。
- 样品是程序绘制的演示图形，不是实际客户订单。建议先用 A1 mini 打印单色结构验证几何，再在多色设备上测试。

## 发布
部署整个仓库根目录（包括 index.html、color-lab.html、engine/ 和 _headers）；不要只上传 index.html。Cloudflare Pages 选择该仓库、Framework preset: None、构建命令留空、输出目录为网站文件所在目录。绑定 `shop.pipi522.top` 并按控制台指引设置 DNS；不要改动现有 `www.pipi522.top` 的个人网站。仓库已建立；部署及 DNS 状态未在本版本中修改。

正式营业前需确认商标、法律信息、产品安全、隐私政策、退换货、真实价格等，并移除测试提示及 noindex。当前无外部分析追踪、无用户账户、无支付和订单后台。

## 已测试
Chromium 中的图片导入、调色板编辑、角度滑块、PNG 下载、3MF / STL ZIP 导出及手机宽度布局。导出文件通过 ZIP CRC、XML 解析、网格索引边闭合、尺寸和 STL 文件长度检查。未运行实体打印或全功能切片验证，其他浏览器未专项测试。

## V3.1–V3.4 色彩实验室
首页导航 Color Lab V3.4 进入 `color-lab.html`。原 Pixel Art 和 MultiView 仍可导出直接耗材 3MF/STL，升级为 ΔE00 匹配。
- V3.1：CIELAB D65/2°、CIEDE2000，参考 Sharma / Wu / Dalal (2005) 测试数据：https://hajim.rochester.edu/ece/sites/gsharma/ciede2000/ 。运行 `node tests/color-engine.test.cjs`。
- V3.2：JSON 配方库，5 种 CMYKW 纯色和两两比例候选（10% 间隔 95 种，5% 195 种）。候选不保证切片器支持。示例只有 5 种数字纯色，其余待测。每个 profile 独立保存，记录方向、设备、耗材、喷嘴、层高；实测记录需填写测量条件。高级 JSON 编辑可增加/删除配方；导入导出需手动保存，无服务器持久化。未测配方禁止进入实测匹配模式。请勿把不同光源/观察者、表面朝向或测量几何的数据混入同一 profile。
- V3.3：上传照片后生成目标、分配颜色及 ΔE00 热力图，输出均值、P95、最大值、低于2比例、配方使用数；可导出热力 PNG 和逐像素配方 JSON。显示近似 sRGB，不代表实物保证。
- V3.4：校色候选分页 SVG、全量 CSV、15×15 mm 可调厚度通用平面 STL 样块。需在切片器手动复制、编号、安排配方；不生成自动混色打印板，不生成 Bambu 专属混色 3MF。斜面或垂直面需要对应几何样块。
- 本次测试：色差算法和配方映射 96 个断言，包括 34 组参考数据；UI 事件使用模拟 DOM 进行 8 项基础检查，静态核对 HTML ID 和原导出处理器。尚未在真实浏览器和实体打印机中完成 V3 集成回归。

## V3.4.1 工程维护
- 统一 update / drawMulti，直接耗材模式在分辨率、尺寸和边框变化后保持一致；小于 0.6 mm 或数字模式时禁用像素模型导出。
- engine/geometry.js 提供纯几何和通用 3MF/STL 序列化；engine/zip.js 使用原生 deflate-raw（ZIP method 8），仅在压缩有效时采用，否则回退 stored。所有导出仍需切片验证。
- engine/studio.js 为网页控制器；engine/pricing.js 集中参考报价。原配方实验室不变。
- Node 22+：npm test（不需安装依赖）；npm install 后可 npm run format 或 npm run format:check。GitHub Actions 自动执行测试。
- Cloudflare Pages _headers 安全头仅在部署平台支持时生效；图片本地处理、Blob 下载及样式保留；上线前检查实际浏览器响应头。
- 制造测试检查索引边闭合和方向、正体积、预期总量及 STL 长度。相邻棱柱仍可能有共享面，不能据此宣称已完成布尔并集或切片认证。
