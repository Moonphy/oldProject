function close(win){
    var tools = win.parent();
    var header = tools.parent();
    var container = header.parent();
    var content = container.find("p");
    if(content.length==0){
        content = container.find(".content");
    }
    content.hide();

    header.addClass("close");

    tools.find(".expand").hide();
    tools.find(".pullback").show();
}

function open(win){
    var tools = win.parent();
    var header = tools.parent();
    var container = header.parent();
    var content = container.find("p");
    if(content.length==0){
        content = container.find(".content");
    }
    content.show();

    header.removeClass("close");

    tools.find(".pullback").hide();
    tools.find(".expand").show();
}

$(function(){
    $(".folder").hover(function(){
        $(this).find(".toolbar").show();
    },function(){
        $(this).find(".toolbar").hide();
    });

    $(".folder .expand").click(function(){
        close($(this));
        $('#folders').BlocksIt(blockData);
    });

    $(".folder .pullback").click(function(){
        open($(this));
        $('#folders').BlocksIt(blockData);
    });


    $(".folder .delete").click(function(){
        var folder = $(this).parent().parent().parent();
        $("#popup-folder-delete").css("left",folder.position().left+10);
        $("#popup-folder-delete").css("top",folder.position().top);

        showPopup("popup-folder-delete")
    });

    $("#popup-folder-delete .footer div").click(function(){
        hidePopup("popup-folder-delete");
    });

    $(".folder .edit,.folder .add").click(function(){
        showPopup("popup-edit-folder")
    });

    $('#folders').BlocksIt(blockData);
});
