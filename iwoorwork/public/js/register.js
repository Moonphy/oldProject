$(function(){
    $("#btn-next,.skip").click(function () {
        var url = getRoot();
        window.location.href = url.concat("register_step2.html");
    });

    $(".btn-register-submit").click(function () {
        var url = getRoot();
        window.location.href = url.concat("register_step1.html");
    });

    $("#btn-finish,.btn-next").click(function () {
        var url = getRoot();
        window.location.href = url.concat("index.html");
    });

});