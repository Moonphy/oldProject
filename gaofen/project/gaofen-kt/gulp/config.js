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
    src: assets + "/**/*.+(css|js|eot|svg|ttf|woff|mp3)",
    build: build,
    dist: dist
  },
    script: {
        src: assets + "/**/*.js",
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
      src + "/views/**/*.jade"
    ],
    excluded: [
      "**/_*.jade"
    ],
    build: build + '/views',
    dist: dist + '/views'
  },

  images: {
    src: [
      assets + "/img/**/*"
    ],
    build: build + '/img',
    dist: dist + '/img'
  },
    sprite:{
        src: [
            assets + "/img/sprites/**/*"
        ],
        build: assets + "/img"
    },

  collection: {
    src: [
      src + "/index.jade"
    ],
    build: build,
    dist: dist
  }

};