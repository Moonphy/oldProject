var crypto = require('crypto');
var md5 = crypto.createHash('md5');
md5.update('mh0911@moihu');
var result = md5.digest('hex');
console.log(result);
