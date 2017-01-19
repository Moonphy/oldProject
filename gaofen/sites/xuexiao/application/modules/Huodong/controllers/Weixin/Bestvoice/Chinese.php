<?php

use Modules\Huodong\Bestvoice\User;
use Service\ThirdParty\WeixinJssdk;
use Modules\Huodong\Bestvoice\Audio;
use Modules\Huodong\Bestvoice\Common as BCommon;
use Modules\Huodong\Bestvoice\Material;

class Weixin_Bestvoice_ChineseController extends Yaf_Controller_Abstract
{	

    public function init() {
        $this->userObj = new User();
        $this->materialObj = new Material();
        $this->type = CFG::huodong('chinese', 'type');
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
    public function voicelistAction() {

       
        $list = F::api('/Huodong/Bestvoice/Material/listByCond', ['type'=>$this->type, 'page'=>1, 'limit'=>1000]);
        

        $this->getView()->assign('list', $list);       
        
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
     * 上传录音
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

        F::ajaxRst(['id'=>$mid, 'voice'=>$rs->present()->getVoiceLink()]);
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
     * javascrpt ajax 请求uri
     * @return [type] [description]
     */
    function getAJaxUri() {
        $uri = [ 
            'upload'=>F::URL('huodong_m:/huodong/weixin_bestvoice_chinese/upload'),
            'view'=>F::URL('huodong_m:/huodong/weixin_bestvoice_chinese/view'),
            'delete'=>F::URL('huodong_m:/huodong/weixin_bestvoice_chinese/delete'),
        ];

        return $uri;
    }


}