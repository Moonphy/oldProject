<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/5/6
 * Time: 上午11:16
 */


/*
* 生成缩略图，返回缩略图URL
   先判断本地缩略图是否存在，不存在则抓取远程图片回本地，然后生成缩略图，返回本地缩略图URL
   本地目录 ATTACH_DIR  ： cptoftp/
   远程目录 ATTACH_URL ： http://file.gaofen.com/cp/
   缩略图文件路径 ： http://cp.gaofen.com/cptoftp/2011/11/20111121015650328.jpg = http://file.gaofen.com/cp/2011/11/20111121015650328.jpg
*/
function thumb($imgurl, $width, $height, $filename_str = '', $autocut = 1)
{
    $width = $width ? $width : 100;
    $height = $height ? $height : 100;
    $pathinfo = pathinfo($imgurl);//dirname basename extension filename

    $local_urlbase = ATTACH_URL; //http://file.gaofen.com/cp/
    $local_dir = ATTACH_DIR; //cptoftp/

    if (!$imgurl) {
        return $local_urlbase . $imgurl;
    }

    //禁止非主流格式 譬如bmp之流。。
    if (!in_array($pathinfo['extension'], array('gif', 'jpg', 'jpeg', 'png'))) {
        return $local_urlbase . $imgurl;
    }
    if (!extension_loaded('gd')) {
        return $local_urlbase . $imgurl;
    }

    //是否为远程图片
    if (substr($imgurl, 0, 7) == 'http://') {
        //论坛之类
        $_imguri = ltrim(substr($imgurl, strpos($imgurl, '/', 8)), '/');
        $remote_imgurl = $imgurl;
    } else {
        //高分网图片 file.gaofen.com
        $_imguri = $imgurl;
        $remote_imgurl = $local_urlbase . $imgurl;
    }

    $local_img_path = $local_dir . dirname($_imguri) . '/';
    $local_img_url = $local_urlbase . dirname($_imguri) . '/';


    if (!file_exists($local_dir . $_imguri)) {
        dir_create(dirname($local_dir . $_imguri));
        $imgdata = file_get_contents($remote_imgurl);
        //如果图片抓取失败
        if (!$imgdata) {
            return $remote_imgurl;
        }

        file_put_contents($local_dir . $_imguri, $imgdata);
    }
    //图片已抓取回本地 现在的$_imguri为本地图片路径

    list($width_t, $height_t, $type, $attr) = getimagesize($local_dir . $_imguri);
    //临时加上的 应对手机版 图片自适应高度
    if ($height == 'auto') {
        $height = intval($width * ($height_t / $width_t));
    } elseif ($width == 'auto') {
        $width = intval($height * ($width_t / $height_t));
    }
    //或改为与
    if ($width >= $width_t && $height >= $height_t) {
        return $local_urlbase . $_imguri;
    }
    //自定义缩略图命名 #n#_#w#_#h#
    if ($filename_str) {
        $newimgurl = str_replace(array('#w#', '#h#', '#n#'), array($width, $height, sbasename($_imguri)),
                $filename_str) . '.' . fileext($_imguri);
    } else {
        $newimgurl = 'thumb_' . $width . '_' . $height . '_' . sbasename($_imguri);
    }

    if (!file_exists($local_img_path . $newimgurl) || filemtime($local_img_path . $newimgurl) < 1351146265) {

        $image = new Images\CpImage();
        if ($width < 200 && $height < 200) {
            $autocut = 1;
        }
        $image->thumb($local_dir . $_imguri, $local_img_path . $newimgurl, $width, $height, '', $autocut);

        return file_exists($local_img_path . $newimgurl) ? $local_img_url . $newimgurl : $local_urlbase . $_imguri;
    }

    return $local_img_url . $newimgurl;
}
