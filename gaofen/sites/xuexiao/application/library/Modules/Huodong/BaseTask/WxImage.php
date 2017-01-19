<?php

namespace Modules\Huodong\BaseTask;

use Service\ThirdParty\WeixinPub;
use Images\GfImage;

class WxImage {

    protected $watermark;

    public function save($media_id, $saveToPath, $catid)
    {
        $wxPub = new WeixinPub('', '', $catid);
        $mediaData = $wxPub->getService()->request('media/get', 'post', ['media_id' => $media_id]);
        $path = $this->saveToDisk($mediaData, $saveToPath);

		return $path;
    }

    public function setWatermark($watermark)
    {
        $this->watermark = $watermark;
    }

    protected function saveToDisk($ret, $saveToPath)
    {
        $fileTmpname = date('Ymdhis') . uniqid();
        $fileTmpDir = DATA_PATH.'/huodong/tmp/';

		if(!is_dir($fileTmpDir)) {
        	mkdir($fileTmpDir, 0755, true);
        }
        if(!is_dir(dirname(DATA_PATH.$saveToPath))) {
        	mkdir(dirname(DATA_PATH.$saveToPath), 0755, true);
        }
    
        file_put_contents($fileTmpDir.$fileTmpname, $ret);

        $gfImage = new GfImage();
        $image = $gfImage->loadFile($fileTmpDir.$fileTmpname);
        //->thumbnail(400, 400, false);

        if ($this->watermark) {
            $image->waterMark($this->watermark, 'right', 'bottom');
        }
        $ext = '';
        switch ($image->info['type']) {
            case 1:
                $ext = 'gif';
                break;
            case 3:
                $ext = 'png';
                break;
            case 6:
                $ext = 'bmp';
                break;
            default:
                $ext = 'jpg';
                break;
        }

        $image->save($fileTmpDir.$fileTmpname);
        copy($fileTmpDir.$fileTmpname, DATA_PATH.$saveToPath.'.'.$ext);
        unlink($fileTmpDir.$fileTmpname);

        return $saveToPath.'.'.$ext;
    }
}


