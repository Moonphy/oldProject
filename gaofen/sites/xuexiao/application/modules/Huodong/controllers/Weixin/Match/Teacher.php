<?php
use Modules\Huodong\Bestvoice\User;
use Service\ThirdParty\WeixinJssdk;
use Modules\Huodong\Bestvoice\Common as BCommon;
use Modules\Huodong\Prize;

class Weixin_Match_TeacherController extends Yaf_Controller_Abstract
{	

    public function init() {
        $this->userObj = new User();
        $this->type = 5;

        $this->userObj->denyNoWeixin($this->type);
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
                            array('catid'=>CFG::huodong('default_catid'), 'callback'=>F::URL('huodong_m:huodong/weixin_account/callback',['callback'=>$callback]))));
            }            
        }
    }

    public function indexAction() {
        F::redirect(F::URL('huodong_m:huodong/weixin_match_teacher/list'));
    }

	/**
	 * 首页
	 * @return [type] [description]
	 */
    public function listAction() {

        $page = 1;
        $list = F::api('/Huodong/bestvoice/Material/listByCond', ['type'=>$this->type, 'page'=>$page, 'limit'=>20]);

        $uid = $this->userObj->getUserId();
        $this->getView()->assign('list', $list);
        $this->getView()->assign('uid', $uid);
        

        $sectionhtml = $this->getView()->render('weixin/match/teacher/voicesection.html');
        $this->getView()->assign('sectionhtml', $sectionhtml);
    }

    /**
     * 首页更多
     * @return [type] [description]
     */
    public function moreSectionAction() {
        $page = max(V('g:page', 1), 1);
        $list = F::api('/Huodong/bestvoice/Material/listByCond', ['type'=>$this->type, 'page'=>$page, 'fromIndex'=>20, 'limit'=>20]);

        $uid = $this->userObj->getUserId();

        $this->getView()->assign('list', $list);
        $this->getView()->assign('uid', $uid);
        $html = $this->getView()->render('weixin/match/teacher/voicesection.html');
        F::ajaxRst(['html'=>$html, 'curPage'=>$page]);
        return false;
    }

    /**
     * 关键词搜索
     * @return [type] [description]
     */
    public function searchAction() {
        $keyword = V('g:k');

        $rs = F::api('/Huodong/bestvoice/Material/matchSearch', ['type'=>$this->type, 'keyword'=>$keyword]);

        foreach ($rs as $key => $value) {
            $rs[$key]['link'] = F::URL('huodong_m:/huodong/weixin_match_teacher/view', ['id'=>$value['id']]);
        }

        F::ajaxRst(['list'=>$rs]);
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
        $info = F::api('/Huodong/bestvoice/Material/get', ['id'=>$id, '_autoIncView'=>true]);

        $favList = F::api('/Huodong/bestvoice/Fav/listByCond', ['mid'=>$id, 'type'=>$this->type, 'limit'=>20]);

        $this->getView()->assign(compact(['info', 'favList', 'uid']));
    }


    /**
     * 排行榜
     * @return [type] [description]
     */
    public function rankAction() {
        $list = F::api('/Huodong/bestvoice/Material/listByCond', ['type'=>$this->type, 'sort'=>'fav_num', 'limit'=>40, 'path'=>true]);


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
     * 加喜欢
     * @return [type] [description]
     */
    public function doFavAction() {
        $id = V('g:id');
        $uid = $this->userObj->getUserId();

        if(empty($uid)) {
            F::ajaxRst(false, '100001', '非法操作');
        }

        if(time()>strtotime('2016-01-22 17:00')) {
            F::ajaxRst(false, '100002', '活动已经束');
        }

        $rs = F::api('/Huodong/bestvoice/Fav/listByCond', ['uid'=>$uid, 'type'=>$this->type, 'mid'=>$id, 'limit'=>1]);
        if(isset($rs['list'])) {
            $favRs = false;
            //时间控制每天能投1次

            if( empty($rs['list']) ) {
                $favRs = F::api('/Huodong/bestvoice/Fav/create', ['uid'=>$uid, 'mid'=>$id, 'type'=>$this->type]);
            }
            if($favRs) {
                F::ajaxRst(true);
            }
        }

        F::ajaxRst(false, '100000', '请不要重复投票');
        return false;
    }

    /**
     * 获奖
     * @return [type] [description]
     */
    function getPrizeAction() {
        $uid =  $this->userObj->getUserId();

        if(empty($uid)) {
            F::ajaxRst(false, '100001', '非法操作');
        }

        $rs = F::api('/Huodong/bestvoice/Fav/listByCond', ['uid'=>$uid, 'type'=>$this->type, 'limit'=>1]);

        //没投票就是不会中奖
        if( empty($rs['list'][0]) || date('Ymd', strtotime($rs['list'][0]['created_at']))!=date('Ymd')) {
            F::ajaxRst(false, '100002', '非法操作');
        }

        $favRs = $rs['list'][0];

        $prizeObj = new Prize();
        $prizeObj = $prizeObj->setType($this->type);
        $winhtml = '<div id="win_parent" style="color:orange">恭喜！你已获奖！请留下你的手机号码并联系卓越教育微信管理员！请记下中奖确认码：'.$favRs->id.'<br /><div  id="area_school"><div>领奖校区：</div>
                        <select name="area"></select><select name="school"><option value="">请选择</option></select>
                    </div><div class="input-wrap"><input type="tel" placeholder="登记手机号" class="tel" id="tel"/><input type="submit" class="btn popup-btn popup-submit" value="提交" id="btn"/></div>'.
    '<div class="post-message hidden" id="msg"><i>!</i><span>提交失败，请重新输入手机号</span></div></div>';

        $logData = ['uid'=>$uid, 'pid'=>$favRs->mid, 'fav_id'=>$favRs->id, 'date'=>date('Ymd'), 'type'=>$this->type];
        $isWinnging = true;
        //限每天10人中奖
        //setWinningRate(n) 设置中奖率 1/n
        //setMaxDayWinner(n) 设置日中奖数
        //allowValTimes(index, field, times) 允许用户中奖次数
        if($prizeObj->setGift('huangren')->setWinningRate(80)->setMaxWinner(190)->allowUidTimes($uid)->isBingo()) { 
            $prizeObj->writeData($logData);
            $gift = $prizeObj->getGift();
        }elseif($prizeObj->setGift('q200')->setWinningRate(2)->allowUidTimes($uid, $times=10)->isBingo()) {
            $prizeObj->writeData($logData);
            $gift = $prizeObj->getGift();
        }elseif($prizeObj->setGift('q100')->setWinningRate(0)->allowUidTimes($uid, $times=10)->isBingo()) {
            $prizeObj->writeData($logData);
            $gift = $prizeObj->getGift();
        }else{
            $winhtml = '';
            $isWinnging = false;
            $gift = 'quan-not';
        }    
        
        $giftimg = $gift ? GAOFEN_STATIC.'/html/weixin/voice/img/'.$gift.'.png?_r=82817':'';

        F::ajaxRst(['winhtml'=>$winhtml, 'giftimg'=>$giftimg, 'isWinnging'=>$isWinnging]);
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


    public function loginAction() {
        $this->loginCheck();

        F::redirect(F::URL('huodong_m:huodong/weixin_match_teacher/list'));
    }

    function getAJaxUri() {
        $uri = [
            'dofav'=>F::URL('huodong_m:/huodong/weixin_match_teacher/dofav'),
            'moresection'=>F::URL('huodong_m:/huodong/weixin_match_teacher/moresection'),
            'upload'=>F::URL('huodong_m:/huodong/weixin_match_teacher/upload'),
            'login'=>F::URL('huodong_m:/huodong/weixin_match_teacher/login', ['callback'=>BCommon::getCurrentUrl()]),
            'view'=>F::URL('huodong_m:/huodong/weixin_match_teacher/view'),
            'prize'=>F::URL('huodong_m:/huodong/weixin_match_teacher/getPrize'),
            'submitinfo' => F::URL('huodong_m:/huodong/weixin_match_teacher/submitinfo'),
            'search'=>F::URL('huodong_m:/huodong/weixin_match_teacher/search'),
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
        $shareData['img'] = 'http://file.gaofen.com/html/weixin/match/img/fav-icon.png';
        switch($action) {
            default:
                $shareData['title'] = '2015年卓越一对一“最Match师生”评选活动';
                $shareData['content'] = '2015年卓越一对一“最Match师生”评选活动';
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
            F::ajaxRst(false, 100000, '请先登录');
        }
        $phone = V('g:phone');
        $venueAddr = V('g:venueAddr');
        $uid = $this->userObj->getUserId();
        $saveData = ['id'=>$uid];

        if($venueAddr) {
           $saveData['extData']  = ['venueAddr'=>$venueAddr];
        }

        if($phone) {
            $saveData['phone']  = $phone;
        }
        
        $this->userObj->save($saveData);

        F::ajaxRst(true);

        return false;
    }
}