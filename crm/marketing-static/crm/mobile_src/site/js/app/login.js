define(function(require) {
    var login = require('./login/main');
    $(function () {
        login.initialize();
    });
});