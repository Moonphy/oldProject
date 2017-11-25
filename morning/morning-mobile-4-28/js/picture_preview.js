$(function() {
    var photoNum = $('.photoCut').length;
    var chooseImg = $('#chooseImg');

    $('input[type=file]').on('change', function () {
        // 得到文件列表
        var files = !!this.files ? this.files : [];

        // 如果没有选择文件或者没有FileReader对象
        if (!files.length || !window.FileReader) return;

        // 文件类型
        if (/^image/.test(files[0].type)) {

            //创建实例
            var reader = new FileReader();

            // 将本地文件给DataURL
            reader.readAsDataURL(files[0]);

            // 上传时操作
            reader.onloadend = function () {
                $('#addImg-box').before("<li><div><a></a></div></li>");
                $('#addImg-box').prev().find('div').addClass('photoCut').css('background-image', "url(" + this.result + ")").find('a').attr({
                    href: '#',
                    onclick: " $(this).parents('li').remove();photoNum--; if(photoNum == 7){$('#addImg-box').show();}else{$('#lastNum').html(8-photoNum)}"
                }).addClass('.del_btn').list;
            };
            photoNum++;
            $('#lastNum').html(8 - photoNum);
            if (photoNum >= 8) {
                $('#addImg-box').hide();
            }
            chooseImg.replaceWith(chooseImg = chooseImg.clone(true));

        } else {
            alert("文件类型不是图片");
        }
    });
});