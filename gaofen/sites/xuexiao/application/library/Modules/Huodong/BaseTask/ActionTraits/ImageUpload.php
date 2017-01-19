<?php
namespace Modules\Huodong\BaseTask\ActionTraits;

use Modules\Huodong\BaseTask\WxImage;
use F;
use CACHE;

trait ImageUpload
{
    abstract protected function getType();
    abstract protected function isEnd();
    abstract protected function getPrjCode();
    abstract protected function getExtData();
    abstract protected function getCatid();

    public function uploadAction($onSuccess = null)
    {
        $this->requireLogin(true);
        $user = $this->userObj;
        $uid = $user->id;
        $type = $this->getType();
        $code = $this->getPrjCode();
        $media_id   = V('p:media_id'); //素材ID

        if (!isset($media_id)) {
            F::ajaxRst(false, 7001, '非法调用');
        }

        if($this->isEnd()) {
            F::ajaxRst(false, 7002, '活动已结束');
        }

        $key = "{$code}:upload:{$type}:{$uid}";
        if ('1' == CACHE::get($key)) {
            F::ajaxRst(false, 7003, '已处理，请稍后。');
            exit;
        }
        CACHE::setex($key, 5, '1');

        $saveUri = "/huodong/voice/".$this->getType()."/{$uid}_".md5(time());

        $image = new WxImage();
        $path = $image->save($media_id, $saveUri, $this->getCatid());

        F::log($path);

        if($path) {
            $saveData = [
                'uid'   => $uid,
                'path'  => $path,
                'type'  => $type,
                'mil_sec'   => 0,
                'ext_data' => $this->getExtData(),
            ];

            if ($this->materialObj->setByUid($uid)) {
                $mid = $this->materialObj->id;
                $saveData['id'] = $mid;
                $rs = F::api('/Huodong/Bestvoice/Material/update', $saveData);
            }else{
                if($uid != $this->userObj->getInviter()) {
                    $saveData['inviter'] = $this->userObj->getInviter();
                }
                $rs = F::api('/Huodong/Bestvoice/Material/create', $saveData);
                $mid = $rs->id;
            }

        }else{
            F::ajaxRst(false, 7004, '保存失败');
        }

        if (!is_null($onSuccess)) {
            call_user_func_array($onSuccess, [$mid]);
        }

        //上报数据
        file_get_contents('http://bbs.gaofen.com/plugin.php?id=sms_club:test&nickname='.$this->userObj->nickname);
        F::ajaxRst([
            'id' => $mid,
            'path' => $rs->present()->getImageLink(),
            'ext_data' => $rs->ext_data,
        ]);
    }
}
