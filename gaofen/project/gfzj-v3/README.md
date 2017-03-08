## 开发说明

### 特点

- Gulp 前端架构工具
- 使用 Jade、Stylus、Coffeescript开发，最终编译成静态网站
- 模块化开发，通过 Browserify 打包
- Mocha 单元测试框架
- 用 BrowserSync 创建静态资源服务，当有文件改动时，自动刷新浏览器

### 准备

```
git clone git@github.com:Seishi/boilerplate.git <your project name>
cd <your project name>
npm install
```

### 目录结构

```
root
|-- gulp/               # gulp任务
|-- node-modules/
|-- src/
|   |-- assets/        # 资源文件夹
|   |   |-- images/   # 存放图片，包括背景图
|   |   |-- script/   # 存放脚本文件
|   |   `-- stylus/   # 存放样式表文件
|   |-- _layout.jade
|   `-- index.jade
|-- public/             # 静态资源服务文件夹
|-- test/               # 存放测试文件
|-- gulpfile.js
|-- packages.json
`-- README.md
```

### 开发

运行：

```bash
gulp
```

这将会自动打开浏览器访问: `http://localhost:3000` 。

### 生成静态网站

运行:

```bash
gulp compile -p
```

静态网站最终生成在 `dist` 目录。
9-14：完成专家的最近活跃热门推荐页，调整专辑和专辑详情页，套完分类页
9-18: 看志文回来再排时间