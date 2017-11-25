require(['./common'], function (common) {
    require.config({
        baseUrl: '../../js/lib'
    });
    require(['app/home/visit/list']);
});