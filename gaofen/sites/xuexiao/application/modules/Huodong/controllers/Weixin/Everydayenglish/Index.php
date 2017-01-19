<?php 

use Modules\Huodong\Everydayenglish\BaseController as Controller;
use Modules\Huodong\BaseTask\ActionTraits\Login;
use Modules\Huodong\Everydayenglish\User;
use Modules\Huodong\Everydayenglish\Material;
use Modules\Huodong\Bestvoice\Audio;
use Modules\Huodong\Bestvoice\Common;


class Weixin_Everydayenglish_IndexController extends Controller {
    use Login;

    protected $prefix = 'huodong_m:/huodong/weixin_everydayenglish_index';
    protected $fn;
    protected $config;

    private $type;
    private $one_day_stamp = 86400;

    const ASSEMBLAGE_INTEGERAL = 1;//当前积分
    const ASSEMBLAGE_SIGN_IN = 2; //签到数
    const ASSEMBLAGE_CONTUINUE_SIGN_IN = 3; //连续签到次数

    public function init() {
        parent::init();
        // 关闭自动渲染
        Yaf_Dispatcher::getInstance()->disableView();

        // $this->requireLogin();

        $this->config = CFG::huodong('everydayenglish');

        $this->catid = $this->config['catid'];

        $this->type = $this->getType();

        $url = $this->getCurrentUri();

        $jsSdk = F::api('auth:/Auth/WeixinPub/getWXConfig', ['catid'=>$this->catid, 'url'=>$url]);
        $this->getView()->assign('wxConfig', json_encode($jsSdk));
    }


    // 被抽象类定义的方法
    protected function isEnd() {
        // todo temporary until it is final
        if (strtotime($this->config['end_date']) < time()) {
            return true;
        }
        return false;
    }

    protected function isBegin() {
        // todo temporary until it is final
        if (strtotime($this->config['begin_date']) < time()) {
            return true;
        }
        return false;
    }

    protected function getPrjCode() {
        // return 'ZKAO16';
    }

    protected function getAppid() {
        $catid = $this->config['catid'];
        $appid = CFG::auth('cat_list', $catid, 'app_id');
        return $appid;
    }

    protected function getCatid() {
        return $this->config['catid'];
    }

    /**
     * [getType 获取ini配置中的项目类型]
     * @return [type]     [description]
     * @author ken
     * @date   2016-10-09
     */
    protected function getType() {
        return $this->config['type'];
    }

    protected function prerequisite() {
        return true;
    }

    protected function getUser() {
        return new User();
    }

    protected function getMaterial() {
        return new Material($this->getType());
    }

    protected function getLoginUrl() {
        return F::URL("{$this->prefix}/login/");
    }

    protected function getLoginCallbackUrl()
    {
        return F::URL("{$this->prefix}/loginCallback/");
    }

    protected function getExtData() {
        return json_encode([
            'text' => V('p:text', ''),
        ]);
    }

    protected function getLeftOver() {
        return strtotime('2016-06-20') - time();
    }

    /**
     * [indexAction]
     * @return [type]     [description]
     * @author ken
     * @date   2016-10-09
     */
    public function indexAction() {
        // 微信登录
        $this->requireLogin();

        $type = (int)V('R:type',1);
        $this->getView()->assign('type', $type);
        $this->getView()->assign('headimgurl', $this->userObj->headimgurl);

        // type值为1表示当天列表，否则表示昨天
        if( $type == 1 ){
            // 录音列表数据输出
            $today_voice_list = $this->voiceList($type);

            $this->getView()->assign('date', substr(date('Y-m-d'), 0, 10));
            $this->getView()->assign('url', F::URL('huodong_m:/huodong/weixin_everydayenglish_index/index',['type' => 2]));
        }else if($type == 2){
            // 录音列表数据输出
            $today_voice_list = $this->voiceList($type);

            $this->getView()->assign('date', date("Y-m-d",strtotime("-1 day")));
            $this->getView()->assign('url',F::URL('huodong_m:/huodong/weixin_everydayenglish_index/index',['type' => 1]));
        }else{
            exit('参数有误');
        }

        // 查询用户是否已提交过录音
        // submit_type为1的时候是未提交，2为提交过
        $user_m_info = $this->getUserMaterialInfo();

        if(!empty($user_m_info)){
            if( $user_m_info['created_at'] == date('Y-m-d') ){
                $this->getView()->assign('submit_type',2);
            }else{
                $this->getView()->assign('submit_type',1);
            }
        }else{
            $this->getView()->assign('submit_type',1);
        }

        // 用户签到天数
        $user_assemblage = $this->getUserAssemblageInfo();
        if(!empty($user_assemblage)){
            $sign_days = $user_assemblage[2]['views'];
        }else{
            $sign_days = 0;
        }
        $this->getView()->assign('sign_days', $sign_days);

        if( date('Ymd') > date('Ymd', strtotime($this->config['begin_date']))){
            $this->getView()->assign('yesterday_type',2);
        }else{
            //不显示昨日回顾
            $this->getView()->assign('yesterday_type',1);
        }
 
        $daily_voice_info = $this->getDailyVoiceAction($type);
        // 查询每日提供题目是否有录音
        if(empty($daily_voice_info['path'])){
            $this->getView()->assign('daily_voice_type',1);
        }else{
            $this->getView()->assign('daily_voice_type',2);
        }

        // 查询每题提供的题目是否存在
        if(!empty($daily_voice_info)){
            $this->getView()->assign('daily_voice_type',3);
        }else{
            $this->getView()->assign('daily_voice_type',4);
        }

        $subTitle = '请回答老师的问题';

        if(time()>strtotime('2016-12-20') && time()<strtotime('2017-1-4')) {
            $subTitle = '请跟老师一起朗读';
        }

        $this->initView();
        $this->display('index',['data' => $today_voice_list, 'subTitle'=>$subTitle]);
    }

    /**
     * [getDailyVoiceAction 获取每日英语练习录音]
     * @return [type]     [description]
     * @author ken
     * @date   2016-10-12
     */
    public function getDailyVoiceAction($type){

        if( $type == 1 ){
            // 用日差作页数，查询导入的音频（今天）
            $page = $this->delta_day($this->config['begin_date']);
        }else{
            // 用日差作页数，查询导入的音频（昨天）
            $page = $this->delta_day($this->config['begin_date']) - 1;
            $page = $page > 0 ? $page:1;
        }

        // 查询每日提供录音
        $daily_voice = F::api('/Huodong/Bestvoice/Material/listByCond',[
            'inviter' => 0,
            'type' => $this->type,
            'sort' => 'fav_num',
            'page' => $page,
            'limit' => 1
        ]);

        $daily_voice_data = [];

        foreach ($daily_voice['list'] as $value) {
            $daily_voice_data = [
                'id' => $value->id,
                'path' => $this->getVoiceLink($value->path),
                'mil_sec' => $value->mil_sec,
                'content' => $value->content
            ];
        }

        // F::p($daily_voice_data);

        return $daily_voice_data;
    }

    /**
     * [voicelistAction 录音列表]
     * @return [type]     [description]
     * @author ken
     * @date   2016-10-09
     */
    public function voiceListAction() {
        // 限制微信登录
        // $this->requireLogin();
        // 
        $type = V('g:type');
        $page = max((int)V('g:page'), 1);
        
        //每日英语练习录音
        $daily_voice = $this->voiceList($type, $page);
        
        F::ajaxRst(['html'=>$this->getView()->render('weixin/everydayenglish/index/list.html', ['today_voice_list'=>$daily_voice['today_voice_list']])]);

        // F::p($data);
    }

    /**
     * [voicelistAction 录音列表]
     * @return [type]     [description]
     * @author ken
     * @date   2016-10-09
     */
    public function voiceList($type, $page=1) {
        // 限制微信登录
        // $this->requireLogin();
        
        //每日英语练习录音
        $daily_voice = $this->getDailyVoiceAction($type);
        
        // 今天提交的录音
        if( $type == 1 ){
            if(!empty($daily_voice)){
                $list = F::api('/Huodong/Bestvoice/Material/listByCond',[
                    'inviter' => $daily_voice['id'], //inviter在此项目中作录音的父id
                    'sort' => 'created_at',
                    'type' => $this->type,
                    'page' => $page,
                    'limit' => 10
                ]);
            }else{
                $list['list'] = [];
            }
        }else{
            if(!empty($daily_voice)){
                $list = F::api('/Huodong/Bestvoice/Material/listByCond',[
                    'inviter' => $daily_voice['id'], //inviter在此项目中作录音的父id
                    'type' => $this->type,
                    'sort' => 'updated_at',
                    'page' => $page,
                    'limit' => 3
                ]);
            }else{
                $list['list'] = [];
            }
        }

        // F::p($daily_voice);

        $data = [
            'daily_voice' => $daily_voice,
            'today_voice_list' => $list['list']
        ];
        return $data;

        // F::p($data);
    }


    /**
     * 上传录音(签到)
     * @return [type] [description]
     */
    public function uploadVoicePsAction() {
        // $this->requireLogin();
        // $uid = $this->userObj->getUserId();

        // $media_id   = V('R:media_id'); //素材ID
        // $sec        = (int)V('R:sec'); //秒数
        
        // $savePath = $this->voiceSave($media_id, $sec);

        // if($savePath){
        //     F::ajaxRst(['path'=>$savePath]);
        // }else{
        //     F::ajaxRst(false, 410021, '录音储存失败');
        // }
    }

    /**
     * 上传录音(签到)
     * @return [type] [description]
     */
    public function uploadVoiceAction() {
        $this->requireLogin();
        $uid = $this->userObj->getUserId();

        $media_id   = V('g:media_id'); //素材ID
        $sec        = (int)V('g:sec'); //秒数

        $type = $this->type; //活动类型

        if(!$this->isBegin()) {
            F::ajaxRst(false, 100001, '活动还没开始');
        }

        if($this->isEnd()) {
            F::ajaxRst(false, 100001, '活动已结束');
        } 

        // 查询每日提供录音
        $page = $this->delta_day($this->config['begin_date']);
        $daily_voice = F::api('/Huodong/Bestvoice/Material/listByCond',[
            'inviter' => 0,
            'type' => $this->type,
            'sort' => 'fav_num',
            'page' => $page,
            'limit' => 1
        ]);
        $daily_voice_info = [];
        foreach ($daily_voice['list'] as $row) {
            $daily_voice_info = [
                'id' => $row->id,
            ];
        }

        // 获取用户积分、签到、连续签到数据
        $user_assemblage = [];
        $user_assemblage_list = F::api('/Huodong/Bestvoice/Assemblage/listByCond',[
            'uid' => $uid, 
            'type' => $this->type,
        ]);

        if(!empty($user_assemblage_list['list'])){
            foreach ($user_assemblage_list['list'] as $row) {
                $user_assemblage[$row->cond1] = [
                    'id' => $row->id,
                    'uid' => $row->uid,
                    'type' => $row->type,
                    'views' => $row->views,
                    'cond1' => $row->cond1,
                ];
            }
        }

        $integral_id = $user_assemblage[static::ASSEMBLAGE_INTEGERAL]['id']; //当前积分记录的id cond1
        $sign_id = $user_assemblage[static::ASSEMBLAGE_SIGN_IN]['id']; //签到总数记录的id cond1
        $continue_sign_id = $user_assemblage[static::ASSEMBLAGE_CONTUINUE_SIGN_IN]['id']; //连续签到天数记录的id cond1

        // 获取最后一次录音记录
        $user_m_list = F::api('/Huodong/Bestvoice/Material/listByCond',[
            'uid' => $uid, 
            'sort' => 'created_at',
            'type' => $this->type,
            'limit' => 1
        ]);

        // assemblage表存在记录
        if( !empty($user_assemblage_list['list']) ){

            // meterial表有数据（录音数据非空）
            if(!empty($user_m_list['list'])){
                $user_m = [];
                foreach ($user_m_list['list'] as $row) {
                    $user_m = [
                        'id' => $row->id,
                        'uid' => $row->uid,
                        'created_at' => $row->created_at
                    ];
                }

                // 禁止当日重复提交
                if( substr($user_m['created_at'], 0, 10) == substr(date('Y-m-d'), 0, 10) ){
                    F::ajaxRst(false, 400031, '今天您已提交过录音');
                }

                // 录音储存
                $saveUri = $this->voiceSave($media_id, $sec);
                
                if($saveUri){

                    // 储存meterial
                    $saveData = [
                        'uid'   => $uid,
                        'path'  => $saveUri,
                        'type'  => $this->type,
                        'mil_sec'   => $sec,
                        'inviter' => $daily_voice_info['id'],
                    ];

                    $res = F::api('/Huodong/Bestvoice/Material/create', $saveData);
                    $mid = $res->id;

                    if(!$mid){
                        F::ajaxRst(false, 100011, '录音保存失败');
                    }

                    // 最近一条录音的创建时间
                    $last_sign = substr($user_m['created_at'], 0, 10);

                    // $integral_id = $user_assemblage[1]['id']; //当前积分cond1
                    // $sign_id = $user_assemblage[2]['id']; //签到总数cond1
                    // $continue_sign_id = $user_assemblage[3]['id']; //连续签到天数cond1

                    // 连续签到
                    if( $this->delta_stamp(time(), strtotime($last_sign), 2)){

                        // 连续签到天数+1
                        $continue_sign_info = F::api('/Huodong/Bestvoice/Assemblage/get',[
                            'id' => $continue_sign_id,
                            '_autoIncView' => 1
                        ]);

                        // 每7天+2积分，否则+1
                        if( $continue_sign_info->views % 7 == 0 ){
                            $integral_info = F::api('/Huodong/Bestvoice/Assemblage/get',[
                                'id' => $integral_id,
                                'views' => 2,
                                '_autoIncView' => 1
                            ]);
                        }else{
                            $integral_info = F::api('/Huodong/Bestvoice/Assemblage/get',[
                                'id' => $integral_id,
                                '_autoIncView' => 1
                            ]);
                        }

                        // 签到总天数+1
                        $sign_info = F::api('/Huodong/Bestvoice/Assemblage/get',[
                            'id' => $sign_id,
                            '_autoIncView' => 1
                        ]);

                        // 获取当前积分
                        $integral = $integral_info->views;

                        $sign_continue_days = $continue_sign_info->views;
                    }else{
                        // 非连续签到
                        
                        // 连续签到天数重置成1,continue_sign_info直接返回天数
                        $continue_sign_info = F::api('/Huodong/Bestvoice/Assemblage/setViews',[
                            'id' => $continue_sign_id,
                            'views' => 1
                        ]);

                        // 积分+1
                        $integral_info = F::api('/Huodong/Bestvoice/Assemblage/get',[
                            'id' => $integral_id,
                            '_autoIncView' => 1
                        ]);

                        // 签到总天数+1
                        $sign_info = F::api('/Huodong/Bestvoice/Assemblage/get',[
                            'id' => $sign_id,
                            '_autoIncView' => 1
                        ]);

                        // 获取当前积分
                        $integral = $integral_info->views;

                        //当前连续签到天数
                        $sign_continue_days = 1;
                    }
                }else{
                    F::ajaxRst(false, 100000, '录音保存失败');
                }

                F::ajaxRst(['id'=>$mid, 'integral'=>$integral, 'sign_continue_days'=>$sign_continue_days]);
            }else{
                // assemblage非空，meterial为空（被删除的情况下）

                // 录音储存
                $saveUri = $this->voiceSave($media_id, $sec);

                if($saveUri){
                    // 储存meterial
                    $saveData = [
                        'uid'   => $uid,
                        'path'  => $saveUri,
                        'type'  => $this->type,
                        'mil_sec'   => $sec,
                        'inviter' => $daily_voice_info['id'],
                    ];

                    $res = F::api('/Huodong/Bestvoice/Material/create', $saveData);
                    $mid = $res->id;

                    if(!$mid){
                        F::ajaxRst(false, 100011, '录音保存失败');
                    }

                    // 连续签到天数重置成1,continue_sign_info直接返回天数
                    $continue_sign_info = F::api('/Huodong/Bestvoice/Assemblage/setViews',[
                        'id' => $continue_sign_id,
                        'views' => 1
                    ]);

                    // 积分+1
                    $integral_info = F::api('/Huodong/Bestvoice/Assemblage/get',[
                        'id' => $integral_id,
                        '_autoIncView' => 1
                    ]);

                    // 签到总天数+1
                    $sign_info = F::api('/Huodong/Bestvoice/Assemblage/get',[
                        'id' => $sign_id,
                        '_autoIncView' => 1
                    ]);

                    // 获取当前积分
                    $integral = $integral_info->views;

                    //当前连续签到天数
                    $sign_continue_days = 1;
                }else{
                    F::ajaxRst(false, 100000, '录音保存失败');
                }

                F::ajaxRst(['id'=>$mid, 'integral'=>$integral,'sign_continue_days'=>$sign_continue_days]);
            }
        }else{
            //assemblage不存在数据（首次提交）

            // 录音储存，返回本地储存地址
            $saveUri = $this->voiceSave($media_id, $sec);

            if(!empty($saveUri)){
                // 储存Material
                $saveData = [
                    'uid'   => $uid,
                    'path'  => $saveUri,
                    'type'  => $type,
                    'mil_sec'   => $sec,
                    'inviter' => $daily_voice_info['id'],
                ];
                $res = F::api('/Huodong/Bestvoice/Material/create', $saveData);
                $mid = $res->id;

                // 添加连续天数记录为1
                $saveData = [
                    'uid'   => $uid,
                    'type'  => $type,
                    'views' => 1,
                    'cond1' => 3,
                ];
                $continue_sign_res = F::api('/Huodong/Bestvoice/Assemblage/create', $saveData);

                // 添加添加积分记录为1
                $saveData = [
                    'uid'   => $uid,
                    'type'  => $type,
                    'views' => 1,
                    'cond1' => 1,
                ];
                $integral_res = F::api('/Huodong/Bestvoice/Assemblage/create', $saveData);

                // 添加总天数记录为1
                $saveData = [
                    'uid'   => $uid,
                    'type'  => $type,
                    'views' => 1,
                    'cond1' => 2,
                ];
                $sign_res = F::api('/Huodong/Bestvoice/Assemblage/create', $saveData);

                // 获取当前积分
                $integral_info = F::api('/Huodong/Bestvoice/Assemblage/get',['id' => $integral_res->id]);
                $integral = $integral_info->views;

                //当前连续签到天数
                $sign_continue_days = 1;
            }else{
                F::ajaxRst(false, 100021, '录音保存失败');
            }

            F::ajaxRst(['id'=>$mid, 'integral'=>$integral, 'sign_continue_days'=>$sign_continue_days]);
        }
    }

    /**
     * [viewsAction 增加浏览数]
     * @return [type]     [description]
     * @author ken
     * @date   2016-10-11
     */
    public function viewsAction(){

        $mid    = V('R:id');

        // 录音浏览数+1
        $views = F::api('/Huodong/Bestvoice/Material/get', [
            'id' => $mid,
            '_autoIncView' => 1
        ]);

        F::ajaxRst(['views'=>$views->views]);
    }

    public function testAction(){
        $user = F::api('/Huodong/Bestvoice/Material/listByCond',[
            'uid' => 9029317,
            'limit' => 1
        ]);

        $u = [];
        foreach ($user['list'] as $value) {
            $u = [
                'created_at' => substr($value->created_at, 0, 10),
            ];
        }

        F::p($user);
    }

    /**
     * [getUserMaterialInfo 格式化获取最后一条用户material信息]
     * @return [type]     [description]
     * @author ken
     * @date   2016-10-13
     */
    private function getUserMaterialInfo(){

        $material_list = F::api('/Huodong/Bestvoice/Material/listByCond',[
            'uid' => $this->userObj->id, //$this->userObj->id
            'type' => $this->type,
            'limit' => 1
        ]);

        $u_material_info = [];
        if(!empty($material_list['list'])){
            foreach ($material_list['list'] as $value) {
                $u_material_info = [
                    'created_at' => substr($value->created_at, 0, 10),
                ];
            }
        }
        
        return $u_material_info;
    }

    /**
     * [getUserAssemblageInfo 格式化获取最后一条用户assemblage信息]
     * @return [type]     [description]
     * @author ken
     * @date   2016-10-13
     */
    private function getUserAssemblageInfo(){
        $assemblage_list = F::api('/Huodong/Bestvoice/Assemblage/listByCond',[
            'uid' => $this->userObj->id,
            'type' => $this->type
        ]);

        $u_assemblage_info = [];
        if(!empty($assemblage_list['list'])){
            foreach ($assemblage_list['list'] as $value) {
                $u_assemblage_info[$value->cond1] = [
                    'id' => $value->id,
                    'uid' => $value->uid,
                    'views' => $value->views,
                    'cond1' => $value->cond1,
                ];
            }
        }

        return $u_assemblage_info;
    }

    /**
     * [voiceSave description]
     * @param  [type]     $media_id [description]
     * @param  [type]     $uid      [description]
     * @return [type]               [description]
     * @author ken
     * @date   2016-10-12
     */
    private function voiceSave($media_id, $sec){

        $uid = $this->userObj->getUserId();

        // 录音储存
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

        if($rs){
            return $saveUri;
        }else{
            return '';
        }
    }

    /**
     * [delta_stamp 时间差]
     * @param  [type]     $stamp_one [时间戳1]
     * @param  [type]     $stamp_two [时间戳2]
     * @param  [type]     $day       [天数]
     * @return [bool]                [description]
     * @author ken
     * @date   2016-10-09
     */
    private function delta_stamp($stamp_one, $stamp_two, $day = 1){

        $day_stamp = $day * $this->one_day_stamp;

        return abs($stamp_one - $stamp_two) <= $day_stamp?1:0;
    }

    /**
     * [delta_day 计算日差]
     * @param  [type]     $date [description]
     * @return [type]               [description]
     * @author ken
     * @date   2016-10-12
     */
    private function delta_day($date){

        $date_stamp = strtotime($date);

        if( time() - $date_stamp > 0 ){
            return $delta_day = ceil((time() - $date_stamp)/86400) ;
        }else{
            return 1;
        }
    }

    //录音地址
    private function getVoiceLink($path) {
        $link = '';
        if(\F::inEnv('develop')) {
            $link = '/data/uploads'.$path;
        } else {
            $link = GAOFEN_STATIC.$path;
        }

        $UA = new \UserAgent();

        $link = $link . '.mp3';

        return $link;
    }
}