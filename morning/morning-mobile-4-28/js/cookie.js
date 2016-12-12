function setCookie(name,value){

    var Days =30;
    var exp = new Date();

    exp.setTime(exp.getTime() + Days*24*60*60*1000);

    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();

    var strsec = getsec(time);
    var exp = new Date();

    exp.setTime(exp.getTime() + strsec*1);

    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}


function getCookie(name){
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");

    if(arr=document.cookie.match(reg)){
        return (arr[2]);
    }else{
        return null;
    }
}