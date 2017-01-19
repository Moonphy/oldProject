<?php

use Modules\Huodong\Bestvoice\User;
use Service\ThirdParty\WeixinJssdk;
use Modules\Huodong\Bestvoice\Audio;
use Modules\Huodong\Bestvoice\Common as BCommon;
use Modules\Huodong\Bestvoice\Material;

class Weixin_Bestvoice_VoiceController extends Yaf_Controller_Abstract
{	

    public function init() {
        $this->userObj = new User();
        $this->materialObj = new Material();
        $this->type = V('g:type', 1);
        $this->materialObj->setType($this->type);

        //注入邀请码
        $this->userObj->assignInviter(V('g:inviter_uid'));
        $this->userObj->denyNoWeixin($this->type);
        $jsSdk = new WeixinJssdk();
        $this->getView()->assign('wxConfig',    json_encode($jsSdk->getCfg()));
        $this->getView()->assign('ajaxUri',     json_encode($this->getAJaxUri()));
        $this->getView()->assign('shareData',   json_encode($this->getShareContent()));
        $this->getView()->assign('globalInform', $this->userObj->getGlobalInformScript($this->type));
        $this->getView()->assign('topNewUserInform', $this->materialObj->notifyTopNewUser($this->userObj->getUserId()));
        
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
    public function indexAction() {

        $page = 1;
        $list = F::api('/Huodong/Bestvoice/Material/listByCond', ['type'=>$this->type, 'page'=>$page, 'limit'=>10]);
        

        $uid = $this->userObj->getUserId();
        $this->getView()->assign('list', $list);
        $this->getView()->assign('uid', $uid);
        
        //邀请人数
        $inviteByMe = NULL;
        if($uid) {
            $inviteList = F::api('/Huodong/Bestvoice/Material/listByCond', ['inviter'=>$uid, 'type'=>$this->type, 'page'=>1, 'limit'=>1]);
            $inviteByMe = $inviteList['total'];
        }
        
        //获奖公告
        $voiceInform = file_get_contents(LOG_PATH.'/voiceInform.txt');

        //投票人次
        $totalFav = F::api('/Huodong/Bestvoice/Fav/getTotal', ['type'=>$this->type]);

        //新人奖
        $topNewUser = $this->materialObj->getDayTopNewUserInfo();

        $playerEndingInform = '';
        $playerEndingNotice = '';
        if($this->materialObj->isEnd() && $this->userObj->isLogin()) {
            $msg1 = $this->materialObj->getConfMessage('end', 'userendmsg');
            $msg2 = $this->materialObj->getConfMessage('end', 'userendmsg2');
            $uid = $this->userObj->getUserId();
            $mid = $this->getFistMidByUid($uid);
            if($mid) {
                //not in use
                $justMakeCacheList = F::api('/Huodong/Bestvoice/Material/listByCond', ['type'=>$this->type, 'sort'=>'fav_num_total', 'limit'=>1]);
                $mInfo = F::api('/Huodong/Bestvoice/Material/get', ['id'=>$mid]);
                $final_rank = F::api('/Huodong/Bestvoice/Material/getRankById', ['id'=>$mid, 'type'=>$this->type, 'field'=>'fav_num_total']);
                $data = ['fav_num_total'=>$mInfo->fav_num_total, 'final_rank'=>$final_rank];
                $msg1 = $this->materialObj->msgExplain($msg1, $data);
                $informKey = 'the-first-round-ending-'.$uid;
                $playerEndingInform = $this->materialObj->inform($informKey, $msg1);
                $playerEndingNotice = $this->materialObj->msgExplain($msg2, $data);
            }
        }

        $isEnd = $this->materialObj->isEnd();

        $this->getView()->assign(compact(['playerEndingInform', 'playerEndingNotice', 'isEnd']));
        $this->getView()->assign(compact(['voiceInform','totalFav','inviteByMe', 'topNewUser']));
        
        $sectionhtml = $this->getView()->render('weixin/bestvoice/voice/voicesection.html');        
        $this->getView()->assign(compact('sectionhtml'));
    }

    /**
     * 首页更多
     * @return [type] [description]
     */
    public function moreSectionAction() {
        $page = max(V('g:page', 1), 1);
        $list = F::api('/Huodong/Bestvoice/Material/listByCond', ['type'=>$this->type, 'page'=>$page, 'fromIndex'=>10, 'limit'=>10]);

        $uid = $this->userObj->getUserId();

        $this->getView()->assign('list', $list);
        $this->getView()->assign('uid', $uid);
        $html = $this->getView()->render('weixin/bestvoice/voice/voicesection.html');
        F::ajaxRst(['html'=>$html, 'curPage'=>$page]);
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
     * 荣誉证书页面
     * @return [type] [description]
     */
    public function honourAction() {
        $id = V('g:id');

        $roundInfo = array_shift($this->materialObj->getPreRoundInfo($id, $this->type));
        $mInfo = F::api('/Huodong/Bestvoice/Material/get', ['id'=>$id]);

        if(empty($roundInfo['data']) || empty($mInfo) || empty($mInfo->pre_rank)) {
            die('No Data!');
        }

        $uInfo = F::api('/Huodong/Bestvoice/User/get', ['id'=>$mInfo->uid]);

        $this->getView()->assign(compact(['roundInfo', 'mInfo', 'uInfo']));
    }

    /**
     * 录音
     * @return [type] [description]
     */
    public function recordAction() {
        $this->loginCheck();
        
        $uid = $this->userObj->getUserId();
        $mid = $this->getFistMidByUid($uid);
        $info = F::api('/Huodong/Bestvoice/Material/get', ['id'=>$mid]);

        $isEnd = $this->materialObj->isEnd();
        $this->getView()->assign(compact(['info', 'isEnd']));
    }

    /**
     * 排行榜
     * @return [type] [description]
     */
    public function rankAction() {
        $list = F::api('/Huodong/Bestvoice/Material/listByCond', ['type'=>$this->type, 'sort'=>'fav_num', 'limit'=>20]);


        $uid = $rank = 0;
        $info = [];
        if($this->userObj->isLogin()) {
            $uid = $this->userObj->getUserId();

            $mid = $this->getFistMidByUid($uid);
            $rank = F::api('/Huodong/Bestvoice/Material/getRankById', ['id'=>$mid, 'type'=>$this->type]);
            $info = F::api('/Huodong/Bestvoice/Material/get', ['id'=>$mid]);
        }
        
        $this->getView()->assign('list', $list);
        $this->getView()->assign('uid', $uid);
        $this->getView()->assign('rankIndex', $rank);
        $this->getView()->assign('info', $info);

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
            F::ajaxRst(false, 100001, '活动已结束');
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
                'type'  => $this->type,
            ];

            $mid = $this->getFistMidByUid($uid);
            if($mid) {
                $saveData['id'] = $mid;
                $rs = F::api('/Huodong/Bestvoice/Material/update', $saveData);
            }else{
                if($uid!=$this->userObj->getInviter()) {
                    $saveData['inviter'] = $this->userObj->getInviter();
                }
                $rs = F::api('/Huodong/Bestvoice/Material/create', $saveData);
                $mid = $rs->id;
            }
        }else{
            F::ajaxRst(false, 100000, '保存失败');
        }

        //上报数据
        file_get_contents('http://bbs.gaofen.com/plugin.php?id=sms_club:test&nickname='.$this->userObj->nickname);
        F::ajaxRst(['id'=>$mid, 'voice'=>$rs->present()->getVoiceLink()]);
    }


    /**
     * 加喜欢
     * @return [type] [description]
     */
    public function doFavAction() {
        $id = V('g:id');
        $uid = $this->userObj->getUserId();

        if(empty($uid)) {
            F::ajaxRst(false, '100001', '非法操作');
        }

        if(!$this->materialObj->isStart()) {
            F::ajaxRst(false, '100002', $this->materialObj->getConfMessage('start'));
        }

        if($this->materialObj->isEnd()) {
            F::ajaxRst(false, '100003', $this->materialObj->getConfMessage('end'));
        }

        $rs = F::api('/Huodong/Bestvoice/Fav/listByCond', ['uid'=>$uid, 'type'=>$this->type, 'mid'=>$id, 'limit'=>1]);
        if(isset($rs['list'])) {
            $favRs = false;
            //时间控制每天能投1次

            if( empty($rs['list']) || strtotime(date('Y-m-d', strtotime($rs['list'][0]['created_at'])))<strtotime(date('Y-m-d'))) {
                $favRs = F::api('/Huodong/Bestvoice/Fav/create', ['uid'=>$uid, 'mid'=>$id, 'type'=>$this->type]);
            }

            if($favRs) {
                F::ajaxRst(true);
            }
        }

        F::ajaxRst(false, '100000', '投票失败');
        return false;
    }

    /**
     * 活动规则
     * @return [type] [description]
     */
    public function ruleAction() {
        $this->loginCheck();

        $phone = $this->userObj->phone?$this->userObj->phone:'';
        $this->getView()->assign('phone', $phone);
    }

    /**
     * 获奖名单
     * @return [type] [description]
     */
    public function winnersAction() {
        if(!$this->materialObj->isEnd() && empty(V('g:no_check_browser'))) {
            return false;
        }
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
            'dofav'=>F::URL('huodong_m:/huodong/weixin_bestvoice_voice/dofav'),
            'moresection'=>F::URL('huodong_m:/huodong/weixin_bestvoice_voice/moresection'),
            'upload'=>F::URL('huodong_m:/huodong/weixin_bestvoice_voice/upload'),
            'login'=>F::URL('huodong_m:/huodong/weixin_bestvoice_voice/login', ['callback'=>BCommon::getCurrentUrl()]),
            'view'=>F::URL('huodong_m:/huodong/weixin_bestvoice_voice/view'),
            'submitinfo' => F::URL('huodong_m:/huodong/weixin_bestvoice_voice/submitinfo'),
        ];

        return $uri;
    }

    /**
     * 获取分享内容
     * @return [type] [description]
     */
    function getShareContent() {
        $action = \Request::getActionName();

        $shareData = [];
        $shareData['img'] = 'http://file.gaofen.com/dou.jpg';
        switch($action) {
            case 'honour' : 
                $shareData['title'] = '我拿到中国豆娃好声音大赛证书啦！';
                $shareData['content'] = '我拿到中国豆娃好声音大赛证书啦！';
            break;

            default:
                $shareData['title'] = '我正在参加豆娃好声音大赛，大奖超实际！快来帮我点赞啊！';
                $shareData['content'] = '我正在参加豆娃好声音大赛，大奖超实际！快来帮我点赞啊！';
            break;
        }

        return $shareData;
    }


    /**
     * 获取用户第一个素材
     * @param  [type] $uid [description]
     * @return [type]      [description]
     */
    private function getFistMidByUid($uid) {
        $uVoice =  F::api('/Huodong/Bestvoice/Material/listByCond', ['type'=>$this->type, 'uid'=>$uid, 'limit'=>1]);
        $mid = NULL;
        if(!empty($uVoice['list'][0]->id)){
            $mid = $uVoice['list'][0]->id;
        }

        return $mid;
    }

    /**
     * 更新电话号码
     * @return [type] [description]
     */
    public function submitinfoAction() {
        if(!$this->userObj->isLogin()) {
            F::ajaxRst(false, 100000);
        }
        $phone = V('g:phone');
        $uid = $this->userObj->getUserId();
        $this->userObj->save(['id'=>$uid, 'phone'=>$phone]);

        F::ajaxRst(true);

        return false;
    }

    public function testAction() {
        $this->loginCheck();
    }

}