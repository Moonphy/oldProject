<?php

use Modules\Huodong\Bestvoice\User;
use Service\ThirdParty\WeixinJssdk;
use Modules\Huodong\Bestvoice\Audio;
use Modules\Huodong\Bestvoice\Common as BCommon;
use Modules\Huodong\Bestvoice\Material;

class Weixin_Bestvoice_VvController extends Yaf_Controller_Abstract
{	

    public function init() {
        $this->userObj = new User();
        $this->materialObj = new Material();
        $this->type = CFG::huodong('vv', 'type');
        $this->materialObj->setType($this->type);

        $jsSdk = new WeixinJssdk();
        $this->getView()->assign('wxConfig',    json_encode($jsSdk->getCfg()));
        $this->getView()->assign('ajaxUri',     json_encode($this->getAJaxUri()));
        
    }



    private function loginCheck() {        
        if(!$this->userObj->isLogin()) {
            if(!$this->userObj->autoLogin()) {
                $callback = V('g:callback')?:BCommon::getCurrentUrl();
                F::redirect(F::URL('auth:/Auth/Weixin/sync', 
                            array('catid'=>CFG::huodong('default_catid'), 'callback'=>F::URL('huodong_m:huodong/weixin_account/callback', ['callback'=>$callback]))));
            }            
        }
    }

	/**
	 * 首页
	 * @return [type] [description]
	 */
    public function listAction() {

       
        $list = F::api('/Huodong/Bestvoice/Material/listByCond', ['type'=>$this->type, 'page'=>1, 'limit'=>1000]);
        

        $this->getView()->assign('list', $list);       
        
    }

    /**
     * 修改合成音频时间在IOS上显示不正确
     * @return [type] [description]
     */
    public function fixAction() {
        $mid = V('g:mid');
        $info = F::api('/Huodong/Bestvoice/Material/get', ['id'=>$mid]);

        if(!empty($info->path)) {
            $audObj = new Audio();
            $audObj->convertAndSaveToMP3($info->present()->getSaveFilepath().'.mp3');
        }

        echo 'finish!';
        return false;
    }

    /**
     * 详细页
     * @return [type] [description]
     */
    public function viewAction() {
        $id = V('g:id');

        $uid =$this->userObj->getUserId();
        $id = $id?$id:$this->getFistMidByUid($uid);

        if(empty($id)) {
            die('无效访问');
        }

        $info = F::api('/Huodong/Bestvoice/Material/get', ['id'=>$id, '_autoIncView'=>true]);

        $favList = F::api('/Huodong/Bestvoice/Fav/listByCond', ['mid'=>$id, 'type'=>$this->type, 'limit'=>16]);

        //上一轮结束日期
        $roundInfo = array_shift($this->materialObj->getPreRoundInfo($id, $this->type));

        $this->getView()->assign(compact(['info', 'favList', 'uid', 'roundInfo']));
    }


    /**
     * 录音
     * @return [type] [description]
     */
    public function indexAction() {

        $this->userObj->denyNoWeixin($this->type, BCommon::getCurrentUrl());
        $this->loginCheck();
        $uid = $this->userObj->getUserId();
        $list = F::api('/Huodong/Bestvoice/Material/listByCond', ['uid'=>$uid, 'type'=>$this->type, 'page'=>1, 'limit'=>1000]);

        $this->getView()->assign('list', $list);
        
    }

    
    /**
     * 上传微信录音
     * @return [type] [description]
     */
    public function uploadAction() {
        $media_id   = V('g:media_id'); //素材ID
        $sec        = (int)V('g:sec'); //秒数

        $type = $this->type; //期数，现在是活动第一期

        $uid = $this->userObj->getUserId();

        if($this->materialObj->isEnd()) {
            //F::ajaxRst(false, 100001, '活动已结束');
        }

        $saveUri = "/huodong/voice/".$this->type."/{$uid}_".md5(time());
        $savePath = DATA_PATH.$saveUri;

        $audObj = new Audio();
        $rs = $audObj->save($media_id, $savePath);

        //微信目前只允许1分钟录音，否则尝试获取正确录音时间
        if($sec>2*60*1000) {
            $tryGetSec = $audObj->getDuration($savePath);
            if(is_int($tryGetSec) && $tryGetSec>0) {
                $sec = $tryGetSec*1000;
            }
        }

        F::log($rs);

        if($rs) {
            $saveData = [
                'uid'   => $uid,
                'path'  => $saveUri,
                'type'  => $type,
                'mil_sec'   => $sec,
            ];


            $rs = F::api('/Huodong/Bestvoice/Material/create', $saveData);
            $mid = $rs->id;

        }else{
            F::ajaxRst(false, 100000, '保存失败');
        }

        //上报数据
        file_get_contents('http://bbs.gaofen.com/plugin.php?id=sms_club:test&nickname='.$this->userObj->nickname);
        F::ajaxRst(['id'=>$mid, 'voice'=>$rs->present()->getVoiceLink()]);
    }

    /**
     * 上传本地音频
     * @return [type] [description]
     */
    public function uploadLocalFileAction() {

        if(empty($_FILES['upload']['tmp_name'])) {
            $this->jsErrAlert('上传失败，请重试');
        }

        //手机上传不能正常反回类型
        /*if($_FILES['upload']['type']!=='audio/mp3') {
            $this->jsErrAlert('只能上传MP3');
        }*/

        $audioFile = $_FILES['upload']['tmp_name'];

        $type = $this->type; //期数，现在是活动第一期
        $uid = $this->userObj->getUserId();

        $saveUri = "/huodong/voice/".$this->type."/{$uid}_".md5(time());
        $savePath = DATA_PATH.$saveUri;
        
        file_put_contents($savePath.'.mp3',file_get_contents($audioFile));
        $audObj = new Audio();
        $tryGetSec = $audObj->getDuration($savePath);
        $sec = 0;
        if(is_int($tryGetSec) && $tryGetSec>0) {
            $sec = $tryGetSec*1000;
        }

        $saveData = [
            'uid'   => $uid,
            'path'  => $saveUri,
            'type'  => $type,
            'mil_sec'   => $sec,
        ];


        $rs = F::api('/Huodong/Bestvoice/Material/create', $saveData);

        $url = F::URL('huodong_m:/huodong/weixin_bestvoice_vv/index', ['__rnd'=>time()]);
        echo "<script>window.parent.location.href='{$url}';</script>";

        return false;
    }

    function jsErrAlert($msg) {
        echo "<script>window.parent.alert('{$msg}');window.parent.loading('hidden'); </script>";
        exit;
    }


    /**
     * 删除
     * @return [type] [description]
     */
    public function deleteAction() {
        $this->loginCheck();
        $id = V('g:id');
        $uid = $this->userObj->getUserId();

        $info = F::api('/Huodong/Bestvoice/Material/get', ['id'=>$id]);

        if($info->uid!=$uid) {
            F::ajaxRst('无权操作');
        }

        F::api('/Huodong/Bestvoice/Material/delete', ['id'=>$id]);
        
        F::ajaxRst(true);
    }


    

    /**
     * 登录检测
     * @return [type] [description]
     */
    public function loginAction() {
        $this->loginCheck();

        F::redirect(F::URL('huodong_m:huodong/weixin_bestvoice_voice/index'));
    }

    /**
     * javascrpt ajax 请求uri
     * @return [type] [description]
     */
    function getAJaxUri() {
        $uri = [ 
            'upload'=>F::URL('huodong_m:/huodong/weixin_bestvoice_vv/upload'),
            'login'=>F::URL('huodong_m:/huodong/weixin_bestvoice_vv/login', ['callback'=>BCommon::getCurrentUrl()]),
            'view'=>F::URL('huodong_m:/huodong/weixin_bestvoice_vv/view'),
            'delete'=>F::URL('huodong_m:/huodong/weixin_bestvoice_vv/delete'),
        ];

        return $uri;
    }


}