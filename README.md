# 星序 ASTRA · 交互天文图鉴

以提供的三张古典天文图片为内容与视觉依据。黑金、细线、宋体与衬线字体构成展馆式界面。

## 运行

直接打开 `index.html` 即可使用。全部图片、样式与脚本在本目录内，没有第三方运行依赖，也不需要联网。

若使用 Node.js：

```sh
npm start
```

浏览器访问 `http://127.0.0.1:4396`。修改端口可设置 `PORT` 环境变量。

运行 `npm run build` 会将可发布的静态文件复制到 `dist`。可以部署到任意静态网站托管服务。

## 内容与交互

- 首屏行星图：八颗行星可点击或使用 Tab、Enter、空格选择，说明与轨道高亮同步。
- 交互观测室：月相、行星、四季三组 tabs，可用方向键切换。
- 月相：时间滑块、八个月相节点、自动播放与暂停。切换标签、操作滑块或隐藏页面时停止播放。
- 四季：四个季节点与图上的地球位置关联。
- 图版馆：类别筛选、收藏、原图弹窗、放大、前后切换。支持 Escape 关闭、左右方向键翻页。
- 收藏保存在此浏览器的 localStorage；不可用时仅在本次浏览中保留并提示。
- 自适应桌面与手机；支持系统减少动态效果偏好、键盘操作与原生模态焦点管理。

## 内容说明

原图来源为用户提供的图片，未推断其作者与出版年代。月相是简化的几何示意，采用北半球视角与约 29.53 天周期；轨道、天体大小和位置均非真实比例，不提供实时天文预测。四季名称采用北半球约定。

基础知识参考：

- NASA 月相：https://science.nasa.gov/moon/moon-phases/
- NASA 太阳系：https://science.nasa.gov/solar-system/planets/
- NASA 月球数据（朔望周期）：https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html
- NASA 四季原理：https://spaceplace.nasa.gov/seasons/en/

## 文件

- `index.html`：语义化页面与弹窗
- `styles.css`：主题、布局、响应式与交互状态
- `app.js`：数据与交互行为
- `diagrams.js`：轨道、月相与四季 SVG 图形
- `assets/`：三张原始参考图与网站图标
- `server.cjs` / `build.cjs`：可选预览与构建脚本

预览服务默认只监听本机地址，不是公开部署。
