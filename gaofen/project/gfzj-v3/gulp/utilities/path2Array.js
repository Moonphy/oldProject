// ================================
// 字符串路径并转换为数组形式
// ================================

var path = require('path');

module.exports = function (path) {
  return path.split("/");
};