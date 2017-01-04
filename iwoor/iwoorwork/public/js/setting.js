$(function(){
    $(".btn-save").click(function () {
        var url = getRoot();
        window.location.href = url.concat("home.html");
    });

    $(".btn-nickname").click(function () {
        showPopup("popup-nickname");
    });

    $(".btn-tags").click(function () {
        showPopup("popup-tags");
    });

    $(".btn-password").click(function () {
        showPopup("popup-password");
    });

    $(".btn-aboutme").click(function () {
        showPopup("popup-aboutme");
    });

    $(".btn-photo").click(function () {

    });

    $(".btn-confirm").click(function () {

    });
});