
var blockData = { numOfCol:3, offsetX: 5, offsetY: 10 };


$(function(){
    $(".bookmark,.folder,.user-defined").hover(function(){
        $(this).find(".toolbar").show();
    },function(){
        $(this).find(".toolbar").hide();
    });


    $(".bookmark .expand").click(function(){
        close($(this));

        $(".bookmark .pullback").click(function(){
            open($(this));
        });
    });

    $(".user-defined .expand").click(function(){
        close($(this));

        $(".user-defined .pullback").click(function(){
            open($(this));
        });
    });


    $(".engine_name").click(function(){
        $("#popup-search").show();
    });

    $(".engine_name").mouseover(function(){
        return false;
    });

    $("#popup-search .search").mouseover(function(){

        var search = $(".engine_name img");
        var key = $(this).attr("key");
        search.attr("src","images/icon_search_" + key + ".png");
        search.attr("key",key);
    });

    $("#popup-search .search").click(function(){
        $("#popup-search").hide();
        return false;
    });

    $('#folders').BlocksIt(blockData);


    $("#popup-bookmark-edit .footer div").click(function(){
        hidePopup("popup-bookmark-edit");
    });

    $("#popup-bookmark-delete .footer div").click(function(){
        hidePopup("popup-bookmark-delete");
    });

    $(".bookmark .edit").click(function(){
        var bookmark = $(this).parent().parent().parent();
        $("#popup-bookmark-edit").css("left",bookmark.position().left);

        showPopup("popup-bookmark-edit");
    });

    $(".bookmark .delete").click(function(){
        var bookmark = $(this).parent().parent().parent();
        $("#popup-bookmark-delete").css("left",bookmark.position().left);

        showPopup("popup-bookmark-delete")
    });

    $(".user-defined .edit").click(function(){
        showPopup("popup-defined-folder")
    });


    $("a.finish-register").click(function () {
        var url = getRoot();
        window.location.href = url.concat("register.html");
    });

    $("span.btn-change-location").click(function(){
        $("#panel-location").show();
    });

    $("#panel-location .btn-cancel,#panel-location .btn-ok").click(function(){
        $("#panel-location").hide();
    });
});

