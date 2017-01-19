<?php

function my_domain()
{
    return 'http://' . $_SERVER['HTTP_HOST'];
}

function is_even($num)
{
    return $num % 2 == 0;
}

function is_ajax()
{
    return \Yaf_Dispatcher::getInstance()
        ->getRequest()->isXmlHttpRequest();
}

function current_modules()
{
    return \Yaf_Dispatcher::getInstance()
        ->getRequest()
        ->getModuleName();
}

function schoolType()
{
    return DIBuilder::make('SchoolType');
}

//手机站内容过滤(目前仅缩小图片)
function msite_content_filter($html)
{
    // 取消新窗口打开
    $html = str_replace('_blank', '', $html);

    //$html = preg_replace('#(<a[^>]+>.*?)(<img)(.+?src=".+?"[^>]*>.*?</a>)#ism', '\\1<ismg\\3', $html);

    // 为图片生成缩略图
    $html = preg_replace_callback('/<img.+?src=\"([^"]+)\"[^>]*>/is', 'msite_pic_thumb', $html);

    // 没有连接的img添加a标签
    $html = preg_replace('#(<a[^>]+>.*?)(<ismg)(.+?src=".+?"[^>]*>.*?</a>)#ism', '\\1<img\\3', $html);

    // 修改文章url为m.gaofen.com/article/xxx.htm
    $html = preg_replace('#(http://)(www|zhongkao|gaokao|xsc)(\.gaofen\.com)/(article|list)#', '\\1m\\3/\\4', $html);

    // 修改列表url为m.gaofen.com/list/(zhongkao|gaokao|xsc)
    $html = preg_replace('#(http://)(zhongkao|gaokao|xsc)(\.gaofen\.com)/?#is', '\\1m\\3/list/\\2', $html);

    return $html;
}

function msite_pic_thumb($match)
{
    return '<a href="' . $match[1] . '" target="_blank" ><img src="' . thumb($match[1], 240, 'auto') . '" /></a>';
}


//basename有时候会出现乱码 用这个代替
function sbasename($filename)
{
    return preg_replace('/^.+[\\\\\\/]/', '', $filename);
}
