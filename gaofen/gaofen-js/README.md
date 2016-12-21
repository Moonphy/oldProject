### 目录结构

```
├── Gruntfile.js
├── README.md
├── dist
│   ├── css
│   ├── images
│   ├── js
│   └── lib
├── package.json
└── src
    ├── css
    ├── demos
    ├── images
    ├── js
    ├── lib
    └── stylus
```

### GMU

GMU是百度移动端前端框架，Gitlab上的GMU是从github上fork而来。

**初始化安装**

```bash
cd src/lib
git clone git@gitlab.gaofen.com:frontend/gmu.git
```

安装npm模块：

```
npm install
```

**更新**

```
git pull gh master
```

**增删Widget**

按需修改Gruntfile.js：

```
cd src/lib/gmu
vi Gruntfile.js
```

生成:

```
grunt dist
```

推送Gruntfile.js的修改到Gitlab：

```
git commit -am "Edited Gruntfile.js"
git push origin master
```