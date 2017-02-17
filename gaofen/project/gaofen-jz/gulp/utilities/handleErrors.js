// ==============================
// 处理错误
// ==============================

var notify = require("gulp-notify");

module.exports = function () {

  var args = Array.prototype.slice.call(arguments)

  // 发送错误信息
  notify.onError({
    title: "Compile Error",
    message: "<%= error.message %>"
  }).apply(this, args)

  // 暂停任务
  this.emit("end");
  return;
}