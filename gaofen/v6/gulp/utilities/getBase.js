// ================================
// 获取文件与根目录的相对路径
// ================================

var path2Array = require('./path2Array'),
    getPath = require('./getPath');

module.exports = function (file) {
  var base = "",
      count = path2Array(getPath(file)).length;

  while(--count) {
    base += "../";
  }

  return base;
};