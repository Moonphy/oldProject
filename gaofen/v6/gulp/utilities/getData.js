// ================================
// 数据获取
// ================================

var fm = require('front-matter'),
    fs = require('fs'),
    deepmerge = require('deepmerge'),
    path = require('path'),
    config = require('../config'),
    path2Array = require('../utilities/path2Array'),
    getPath = require('../utilities/getPath'),
    getBase = require('../utilities/getBase');

module.exports = function (opts) {
  return function (file) {
    var data = JSON.parse(fs.readFileSync(path.resolve(config.data))),
        metaData = {
          environment: opts.p ? 'production' : '',
          current: {}
        },
        content = fm(String(file.contents));

    metaData.current.source = path.basename(file.path, ".jade");
    metaData.current.path = path2Array(getPath(file));
    metaData.current.base = getBase(file);

    file.contents = new Buffer(content.body);
    return deepmerge(deepmerge(data, metaData), content.attributes);
  };
};