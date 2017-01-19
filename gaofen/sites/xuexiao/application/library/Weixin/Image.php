<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/5/13
 * Time: 下午2:35
 */

namespace Weixin;


use Images\GfImage;

class Image
{
    /**
     * @var GfImage
     */
    private $image;
    /**
     * @var null
     */
    private $watermark;

    public function __construct(GfImage $image, $watermark = null)
    {
        $this->image = $image;
        $this->watermark = $watermark;
    }

    public function getResource($media_id)
    {
        $access_token = $this->_getAccessToken();

        $url = 'http://file.api.weixin.qq.com/cgi-bin/media/get?access_token=' . $access_token . '&media_id=' . $media_id;

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (compatible; MSIE 5.01; Windows NT 5.0)');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_TIMEOUT, 15);
        $ret = curl_exec($ch);
        $httpInfo = curl_getinfo($ch);
        curl_close($ch);

        if ($httpInfo['http_code'] == '200' && $httpInfo['content_type'] != 'text/plain') {
            return $this->saveToDisk($ret, $httpInfo);
        }

        return false;
    }

    protected function saveToDisk($ret, $httpInfo)
    {
        $m = array();
        preg_match('#image/(\w+)#i', $httpInfo['content_type'], $m);
        if (isset($m[1])) {
            $type = strtolower($m[1]);
            switch ($type) {
                case 'jpeg':
                case 'jpg':
                    $ext = 'jpg';
                    break;
                case 'png':
                    $ext = 'png';
                    break;
                case 'gif':
                    $ext = 'gif';
                    break;
            }
        }

        $fileTmpname = date('Ymdhis') . uniqid() . '.' . $ext;
        $fileTmpDir = ATTACH_DIR . 'uploads/tmp/';
        if (!file_exists($fileTmpDir) || !is_dir($fileTmpDir)) {
            mkdir($fileTmpDir, 0777);
        }
        file_put_contents($fileTmpDir . $fileTmpname, $ret);

        //生成新图
        $shortFileDir = '/uploads/event/';
        $fileDir = ATTACH_DIR . $shortFileDir;
        if (!file_exists($fileDir) || !is_dir($fileDir)) {
            mkdir($fileDir, 0777);
        }
        $ym = date('Ym/');
        $fileNamePre = date('Ymdhis') . uniqid();
        $fileName = $fileNamePre . '.' . $ext;
        $fileLastDir = $fileDir . $ym;
        if (!file_exists($fileLastDir) || !is_dir($fileLastDir)) {
            mkdir($fileLastDir, 0777);
        }

        $soureFile = $fileTmpDir . $fileTmpname;
        $thumbFile = $fileLastDir . $fileNamePre . '_400_400.' . $ext;

        $image = $this->image->loadFile($soureFile)->thumbnail(400, 400);

        if ($this->watermark) {
            $image->waterMark($this->watermark, 'right', 'bottom');
        }

        $image->save($thumbFile);

        copy($soureFile, $fileLastDir . $fileName);
        unlink($soureFile);


        return '/data'. $shortFileDir . $ym . $fileNamePre . '_400_400.' . $ext;

        return $thumbFile;
    }

    /**
     * 获取token
     *
     */
    private function _getAccessToken()
    {
        $this->_appId = 'wx0c00a259e6ec67b5';
        $this->_appSecret = 'b7d711b38d40b1c1659440563c9c7a45';

        $url_get = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' . $this->_appId . '&secret=' . $this->_appSecret;
        $json = json_decode($this->_curlGet($url_get));

        if (!isset($json->errmsg)) {
        } else {
            $this->error('获取access_token发生错误：错误代码' . $json->errcode . ',微信返回错误信息：' . $json->errmsg);
        }

        return $json->access_token;
    }

    /**
     * 简单封装http请求
     *
     */
    private function _curlGet($url, $method = 'get', $data = '')
    {
        $ch = curl_init();
        $curl = null;
        $header = "Accept-Charset: utf-8";
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, strtoupper($method));
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [$header]);
        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (compatible; MSIE 5.01; Windows NT 5.0)');
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($ch, CURLOPT_AUTOREFERER, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $temp = curl_exec($ch);

        return $temp;
    }
}