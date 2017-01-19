<?php

use Modules\Huodong\Bestvoice\User;
use Service\ThirdParty\WeixinJssdk;
use Modules\Huodong\Bestvoice\Audio;
use Modules\Huodong\Bestvoice\Common as BCommon;

class Weixin_mycourse_VoiceController extends Yaf_Controller_Abstract
{	

    public function init() {
        $this->userObj = new User();
        $this->project = 'mycourse2016';
        $this->type = CFG::huodong($this->project, 'type');
        $this->catid = CFG::huodong($this->project, 'catid');
        $this->endTime = strtotime(CFG::huodong($this->project, 'end_date'));
        $this->beginTime = strtotime(CFG::huodong($this->project, 'begin_date'));

        $this->userObj->denyNoWeixin($this->type, BCommon::getCurrentUrl());
        $jsSdk = new WeixinJssdk();
        $this->getView()->assign('wxConfig', json_encode($jsSdk->getCfg()));
        $this->getView()->assign('ajaxUri', json_encode($this->getAJaxUri()));
        $this->getView()->assign('shareData', json_encode($this->getShareContent()));
    }

    private function loginCheck() {        
        if(!$this->userObj->isLogin()) {
            if(!$this->userObj->autoLogin()) {
                $callback = V('g:callback')?:BCommon::getCurrentUrl();
                F::redirect(F::URL('auth:/Auth/Weixin/sync', 
                            array('catid'=>$this->catid, 'callback'=>F::URL('huodong_m:huodong/weixin_account/callback',['callback'=>$callback]))));
            }            
        }
    }

	/**
	 * 首页
	 * @return [type] [description]
	 */
    public function indexAction() {

        $page = 1;
        $list = F::api('/Huodong/bestvoice/Material/listByCond', ['type'=>$this->type, 'page'=>$page, 'limit'=>40]);

        $uid = $this->userObj->getUserId();
        $this->getView()->assign('list', $list);
        $this->getView()->assign('uid', $uid);
        

        $sectionhtml = $this->getView()->render('weixin/mycourse/voice/voicesection.html');
        $this->getView()->assign('sectionhtml', $sectionhtml);
    }

    /**
     * 首页更多
     * @return [type] [description]
     */
    public function moreSectionAction() {
        $page = max(V('g:page', 1), 1);
        $list = F::api('/Huodong/bestvoice/Material/listByCond', ['type'=>$this->type, 'page'=>$page, 'fromIndex'=>40, 'limit'=>40]);

        $uid = $this->userObj->getUserId();

        $this->getView()->assign('list', $list);
        $this->getView()->assign('uid', $uid);
        $html = $this->getView()->render('weixin/mycourse/voice/voicesection.html');
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
        $project = $this->project;
        $thread_id = implode('_', ['material', $this->type, $id]); //如果是material表活动，一定要加'material_' 否则相应的评论数不会累加

        if(empty($id)) {
            die('无效访问');
        }
        $info = F::api('/Huodong/bestvoice/Material/get', ['id'=>$id, '_autoIncView'=>true]);
        $favList = F::api('/Huodong/bestvoice/Fav/listByCond', ['mid'=>$id, 'type'=>$this->type, 'limit'=>20]);

        $ajaxUri = $this->getAJaxUri();
        $cmtCfg = ['project'=>$project, 'threadId'=>$thread_id, 'isLogin'=>!empty($uid), 'loginUrl'=>$ajaxUri['login'], 'insertId'=>'comment_div', 'projectCommentId'=>'comment_publish'];
        
        if(F::inEnv('develop')) {
            $cmtCfg['urlHost'] = 'http://dev.xuexiao.gaofen.com';
        }


        $this->getView()->assign(compact(['info', 'favList', 'uid', 'cmtCfg']));
    }

    /**
     * 录音
     * @return [type] [description]
     */
    public function recordAction() {
        $this->loginCheck();
        
        $uid = $this->userObj->getUserId();
        $mid = $this->getFistMidByUid($uid);
        $info = F::api('/Huodong/bestvoice/Material/get', ['id'=>$mid]);

        $this->getView()->assign('info', $info);
    }

    /**
     * 排行榜
     * @return [type] [description]
     */
    public function rankAction() {
        $list = F::api('/Huodong/bestvoice/Material/listByCond', ['type'=>$this->type, 'sort'=>'fav_num_total', 'limit'=>40, 'path'=>true]);


        $uid = $rank = 0;
        $info = [];
        if($this->userObj->isLogin()) {
            $uid = $this->userObj->getUserId();

            $mid = $this->getFistMidByUid($uid);
            $rank = F::api('/Huodong/bestvoice/Material/getRankById', ['id'=>$mid, 'type'=>$this->type]);
            $info = F::api('/Huodong/bestvoice/Material/get', ['id'=>$mid]);
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

        $saveUri = "/huodong/voice/".$this->type."/{$uid}_".md5(time());
        $savePath = UPLOAD_PATH.$saveUri;

        $audObj = new Audio();
        $rs = $audObj->save($media_id, $savePath);

        F::log($rs);

        if($rs) {
            $saveData = [
                'uid'   => $uid,
                'path'  => $saveUri,
                'type'  => $type,
                'mil_sec' => $sec,
                'type'  => $this->type,
            ];

            $mid = $this->getFistMidByUid($uid);
            if($mid) {
                $saveData['id'] = $mid;
                $rs = F::api('/Huodong/bestvoice/Material/update', $saveData);
            }else{
                $rs = F::api('/Huodong/bestvoice/Material/create', $saveData);
                $mid = $rs->id;
            }
        }else{
            F::ajaxRst(false, 100000, '保存失败');
        }

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

        if(time()<$this->beginTime) {
            F::ajaxRst(false, '100002', '活动还没开始！');
        }

        if(time()>$this->endTime) {
            F::ajaxRst(false, '100002', '活动已经束！');
        }

        //验证码检测
        //$this->vCodeCheck();
        
        //来源检测
        $this->checkReferer();

        $rs = F::api('/Huodong/bestvoice/Fav/listByCond', ['uid'=>$uid, 'type'=>$this->type, 'mid'=>$id, 'limit'=>1]);
        if(isset($rs['list'])) {
            $favRs = false;
            //时间控制每天能投1次

            if( empty($rs['list']) || strtotime(date('Y-m-d', strtotime($rs['list'][0]['created_at'])))<strtotime(date('Y-m-d'))) {
                $favRs = F::api('/Huodong/bestvoice/Fav/create', ['uid'=>$uid, 'mid'=>$id, 'type'=>$this->type]);
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

        $uid = $this->userObj->getUserId();
        $list = F::api('/Huodong/bestvoice/Assemblage/listByCond', ['type'=>$this->type, 'cond1'=>1, 'uid'=>$uid, 'limit'=>1]);
        $this->getView()->assign('list', $list['list']);
    }


    public function loginAction() {
        $this->loginCheck();

        F::redirect(F::URL('huodong_m:huodong/weixin_mycourse_voice/index'));
    }

    function getAJaxUri() {
        $uri = [
            'dofav'=>F::URL('huodong_m:/huodong/weixin_mycourse_voice/dofav'),
            'moresection'=>F::URL('huodong_m:/huodong/weixin_mycourse_voice/moresection'),
            'upload'=>F::URL('huodong_m:/huodong/weixin_mycourse_voice/upload'),
            'login'=>F::URL('huodong_m:/huodong/weixin_mycourse_voice/login', ['callback'=>BCommon::getCurrentUrl()]),
            'view'=>F::URL('huodong_m:/huodong/weixin_mycourse_voice/view'),
            'submitinfo' => F::URL('huodong_m:/huodong/weixin_mycourse_voice/submitinfo'),
            'captchaImg' => F::URL('huodong_m:/Captcha/getCode'),
            'captchaCheck' => F::URL('huodong_m:/Captcha/auth'),
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
        $shareData['img'] = 'http://file.gaofen.com/weike.jpg';
        switch($action) {
            default:
                $shareData['title'] = '卓越教育第六届微课大赛，为牛师点赞！';
                $shareData['content'] = '卓越教育第六届微课大赛，为牛师点赞！';
            break;
        }

        return $shareData;
    }


    private function getFistMidByUid($uid) {
        $uVoice =  F::api('/Huodong/bestvoice/Material/listByCond', ['type'=>$this->type, 'uid'=>$uid, 'limit'=>1]);
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
        $guess = V('g:guess');

        $uid = $this->userObj->getUserId();

        $list = F::api('/Huodong/bestvoice/Assemblage/listByCond', ['type'=>$this->type, 'cond1'=>1, 'uid'=>$uid, 'limit'=>1]);

        if(isset($list['total']) && $list['total']>0) {
            F::ajaxRst(false, '100000', '不能重复提交');
        }

        $this->userObj->save(['id'=>$uid, 'phone'=>$phone]);

        $assemblage = ['phone'=>$phone, 'guess'=>$guess];
        $data = ['uid'=>$this->userObj->getUserId(), 'type'=>$this->type, 'cond1'=>1, 'assemblage'=>json_encode($assemblage)];
        F::api('/Huodong/bestvoice/Assemblage/create', $data);

        F::ajaxRst(true);

        return false;
    }

    /**
     * 活动每期数据备份
     * @return [type] [description]
     */
    public function finishRoundAction() {
        if(F::ip() == '0.0.0.0') {
            $rs = F::api('/Huodong/bestvoice/Material/finishRound', ['type'=>$this->type]);
            die($rs);
        }
        die(false);
    }

    /**
     * 评论列表
     * @return [type] [description]
     */
    public function commentListAction() {

        $this->loginCheck();
        
        $uid = $this->userObj->getUserId();
        $allow_uids = $this->getAdminUids();
        if(!in_array($uid, $allow_uids)) {
            return false;
        }

        $page = max(V('g:page', 1), 1);
        $limit = 20;
        $type = (int)V('g:type', 1);

        $list = F::api('/Comment/Standard/listByCond', ['project_id'=>$this->project, 'is_verify'=>$type, 'limit'=>$limit, 'page'=>$page]);
        $list = json_decode(json_encode($list), true);
        $uids = array_column($list['list'], 'uid');
        $users = F::api('/Huodong/Bestvoice/User/getBatch', ['ids'=>array_unique($uids)]);

        foreach($list['list'] as $key=>$row) {
            $list['list'][$key]['user'] = isset($users[$row['uid']])?array_only($users[$row['uid']]->toArray(), ['id', 'nickname', 'headimgurl']):[];
        }

        $this->getView()->assign('list', $list);
        $this->getView()->assign('page', $page);
        $this->getView()->assign('limit', $limit);
        $this->getView()->assign('type', $type);
    }

    /**
     * 删除评论
     * @return [type] [description]
     */
    public function commentDeleteAction() {

        $uid = $this->userObj->getUserId();
        $allow_uids = $this->getAdminUids();
        if(!in_array($uid, $allow_uids)) {
            return false;
        }

        $id = (int)V('g:id');
        $page = max(V('g:page', 1), 1);
        $info = F::api('/Comment/Standard/get', ['id'=>$id]);

        if($info) {
            $rs = F::api('/Comment/Standard/delete', ['id'=>$id]);

            $thread_id = explode('_', $info->thread_id);
            $mid = $thread_id[2];
            if($rs && !isset($rs['errno'])) {
                F::api('/Huodong/Bestvoice/Material/decr', ['field'=>'cmt_num', 'id'=>$mid]);
                F::api('/Huodong/Bestvoice/Material/decr', ['id'=>$mid, 'field'=>'fav_num_total', 'num'=>2]);
            }
        }

        F::redirect(F::URL('huodong_m:/huodong/weixin_mycourse_voice/commentList', ['page'=>$page]));
        return false;
    }

    /**
     * 删除评论
     * @return [type] [description]
     */
    public function commentUpdateAction() {

        $uid = $this->userObj->getUserId();
        $allow_uids = $this->getAdminUids();
        if(!in_array($uid, $allow_uids)) {
            return false;
        }

        $id = (int)V('g:id');
        $page = max(V('g:page', 1), 1);
        $opt = V('g:opt');

        $ex = ['pass'=>1, 'fail'=>2];

        F::api('/Comment/Standard/update', ['id'=>$id, 'is_verify'=>(int)@$ex[$opt]]);

        F::redirect(F::URL('huodong_m:/huodong/weixin_mycourse_voice/commentList', ['page'=>$page]));
        return false;
    }

    /**
     * 管理员UID
     * @return [type] [description]
     */
    private function getAdminUids() {
        return ['8839493'/*me*/, '8840220'/*Mashel*/, '8840225'/*Vicky*/, '8839494'/*大奔*/, '8844414'/*c渔夫要画画*/, '8840218'/*氵尗又艸连*/, '8843629'/*May*/, '8840219'/*yan*/ ];
    }

    /**
     * 验证码检测
     * @return [type] [description]
     */
    private function vCodeCheck() {
        $cookieName = 'H_VCODE_FLAG';
        $hVCodeFlag = V('c:'.$cookieName);
        $vcode      = V('r:code');

        if(empty($hVCodeFlag) || $hVCodeFlag!=$this->getVCodeFlag()) {
            if(empty($vcode)) {
                F::ajaxRst(false, -10006, '请输入验证码', false);
            }
        }

        if($vcode) {
            $captcha = DIBuilder::make('Adapters\Captcha\CaptchaInterface');
            if($captcha->isValid($vcode)) {
                F::setcookie($cookieName, $this->getVCodeFlag(), time()+3600*24*7);
            }else{
                F::ajaxRst(false, 10007, '验证码不正确', false);
            }

            $captcha->resetCode();
        }
    }

    /**
     * [getVCodeFlag description]
     * @param  [type] $H_VCODE_FLAG [description]
     * @return [type]               [description]
     */
    private function getVCodeFlag() {
        $sessid = session_id();
        $salt   = '*sw!a1z';
        $uid    = $this->userObj->getUserId();

        $current_hVCodeFlag = crc32(implode(':',[$sessid, $salt, $uid]));

        return $current_hVCodeFlag;
    }

    /**
     * 来源检测
     * @return [type] [description]
     */
    private function checkReferer() {
        $needle = '';
        if(\F::inEnv('product')) {
            $needle = 'm.gaofen.com';
        }

        if(empty($_SERVER['HTTP_REFERER']) || ($needle && strpos($_SERVER['HTTP_REFERER'], $needle)===false)) {
            F::ajaxRst(false, 10000, '非法操作', false);
        }
    }
}