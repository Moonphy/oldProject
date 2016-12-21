// ==================================================
// 基础配置
// ==================================================

// 主要目录
var src = "./src",
    dist = "./dist",
    build = "./public",
    assets = src + "/assets";

module.exports = {
  paths: {
    src: src,
    dist: dist,
    build: build,
    assets: assets
  },

  // 静态页面公用数据文件
  data: src + '/_data.json',

  browserSync: {
    server: {
      baseDir: [build]
    }
  },

  assets: {
    src: assets + "/**/*.+(css|js|png|jpg|gif|eot|svg|ttf|woff)",
    build: build,
    dist: dist
  },

  stylus: {
    src: [
      assets + "/**/*.styl"
    ],
    excluded: [
      "**/_*.styl"
    ],
    build: build,
    dist: dist
  },

  markup: {
    src: [
      src + "/demos/**/*.jade"
    ],
    excluded: [
      "**/_*.jade"
    ],
    build: build + '/demos',
    dist: dist + '/demos'
  },

  collection: {
    src: [
      src + "/index.jade"
    ],
    build: build,
    dist: dist
  }

};