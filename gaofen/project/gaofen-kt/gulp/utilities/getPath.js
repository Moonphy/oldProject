// ================================
// 获取根目录cd到文件的路径
// ================================

var config = require('../config'),
    path = require('path'),
    srcRoot  = path.resolve(config.paths.src);

module.exports = function (file) {
  var fileDir = path.relative(srcRoot, path.dirname(file.path)),
      fileName = path.basename(file.path, path.extname(file.path)),
      filePath = fileDir ? fileDir + "/" + fileName : fileName;
  return filePath;
}