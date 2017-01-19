<?php

if (!defined('IN_ANWSION'))
{
	die;
}

define('IN_MOBILE', true);


class specialist extends AWS_CONTROLLER{

	private $cache_prefix='specialist_';
	private $cache_short_time = 10;
	private $cache_normal_time = 600;
	private $cache_day_time = 86400;

	const APPLY_RECEIVE = 1; //收到回复
    const QUESTION_RECEIVE = 2; //收到提问
    const TOPIC_PUBLISH = 3; //关注专家发布了方法
    const ANSWER_LISTEN = 4; //答案被偷听
    const WITHDRAW = 5; //发起提现
    const WITHDRAW_SUCCESS = 6; //提现成功
    const LEVEL_CHANGE = 7; //等级变化
	
	function __construct() {
		parent::__construct();
		if(!empty($this->user_id) && !$this->model('openid_weixin_weixin')->get_user_info_by_uid($this->user_id)) {
			$this->model('account')->logout();
		}
	}


	public function get_access_rule()
	{
		$rule_action['rule_type'] = 'white'; //黑名单,黑名单中的检查  'white'白名单,白名单以外的检查
		$rule_action['actions'] = array(
			'do_login',	//登录页
			'wxconfig', 	//jssdk配置
			'index', 		//首页
			'order_notify', //支付异步通知
			'special_list',	//专辑列表
			'special_detail',	//专辑详细
			'topic_list',	//方法列表
			'topic_detail',	//方法详细,
			'topic_detail_list',	//方法列表
			'topic_hot',		//热门方法
			'topic_category',	//方法分类
			'hot_specialist_list',	//红人专家列表
			'new_specialist_list',	//新晋专家列表
			'topic_hot_topic_list',	//专家首页的方法列表
			'active_specialist_list', 	//最近活跃的专家列表
			'topic_category_detail_list',	//分类内容列表
			'report',
			'topic_tips',
			'question_detail',
		);
		return $rule_action;
	}

	private function get_access_token(){
		$weixin_app_id = get_setting('weixin_app_id');
		$weixin_app_secret = get_setting('weixin_app_secret');
		return $this->model('openid_weixin_weixin')->get_access_token($weixin_app_id, $weixin_app_secret);
	}

	// 获取模板消息设置
	private function get_tmp_settings($uid){
		// 获取用户信息
		$gaofen_uinfo=$this->model('gaofen_account')->get_gaofen_user_by_uid($uid);
		// 获取当前模板配置
		return $tmp_settings = $gaofen_uinfo['tmp_settings'];
	}

	/**
	 * [get_openid 获取openid]
	 * @param  [type]     $uid [description]
	 * @return [type]          [description]
	 * @author ken
	 * @date   2016-11-18
	 */
	private function get_openid($uid){
		$weixin_user_info = $user_info=$this->model('openid_weixin_weixin')->get_user_info_by_uid($uid);
		if(empty($weixin_user_info)){
			return '';
		}
		return $weixin_user_info['openid'];
	}

	/**
	 * [get_wx_userinfo 获取微信用户信息，包括subscribe(是否关注公众号)]
	 * @param  [type]     $uid [description]
	 * @return [type]          [description]
	 * @author ken
	 * @date   2016-11-18
	 */
	private function get_wx_userinfo($uid){
		$openid = $this->get_openid($uid);
		return $this->model('openid_weixin_weixin')->get_user_info_by_openid_from_weixin($openid);
	}

	public function index_action(){
		$api=[
			// 专家及用户个人页
			'user_index'	=>get_js_url('/m/specialist/user_index/'),
			// 用户编辑
			'user_edit'     =>get_js_url('/m/specialist/user_edit/'),
			// 我的消息
			'notice'		=>get_js_url('/m/specialist/notice/'),
			// 我的收听
			'my_listen'     =>get_js_url('/m/specialist/my_listen/'),
			// 我的方法列表
			'my_topic_list' =>get_js_url('/m/specialist/my_topic_list/'),
			// 方法详情
			'topic_detail'	=>get_js_url('/m/specialist/topic_detail/'),
			// 添加问题
			'add_question'	=>get_js_url('/m/specialist/add_question/'),
			// 提问支付验证
			'order_notify' =>get_js_url('/m/specialist/order_notify/'),
			// 追加问题
			'append_question'=>get_js_url('/m/specialist/append_question/'),
			// 专辑列表
			'special_list'	=>get_js_url('/m/specialist/special_list/'),
			// 专辑详情
			'special_detail' =>get_js_url('/m/specialist/special_detail/'),
			// 对应专辑的方法列表
			'topic_list'	=>get_js_url('/m/specialist/topic_list/'),
			// 关注
			'make_follow'   =>get_js_url('/m/specialist/make_follow/'),
			// 关注列表
			'follow_friends_list' =>get_js_url('/m/specialist/follow_friends_list/'),
			// 关注者列表（粉丝列表）
			'follow_fans_list' =>get_js_url('/m/specialist/follow_fans_list/'),
			// 热门方法
			'topic_hot'		=>get_js_url('/m/specialist/topic_hot/'),
			// 方法分类列表
			'topic_category' =>get_js_url('/m/specialist/topic_category/'),
			// 红人专家列表
			'hot_specialist_list' =>get_js_url('/m/specialist/hot_specialist_list/'),
			// 新晋专家列表
			'new_specialist_list' =>get_js_url('/m/specialist/new_specialist_list/'),
			// 专家首页的方法列表
			'topic_hot_topic_list' =>get_js_url('/m/specialist/topic_hot_topic_list/'),
			// 最近活跃的专家列表
			'active_specialist_list' => get_js_url('/m/specialist/active_specialist_list/'),
			// 分类内容列表
			'topic_category_detail_list' =>get_js_url('/m/specialist/topic_category_detail_list/'),
			// 获取jssdk配置
			'wxconfig'		=>get_js_url('/m/specialist/wxconfig/'),
			// 图片或音频上传
			'do_upload'		=>get_js_url('/m/specialist/do_upload/'),
			// 方法名提示
			'topic_tips'	=>get_js_url('/m/specialist/topic_tips/'),
			// 方法发布
			'topic_publish'	=>get_js_url('/m/specialist/topic_publish/'),
			// 微信登录
			'do_login'		=>get_js_url('/m/login/'),
			// 问题回复
			'answer'        =>get_js_url('/m/specialist/answer/'),
			// 问题详细
			'question_detail' =>get_js_url('/m/specialist/question_detail/'),
			// 方法详情页列表
			'topic_detail_list' =>get_js_url('/m/specialist/topic_detail_list/'),
			// 公用方法列表
			'public_topic_list' => get_js_url('/m/specialist/public_topic_list/'),
			// 公用专家列表
			'public_specialist_list' => get_js_url('/m/specialist/public_specialist_list/'),
			// 偷听录音支付
			'get_voice_link' => get_js_url('/m/specialist/get_voice_link/'),
			// 偷听录音支付验证
			'answer_order_notify' => get_js_url('/m/specialist/answer_order_notify/'),
			//专家动态
			'dynamic_list'	=> get_js_url('/m/specialist/dynamic_list/'),
			//我的消息
			'notify_list'	=> get_js_url('/m/specialist/notify_list/'),
			//提取现金
			'draw_money'	=> get_js_url('/m/specialist/draw_money/'),
			'report'		=> get_js_url('/m/specialist/report/'),
			// 模版设置
			'template_settings'	=> get_js_url('/m/specialist/template_settings/'),
			// 保存模板设置
			'save_template_settings' => get_js_url('/m/specialist/save_template_settings/'),
		];

		TPL::assign('wxconfig', json_encode($this->wxconfig()));
		TPL::assign('ajaxapi', json_encode($api));
		TPL::output('m/specialist/index');
	}

	/**
	 * [user_index_action 专家及用户个人页]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-08-22
	 */
	public function user_index_action()
	{
		// 判断用户是否已关注公众号,并每日更新subscribe
		$key = 'user_index_'.$this->user_id;
		if(!($result = AWS_APP::cache()->get($key))) {
			$result = $this->get_wx_userinfo($this->user_id);
			AWS_APP::cache()->set($key, $result, $this->cache_day_time);
			// 更新用户subcribe（关注公众号状态）
			$subscribe = $result['subscribe'];
			$this->model('gaofen_account')->update_user_gaofen_uid(['subscribe'=>$subscribe], $this->user_id);
		}

		// 获取用户信息
		$user_info=$this->model('account')->get_user_info_by_uid($this->user_id,true);

		if(empty($user_info)){
			H::ajax_json_output(AWS_APP::RSM(null, 14110, '用户不存在'));
		}

		// 获取用户收入信息
		$gaofen_uinfo=$this->model('gaofen_account')->get_gaofen_user_by_uid($this->user_id);

		$data=[
			'user_name'=>$user_info['user_name'],
			'signature'=>$user_info['signature'],
			'avatar'=>get_avatar_url($this->user_id, 'max'),
			'fans_count'=>$gaofen_uinfo['fans_count'],
			'friend_count'=>$gaofen_uinfo['friend_count'],
			'subscribe' => $gaofen_uinfo['subscribe'],
		];
		
		$income 	= $gaofen_uinfo['total_reward']-$gaofen_uinfo['freeze_reward']-$gaofen_uinfo['draw_reward'];

		$data['income'] 	= $income>=0 ? $income:0;

		// 获取认证信息(type为1是专家，2是用户)
		$verify = $this->get_verify($this->user_id);

		if(!empty($verify)){
			$data['type'] = 1;
			$data['reason'] = $verify['reason'];
		}else{
			$data['type'] = 2;
			$data['reason'] = '';
		}

		// H::p($data);exit;
		H::ajax_json_output(AWS_APP::RSM($data, 0, null));
	}

	/**
	 * [template_settings_action 模版消息推送设置]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-11-16
	 */
	public function template_settings_action(){
		// 获取用户信息
		$gaofen_uinfo=$this->model('gaofen_account')->get_gaofen_user_by_uid($this->user_id);
		// 获取当前模板配置
		$tmp_settings = $gaofen_uinfo['tmp_settings'];

		if(empty($tmp_settings)){
			// 获取默认模板配置
			$template_config = AWS_APP::config()->get('weixin_template');
			$tmp_settings = json_encode($template_config->settings);
			$data = [
				'tmp_settings' => $tmp_settings
			];
			// 保存默认模板配置
			$affect = $this->model('gaofen_account')->update_user_gaofen_uid($data, $this->user_id);
			if(!$affect){
				H::ajax_json_output(AWS_APP::RSM(null, 14001, 'error'));
			}
		}

		// H::p($tmp_settings);exit;
		H::ajax_json_output(AWS_APP::RSM(json_decode($tmp_settings), 0, null));
	}

	/**
	 * [save_template_settings_action 保存模板消息推送设置]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-11-16
	 */
	public function save_template_settings_action(){

		$fields = [
			'apply_receive' => 'apply_receive', //收到回复
		    'question_receive' => 'question_receive', //收到提问
		    'topic_publish' => 'topic_publish', //关注专家发布了方法
		    'answer_listen' => 'answer_listen', //答案被偷听
		    'withdraw' => 'withdraw', //发起提现
		    'withdraw_success' => 'withdraw_success', //提现成功
		    'level_change' => 'level_change', //等级变化
		];

		foreach($fields as $field => $flag) {
			if(isset($_POST[$flag])) {
				$save_data[$field] = (int)$_POST[$flag];
			}
		}

		foreach($fieds as $field => $flag) {
			if(empty($save_data[$field])) {
				H::ajax_json_output(AWS_APP::RSM('', 100000, '缺少参数'));
			}
		}

		$save_data = ['tmp_settings' => json_encode($save_data)];

		// 保存默认模板配置
		$affect = $this->model('gaofen_account')->update_user_gaofen_uid($save_data, $this->user_id);
		if(!$affect){
			H::ajax_json_output(AWS_APP::RSM(null, 14001, 'error'));
		}
		H::ajax_json_output(AWS_APP::RSM('success', 0, null));
	}

	/**
	 * 返回已认证会员数据
	 * @param  [type]  $uid [description]
	 * @return boolean      [description]
	 */
	private function get_verify($uid) {
		$uids = !is_array($uid) ? array($uid):$uid;
		$prefix = $this->cache_prefix.'user_index_verify_';

		$return = [];
		foreach($uids as $key=>$one) {
			$key = $prefix.$one;
			if($verify = AWS_APP::cache()->get($key)) {
				$return[$one] = $verify;
				unset($uids[$key]);
			}
		}

		if($uids) {
			$other = $this->model('verify')->fetch_apply_uids($uids);
			foreach($other as $uid=>$verify) {
				if($verify['status']==1 && $verify['type']=='personal') {
					$key = $prefix.$uid;
					AWS_APP::cache()->set($key, $verify, $this->cache_normal_time);
					$return[$uid] = $verify;
				}
			}
		}

		if(is_array($uids)) {
			return $return;
		}else{
			return isset($return[$uid]) ? $return[$uid]:[];
		}
	}


	/**
	 * [user_edit_action 用户信息编辑（暂时不做）]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-09-18
	 */
	public function user_edit_action(){

	}

	/**
	 * [dynamic_action 专家动态]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-08-22
	 */
	public function dynamic_list_action(){
		$page = max((int)$_REQUEST['page'], 1);
		$data = $this->model('specialist_dynamic')->get_dynamic_by_uid($this->user_id, $page);
		H::ajax_json_output(AWS_APP::RSM($data, 0, null));
	}

	/**
	 * 阅读动态
	 * @return [type] [description]
	 */
	public function dynamic_read_action() {
		$id = (int)$_GET['id'];
		$rs = $this->model('specialist_dynamic')->read($id);
		H::ajax_json_output(AWS_APP::RSM($data, 0, null));
	}

	/**
	 * [notice_action 我的消息]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-08-29
	 */
	public function notify_list_action(){

		$list = $this->model('specialist_notify')->list_notification($this->user_id, null, 100);

		H::ajax_json_output(AWS_APP::RSM(array_values($list), 0, null));
	}


	/**
	 * [my_listen_action 我的收听]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-09-12
	 */
	public function my_listen_action(){

		$page=max((int)$_REQUEST['page'],1);
		$limit=5;
		$offset=($page-1)*$limit;

		$list=$this->model('specialist_userListen')->list_user_listen($this->user_id,$limit,$offset);

		// H::p($list);
		H::ajax_json_output(AWS_APP::RSM($list, 0, null));
	}

	/**
	 * [my_topic_list_action 我的专题列表]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-09-20
	 */
	public function my_topic_list_action(){

		$page=max((int)$_REQUEST['page'],1);

		$order_by='add_time DESC,topic_id DESC';
		$list=$this->topic_list('specialist_uid='.$this->user_id,$page,$order_by,$limit=5);

		// H::p($list);exit;
		H::ajax_json_output(AWS_APP::RSM($list, 0, null));
	}

	/**
	 * [topic_detail_action 专题详情]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-08-22
	 */
	public function topic_detail_action(){

		if($_REQUEST['tid']){
			$topic_id=(int)$_REQUEST['tid'];
		}else{
			H::ajax_json_output(AWS_APP::RSM(null, 14110, '方法不存在或已被删除'));
		}
		
		// topic数据
		$topic = AWS_APP::cache()->get($this->cache_prefix.'topic_detail_topic_'.$topic_id);
		// 缓存
		if(!$topic){
			$topic_where	= "topic_id = '{$topic_id}'";
			$topic=$this->model('specialist_topic')->get_topic($topic_where);
			AWS_APP::cache()->set($this->cache_prefix.'topic_detail_topic_'.$topic_id,$topic,$this->cache_short_time);
		}
		
		// 免费到期时间
		if(($topic['add_time']+259200)>time()){
			$free_time=['free_time'=>$this->free_time($topic['add_time'])];
		}else{
			$free_time=['free_time'=>0];
		}
		
		// 获取专家信息
		$user_info = AWS_APP::cache()->get($this->cache_prefix.'topic_detail_user_info_'.$topic_id);
		//缓存
		if(!$user_info){
			$specialist_uid=$topic['specialist_uid'];
			$user_info=$this->model('account')->get_user_info_by_uid($specialist_uid,true);
			AWS_APP::cache()->set($this->cache_prefix.'topic_detail_user_info_'.$topic_id,$user_info,$this->cache_short_time);
		}

		$specialist_info=[
			'specialist_name'=>$user_info['user_name'],
			'avatar_file'=>get_avatar_url($user_info['uid'], 'max'),
			// 'avatar_file'=>get_js_url('/uploads/avatar/').$user_info['avatar_file'],
			'specialist_signature'=>$user_info['signature'],
		];

		// 获取认证信息
		$verify=$this->get_verify($user_info['uid']);
		$verify_info=[
			'reason'=>$verify['reason']
		];

		// 剩余免费问题数量
		if($free_time['stamp']>time()){
			$free_question=['free_question'=>0];
		}else{
			$free_question=['free_question'=>$topic['free_question']];
		}

		// 统计专题数
		$where="specialist_uid='{$topic['specialist_uid']}'";
		$gaofen_user_info=$this->model('gaofen_account')->get_gaofen_user_by_uid($topic['specialist_uid']);
		$count_topic_list_data['topic_num']?$count_topic_list_data['topic_num']=$gaofen_user_info['topic_num']:$count_topic_list_data['topic_num']=0;
		
		// 用户提问接口
		$question_url['add_question_url']=get_js_url('/m/specialist/add_question/');

		// 专题输出数据
		$topic_data=array_merge($topic,$free_time,$specialist_info,$free_question,$verify_info,$count_topic_list_data,$question_url);

		// 统计当前topic的question数
		$question_count_where="(topic_id = '{$topic_id}' AND is_free=0 OR topic_id = '{$topic_id}' AND order_id>0) AND is_open = 1";
		$question_count=$this->model('specialist_question')->count_question($question_count_where);
		$topic_data['question_num'] = $question_count;

		// 查询是否关注了
		$topic_data['fans_type']=0; //未关注
		if($this->user_id) {
			$friend_info=$this->model('follow')->user_follow_check($this->user_id, $user_info['uid']);
			if($friend_info){
				$topic_data['fans_type']=1; //已关注
			}

			// 查询是否有收听过
			$listen_info=$this->model('specialist_userListen')->get_user_listen($this->user_id,1,$topic_data['topic_id']);
			// 储存'我的收听'数据
			if(empty($listen_info)){
				$listen_data=[
					'topic_id' => $topic_data['topic_id'],
			        'specialist_uid' => $topic_data['specialist_uid']
			    ];
			    $listen_id=$this->model('specialist_userListen')->insert_user_listen($this->user_id,1,$topic_data['topic_id'],$listen_data);
				if(!$listen_id){
					H::ajax_json_output(AWS_APP::RSM(null, 14111, '参数有误'));
				}
			}
		}

		$output_data=[
			'topic_data'=>$topic_data
		];

		// H::p($output_data);exit;
		H::ajax_json_output(AWS_APP::RSM($output_data,0,null));
	}
	
	/**
	 * [topic_detail_list_action 方法详情列表]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-09-02
	 */
	public function topic_detail_list_action(){

		if(!is_numeric($_REQUEST['tid'] && !empty($_REQUEST['tid']))){
			$topic_id=(int)$_REQUEST['tid'];
		}else{
			H::ajax_json_output(AWS_APP::RSM(null, 14110, '方法不存在或已被删除'));
		}

		$type = (isset($_REQUEST['type'])&&($_REQUEST['type']>1)) ? $_REQUEST['type']:1;

		$page=max((int)$_REQUEST['page'],1);

		// topic数据
		$topic_where	= "topic_id = '{$topic_id}'";
		$topic=$this->model('specialist_topic')->get_topic($topic_where);

		if($type==1){
			//问题列表数据
			$list_data=$this->topic_detail_question_list($topic['specialist_uid'],$topic_id,$page);
		}else if($type==2){
			//专题列表数据
			$list_data=$this->topic_list("specialist_uid='{$topic['specialist_uid']}' AND is_show=1", $page, 'add_time DESC,topic_id DESC',5);
		}else{
			H::ajax_json_output(AWS_APP::RSM(null, 14111, '参数有误'));
		}

		// H::p($list_data);exit;
		H::ajax_json_output(AWS_APP::RSM($list_data,0,null));
	}

	/**
	 * [topic_detail_question_list 专题详情问题与回答列表]
	 * @param  [type]     $specialist_uid [专家uid]
	 * @param  [type]     $uid            [用户uid]
	 * @param  [type]     $topic_id       [专题id]
	 * @param  [type]     $q_page         [页码]
	 * @return [type]                     [description]
	 * @author ken
	 * @date   2016-09-02
	 */
	public function topic_detail_question_list($specialist_uid,$topic_id,$q_page){
		// 提问和回答列表数据输出(免费或免费但已经支付的问题列表数据)

		$question_where="aws_specialist_question.topic_id='{$topic_id}' AND ((is_free=1 AND aws_specialist_order.order_type>0) OR is_free=0) AND is_open=1 AND is_timeout=0";

		$question_order_by='aws_specialist_question.question_id DESC';
		$question_limit=5;
		$question_offset=($q_page-1)*$question_limit;
		$question_answer_data=$this->model('specialist_question')->select_question_answer($question_where,$question_limit,$question_offset,$question_order_by);

		foreach ($question_answer_data as $key => $value) {
			if ($value['answer_id']) {
				$answer_ids[]=$value['answer_id'];
			}
		}

		// 返回当前用户已支付过的answer_uids
		if(!empty($answer_ids)){
			$answer_info=$this->model('specialist_answer')->select_answer_order_ids($answer_ids,$this->user_id);
			
			// H::p($answer_info);

			foreach ($question_answer_data as $key => $value) {
				foreach ($answer_info as $k => $v) {
					if($value['answer_id']==$k){
						$question_answer_data[$key]['answer_order_id']=$k;
					}
				}
			}
		}

		// 专家信息
		$specialist_info=$this->model('account')->get_user_info_by_uid($specialist_uid,true);
		$specialist_info=[
			'specialist_name'=>$specialist_info['user_name'],
			'specialist_avatar_file'=>get_avatar_url($specialist_uid, 'max')
			// 'specialist_avatar_file'=>get_setting('upload_url').'/avatar/'.$specialist_info['avatar_file']
		];

		// return $question_answer_data;exit;

		foreach ($question_answer_data as $key => $value) {
			// 添加专家信息
			$question_answer_data[$key]['specialist']=$specialist_info;
			$question_answer_data[$key]['avatar_file']=get_avatar_url($question_answer_data[$key]['uid'], 'max');

			// 判断是否提问者、回答已支付者和专家本人，回答录音显示是否需要收费
			if( $value['uid']==$this->user_id || isset($value['answer_order_id']) || $value['specialist_uid']==$this->user_id ){
				$question_answer_data[$key]['belong']=1;
				$question_answer_data[$key]['answer_url']='';
			}else{
				$question_answer_data[$key]['belong']=0;
				$question_answer_data[$key]['answer_url']='';
			}
		}

		return $question_answer_data;
	}

	/**
	 * [topic_list 专题列表]
	 * @param  [type]     $where [条件]
	 * @param  [type]     $t_page         [页码]
	 * @return [type]                     [description]
	 * @author ken
	 * @date   2016-09-01
	 */
	public function topic_list($where,$t_page,$order_by,$limit){
		// 对应的专题列表数据输出
		$topic_field=['topic_id','topic_name','topic_cover_url','topic_voice_url','add_time','update_time','specialist_uid','question_num'];
		$topic_where=$where;
		$topic_order_by=$order_by;
		$topic_limit=$limit;
		$topic_offset=($t_page-1)*$topic_limit;
		$topic_list_data=$this->model('specialist_topic')->select_topic($topic_field,$topic_where,$topic_order_by,$topic_limit,$topic_offset);

		return $topic_list_data;
	}

	/**
	 * [add_question_action 提问]
	 * @author ken
	 * @date   2016-08-25
	 */
	public function add_question_action(){
		// 检查是否带有open参数
		if($_POST['tid']<1 && !$_POST['question']){
			H::ajax_json_output(AWS_APP::RSM(null, 10044, '参数缺失'));
		}

		$topic_id 	= (int)$_POST['tid'];

		// topic数据
		$topic_where="topic_id = '{$topic_id}'";
		$topic=$this->model('specialist_topic')->get_topic($topic_where);
		//免费到期时间
		$free_time=array('free_time'=>$this->free_time($topic['add_time']));
		
		// 判断是否在免费期限,是否还有免费提问
		if($free_time['free_time']>0 && $topic['free_question']>0){
			// 添加问题
			$data=[
				'question_name'=>$_POST['question'],
				'uid'=>$this->user_id,
				'topic_id'=>$topic_id,
				'add_time'=>time(),
				'specialist_uid'=>$topic['specialist_uid'],
				'fee' =>0,
				'is_open'=>(int)$_POST['is_open']?(int)$_POST['is_open']:0
			];
			$question_id=$this->model('specialist_question')->add_question($data);

			// 统计当前topic的question数
			$question_count_where="topic_id = '{$topic_id}' AND is_free=0 OR topic_id = '{$topic_id}' AND order_id>0";
			$question_count=$this->model('specialist_question')->count_question($question_count_where);
			// 更新specialist_topic问题总数、更新剩余免费问题
			$topic_update_data=[
				'question_num'=>$question_count,
				'free_question'=>(int)($topic['free_question']-1),
			];

			$affect=$this->model('specialist_topic')->update_topic($topic_update_data,$topic_where);

			if($affect){
				$notify = $this->model('specialist_notify');
				$rs = $notify->send($this->user_id, $topic['specialist_uid'], $notify::TYPE_SPECIALIST_QUESTION, $notify::CATEGORY_SPECIALIST, $question_id, ['question_id'=>$question_id]);

				// 储存及推送模板消息
				$gaofen_user = $this->model('gaofen_account')->get_gaofen_user_by_uid($topic['specialist_uid']);
				$template_setttings = json_decode($gaofen_user['tmp_settings']);
				if($template_setttings->question_receive){
					$user_info=$this->model('account')->get_user_info_by_uid($this->user_id);
					$openid = $this->get_openid($topic['specialist_uid']);
					$data = [
						'first' => '收到新的提问',
						'keyword1' => "用户 '".$user_info['user_name']."' 向你提问，请在48小时内回复",
						'keyword2' => '来自方法《'.$topic['topic_name'].'》',
						'remark' => '点击查看',
						'url' => get_js_url('/m/specialist/#!/home?tab=2'),
					];
					$save_data = [
						'uid' => $topic['specialist_uid'],
						'message' => json_encode($data),
						'message_type' => self::QUESTION_RECEIVE,
						'add_time' => time(),
					];
					$this->model('specialist_template')->add_template($save_data);

					$this->model('openid_weixin_weixin')->temp_send($openid, $access_token = $this->get_access_token(), $data, $tmp_type = 'common');
				}

				H::ajax_json_output(AWS_APP::RSM('success',0,null));
			}else{
				H::ajax_json_output(AWS_APP::RSM(null, 10046, '发表失败'));
			}
		}
		else{
			// 添加提问
			$question_data=[
				'question_name'=>$_POST['question'],
				'uid'=>$this->user_id,
				'topic_id'=>$topic_id,
				'add_time'=>time(),
				'specialist_uid'=>$topic['specialist_uid'],
				'fee' =>$topic['question_fee'],
				'is_free'=>1,
				'is_open'=>$_POST['is_open']
			];
			$question_id=$this->model('specialist_question')->add_question($question_data);
			if(!$question_id){
				H::ajax_json_output(AWS_APP::RSM(null, 10046, '提交失败'));exit;
			}

			// 创建本地订单
			$local_order_data=[
				'uid'=>$this->user_id,
				'question_id'=>$question_id,
				'price'=>$topic['question_fee'],
				'order_type'=>0,
				'refund_type'=>0,
				'add_time'=>time(),
				'update_time'=>time(),
			];
			$local_order_id=$this->model('specialist_order')->add_order($local_order_data);
			if(!$local_order_data){
				H::ajax_json_output(AWS_APP::RSM(null, 10047, '提交失败'));exit;
			}

			// 创建远程订单
            $fee=$topic['question_fee'];
            $amount=1;
            $total_fee=$fee*$amount;
			$order_data=[
				'out_trade_no'=>$local_order_id,
				'pid'=>$this->user_id,
				'fee'=>$fee,
				'amount'=>$amount,
				'total_fee'=>AWS_APP::config()->get('gaofen')->env=='product'?$total_fee:0.01,
				'attach'	=> ['specialist_uid'=>$topic['specialist_uid'], 'question_id'=>$question_id],
			];
			// H::p($order_data);exit;
			$order_id=$this->model('gaofen_order')->create($order_data);
			if(!$order_id['order_num']){
				H::ajax_json_output(AWS_APP::RSM(null, 10048, '提交失败'));exit;
			}

			// 更新支付订单id到本地订单
			$local_order_where="order_id='{$local_order_id}'";
			$local_order_affect=$this->model('specialist_order')->update_order(['order_num'=>$order_id['order_num']],$local_order_where);
			if(!$local_order_affect){
				H::ajax_json_output(AWS_APP::RSM(null, 10049, '提交失败'));exit;
			}

			// 支付跳转
			$callback='';//get_js_url("/m/specialist/topic_detail/?tid=$topic_id");
			$notify_url=get_js_url('/m/specialist/order_notify/');
			$redirect_url=$this->model('gaofen_order')->get_pay_link($order_id['order_num'], $callback, $notify_url);
			H::ajax_json_output(AWS_APP::RSM(['pay_link'=>get_js_url($redirect_url)], -100, null));exit;
		}
	}

	/**
	 * [order_notify_action 支付处理]
	 * @return [type]     [description]
	 * @date   2016-08-31
	 */
	public function order_notify_action() {
		$xml = file_get_contents('php://input'); 
		$rs = $this->model('gaofen_order')->notify_check($xml);

		if($rs) {

			// 查询当前order信息
			$local_order_info = $this->model('specialist_order')->get_order("order_id='{$rs['out_trade_no']}'");

			if(!empty($local_order_info['order_type'])) {
				write_log('pay_error:'.$local_order_info['id'].' 订单已经支付过！');
				exit;
			}

			// 更新本地order表
			$data=[
				'order_type'=>1,
				'update_time'=>time()
			];
			$affect=$this->model('specialist_order')->update_order($data,"order_id='{$rs['out_trade_no']}'");
			if(!$affect){
				write_log('订单更新失败:'.$xml, 'order');
			}

			$notify = $this->model('specialist_notify');
			

			// 偷听处理
			if($local_order_info['answer_id']) {
				// 对应的question信息
				$question_info=$this->model('specialist_question')->get_question("answer_id='{$local_order_info['answer_id']}'");

				$rs = $notify->send($rs['attach']['specialist_uid'], $rs['pid'], $notify::TYPE_SPECIALIST_ANSWER, $notify::CATEGORY_SPECIALIST, $rs['attach']['answer_id'], ['answer_id'=>$rs['attach']['answer_id']]);

				// 查询是否有收听过
				$listen_info=$this->model('specialist_userListen')->get_user_listen($local_order_info['uid'],2,$local_order_info['answer_id']);
				// 储存'我的收听'数据
				if (empty($listen_info)) {
					$listen_data=[
						'answer_id' => $local_order_info['answer_id'],
				        'question_id' => $question_info['question_id'],
				        'question_uid' => $question_info['uid'],
				        'specialist_uid' => $question_info['specialist_uid'],
				    ];

				    //分配支付金额提成
				    $prorate = $this->model('specialist_prorate')->compute_prorate_by_order_id_for_tap($local_order_info['order_id']);
				    if($prorate) {//记录日志，方便提现时核对
				    	//普通用户
				    	if(!empty($prorate['questioner_prize'])) {
				    		$this->model('gaofen_reward')->reward_money($prorate['question_uid'], $prorate['questioner_prize'], ['type'=>$prorate['type'], 'order_id'=>$prorate['order_id']]);
				    	}

				    	//专家
				    	if(!empty($prorate['specialist_prize'])) {
				    		$this->model('gaofen_reward')->reward_money($prorate['specialist_uid'], $prorate['specialist_prize'], ['type'=>$prorate['type'], 'order_id'=>$prorate['order_id'], 'payer_uid'=>$local_order_info['uid']]);
				    	}
				    }

				    $listen_id=$this->model('specialist_userListen')->insert_user_listen($local_order_info['uid'],2,$local_order_info['answer_id'],$listen_data);
				}

				// 储存及推送模板消息
				$gaofen_user = $this->model('gaofen_account')->get_gaofen_user_by_uid($question_info['uid']);
				$template_setttings = json_decode($gaofen_user['tmp_settings']);
				if($template_setttings->answer_listen){
					$user_info=$this->model('account')->get_user_info_by_uid($local_order_info['uid']);
					$openid = $this->get_openid($question_info['uid']);
					$data = [
						'first' => '答案被人偷偷听了',
						'keyword1' => "用户 '".$user_info['user_name']."' 偷偷听了你的答案，获得分成0.4元",
						'keyword2' => '来自提问《'.$question_info['question_name'].'》',
						'remark' => '点击查看',
						'url' => get_js_url('/m/specialist/#!/home?tab=2'),
					];
					$save_data = [
						'uid' => $question_info['uid'],
						'message' => json_encode($data),
						'message_type' => self::ANSWER_LISTEN,
						'add_time' => time(),
					];
					$this->model('specialist_template')->add_template($save_data);

					// 每日限发一次被偷听模板消息
					$key = 'answer_listen_template_'.$this->user_id;
					if(!($result = AWS_APP::cache()->get($key))) {
						$result = $this->model('openid_weixin_weixin')->temp_send($openid, $access_token = $this->get_access_token(), $data, $tmp_type = 'common');
						AWS_APP::cache()->set($key, $result, $cache_day_time);						
					}
				}

			}else{
				// 查询当前订单对应的question信息
				$question_info = $this->model('specialist_question')->get_question('question_id='.$local_order_info['question_id']);				

				// 更新question表对应的order_id号
				$data = ['order_id'=>$rs['out_trade_no']];
				$where = "question_id='{$local_order_info['question_id']}'";
				$affect = $this->model('specialist_question')->update_question($data,$where);
				if(!$affect){
					write_log('提问支付成功后定单号更新失败:'.var_export($data, true), 'order');
				}

				/* 
					金额分配放到回复接口

				if(!empty($question_info)) {
					//分配支付金额提成
					$prorate = $this->model('specialist_prorate')->compute_prorate_by_order_id_for_question($local_order_info['order_id']);
					if($prorate) {//记录日志，方便提现时核对
				    	//普通用户
				    	if(!empty($prorate['questioner_prize'])) {
				    		$this->model('gaofen_reward')->reward_money($prorate['question_uid'], $prorate['questioner_prize'], ['type'=>$prorate['type'], 'order_id'=>$prorate['order_id']]);
				    	}

				    	//专家
				    	if(!empty($prorate['specialist_prize'])) {
				    		$this->model('gaofen_reward')->reward_money($prorate['specialist_uid'], $prorate['specialist_prize'], ['type'=>$prorate['type'], 'order_id'=>$prorate['order_id']]);
				    	}
				    }
				}else{
					write_log('订单金额分配失败：'.$xml);
				}*/

				// topic表的问题总数+1
				$affect=$this->model('specialist_topic')->update_topic_question("topic_id='{$question_info['topic_id']}'");
				if(!$affect){
					write_log('方法提问数+1失败:'.var_export($question_info, true), 'order');
				}

				$rs = $notify->send($rs['pid'], $rs['attach']['specialist_uid'], $notify::TYPE_SPECIALIST_QUESTION, $notify::CATEGORY_SPECIALIST, $rs['attach']['question_id'], ['question_id'=>$rs['attach']['question_id']]);
			
				// 储存及推送模板消息
				$gaofen_user = $this->model('gaofen_account')->get_gaofen_user_by_uid($question_info['specialist_uid']);
				$template_setttings = json_decode($gaofen_user['tmp_settings']);
				if($template_setttings->question_receive){
					$user_info=$this->model('account')->get_user_info_by_uid($question_info['uid']);
					$topic_id = $question_info['topic_id'];
					$topic = $this->model('specialist_topic')->get_topic("topic_id = $topic_id");
					$openid = $this->get_openid($question_info['specialist_uid']);
					$data = [
						'first' => '收到新的提问',
						'keyword1' => "用户 '".$user_info['user_name']."' 支付".$topic['question_fee']."元向你提问，请在48小时内回复",
						'keyword2' => '来自方法《'.$topic['topic_name'].'》',
						'remark' => '点击收听',
						'url' => get_js_url('/m/specialist/#!/home?tab=2'),
					];
					$save_data = [
						'uid' => $question_info['specialist_uid'],
						'message' => json_encode($data),
						'message_type' => self::QUESTION_RECEIVE,
						'add_time' => time(),
					];
					$this->model('specialist_template')->add_template($save_data);
					$this->model('openid_weixin_weixin')->temp_send($openid, $access_token = $this->get_access_token(), $data, $tmp_type = 'common');
				}
			}

			// 专家所得费用
			echo 'finish!';
		}else{
			write_log('支付回调验证失败：'.$xml, 'order');
			echo 'failure!';
		}
	}

	/**
	 * [append_question_action 追问问题(暂时不要求做)]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-08-25
	 */
	public function append_question_action(){

		$question_name	= $_POST['question_name'];
		$topic_id 		= (int)$_POST['topic_id'];
		$specialist_uid = (int)$_POST['specialist_uid'];
		$pid 			= (int)$_POST['qid'];

		if(!($question_name && $topic_id && $specialist_uid && $pid)){
			H::ajax_json_output(AWS_APP::RSM(null, 14110, '参数错误'));
		}

		$data=[
			'question_name'=>$question_name,
			'uid'=>$this->user_id,
			'topic_id'=>$topic_id,
			'specialist_uid'=>$specialist_uid,
			'add_time'=>time(),
			'parent_id'=>$pid,
			'is_open'=>0,
		];

		$question_id=$this->model('specialist_question')->add_question($data);
		if($question_id){
			H::ajax_json_output(AWS_APP::RSM('提交成功', 0, null));
		}else{
			H::ajax_json_output(AWS_APP::RSM(null, 14110, '提交失败'));
		}
	}

	/**
	 * [special_list_action 专辑列表]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-08-24
	 */
	public function special_list_action(){

		$page=max((int)$_REQUEST['page'],1);

		$order_special='sort DESC,update_time DESC';
		$limit_special=5;
		$offset_special=($page-1)*$limit_special;

		$where = 'is_show = 1';

		$special_list=$this->model('specialist_special')->select_special($where, $field= null, $order_special, $limit_special, $offset_special);

		// $special_list = AWS_APP::cache()->get($this->cache_prefix.'special_list');

		// if(!$special_list){
		// 	$special_list=$this->model('specialist_special')->select_special($where = null, $field= null, $order_special, $limit_special, $offset_special);
		// 	AWS_APP::cache()->set($this->cache_prefix.'special_list',$special_list,$this->cache_short_time);
		// }

		// H::p($special_list);exit;
		H::ajax_json_output(AWS_APP::RSM($special_list, 0, null));
	}

	/**
	 * [special_detail 专辑详情]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-09-12
	 */
	public function special_detail_action(){

		if($_REQUEST['sid']){
			$sid=(int)$_REQUEST['sid'];
		}else{
			H::ajax_json_output(AWS_APP::RSM(null, 14410, '缺少参数'));
		}

		$where="id ='{$sid}'";

		$special_detail = AWS_APP::cache()->get($this->cache_prefix.'_special_detail_'.$sid);

		//缓存
		if(!$special_detail){
			$special_detail=$this->model('specialist_special')->get_special($where);
			AWS_APP::cache()->set($this->cache_prefix.'_special_detail_'.$sid,$special_detail,$this->cache_short_time);
		}

		// H::p($special_detail);exit;
		H::ajax_json_output(AWS_APP::RSM($special_detail, 0, null));
	}

	/**
	 * [topic_list_action 对应专辑的专题列表]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-08-24
	 */
	public function topic_list_action(){

		if($_REQUEST['sid']){
			$special_id=(int)$_REQUEST['sid'];
		}else{
			H::ajax_json_output(AWS_APP::RSM(null, 14410, '缺少参数'));
		}

		// 当order为1时，按收听数的多少来排序，否则按发布时间排序
		($_POST['order'] && $_POST['order']==1)?$order_by='listen_num DESC':$order_by='update_time DESC';

		$page 	= max((int)$_POST['page'], 1);

		// 专题列表
		$where_topic="special_id='{$special_id}'";
		$limit_topic=5;
		$offset_topic=($page-1)*$limit_topic;

		$topic_list=$this->model('specialist_special')->select_special_topic($where_topic,$limit_topic,$offset_topic,$order_by);

		$special_info=$this->model('specialist_special')->get_special("id='{$special_id}'");

		foreach ($topic_list as $key => $value) {
			$topic_list[$key]['topic_count']=$special_info['topic_num'];
		}

		// H::p($topic_list);exit;
		H::ajax_json_output(AWS_APP::RSM($topic_list, 0, null));
	}

	/**
	 * [public_topic_list_action 公用专题列表]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-09-11
	 */
	public function public_topic_list_action($limit,$offset=0,$order_by='update_time DESC'){

		$t_page=max((int)$_REQUEST['page'],1);

		$where = "is_show = 1";

		if(!$limit){
			$limit=5;
			$offset=($t_page-1)*$limit;
		}
		
		$topic_list=$this->model('specialist_topic')->select_topic_with_specialist($limit,$offset,$order_by,$where);
		// H::p($topic_list);exit;
		H::ajax_json_output(AWS_APP::RSM($topic_list, 0, null));
	}

	/**
	 * [public_specialist_list_action 公用专家列表]
	 * @param  integer    $limit    [description]
	 * @param  integer    $offset   [description]
	 * @param  string     $order_by [description]
	 * @return [type]               [description]
	 * @author ken
	 * @date   2016-09-12
	 */
	public function public_specialist_list_action($limit,$offset=0,$order_by='aws_specialist_topic.update_time DESC'){
		
		$t_page=max((int)$_REQUEST['page'],1);

		if(!$limit){
			$limit=5;
			$offset=($t_page-1)*$limit;
		}

		$specialist_list=$this->model('specialist_topic')->select_topic_specialist($limit,$offset,$order_by);
		foreach ($specialist_list as $key => $value) {
			$specialist_list[$key]['avatar_file']=get_avatar_url($specialist_list[$key]['specialist_uid'], 'max');;
		}
		// H::p($specialist_list);exit;
		H::ajax_json_output(AWS_APP::RSM($specialist_list, 0, null));
	}

	/**
	 * [active_specialist_list_action 最近活跃的专家列表]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-09-12
	 */
	public function active_specialist_list_action(){

		$t_page=max((int)$_REQUEST['page'],1);

		$limit=5;
		$offset=($t_page-1)*$limit;

		$this->public_specialist_list_action($limit,$offset,$order_by='aws_specialist_topic.update_time DESC');
	}

	/**
	 * [topic_hot_action 热门专题]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-08-24
	 */
	public function topic_hot_action(){
		// 专家或专题名称
		// $name=$_GET['name'];
		
		//获取专题分类 
		$topic_category=$this->topic_category_action();

		// // 是否通过搜索查询
		// if($name){
		// 	$topic_where="topic_name like '%{$name}%' OR user_name like '%{$name}%'";
		// 	$topic_list=$this->model('specialist_topic')->select_topic_user_other($topic_where);
		// }else{
		// 	// 获取专题数据
		// 	$topic_order_by='listen_num DESC';
		// 	$topic_limit=5;
		// 	$topic_list=$this->model('specialist_topic')->select_topic(null, $where=null, $topic_order_by, $topic_limit);
		// }

		// foreach ($topic_list as $key => $value) {
		// 	foreach ($value as $k => $val) {
		// 		if($k=='add_time'){
		// 			$topic_list[$key]['add_date']=$this->get_time(date('Y-m-d H:i:s',$val),date('Y-m-d H:i:s',time()));
		// 		}
		// 	}
		// }

		// $data=[
		// 	'topic_category'=>$topic_category, //专题分类
		// 	'topic_list'=>$topic_list //专题列表
		// ];
		
		// H::p($topic_category);exit;
		// H::ajax_json_output(AWS_APP::RSM($topic_category, 0, null));
	}

	/**
	 * [topic_category_action 专题分类]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-09-12
	 */
	public function topic_category_action(){
		//获取专题分类 
		$topic_category=$this->model('specialist_topicCategory')->select_category();

		// H::p($topic_category);exit;
		H::ajax_json_output(AWS_APP::RSM($topic_category, 0, null));
	}

	/**
	 * [hot_specialist_list_action 红人榜列表]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-09-02
	 */
	public function hot_specialist_list_action(){

		$page=max((int)$_REQUEST['page'],1);
		$limit=5;
		$offset=($page-1)*$limit;		

		// 红人榜（发方法最多的专家）
		$hot_specialist_list=$this->model('specialist_topic')->select_topic_user_another($limit,$offset);
		// H::p($hot_specialist_list);exit;
		foreach ($hot_specialist_list as $key => $value) {
			$data[$key]['user_name'] = $value['user_name'];
            $data[$key]['signature'] = $value['signature'];
            $data[$key]['introduction'] = $value['introduction'];
            $data[$key]['specialist_uid'] = $value['specialist_uid'];
            $data[$key]['fans_count'] = $value['fans_count'];
            $data[$key]['friend_count'] = $value['friend_count'];
            $data[$key]['topic_num'] = $value['topic_num'];
            $data[$key]['topic_id'] = $value['topic_id'];
            $data[$key]['avatar_file'] = get_avatar_url($value['specialist_uid'], 'max');
		}

		if(!empty($hot_specialist_list)){
			// H::p($data);exit;
			H::ajax_json_output(AWS_APP::RSM($data, 0, null));
		}else{
			H::ajax_json_output(AWS_APP::RSM([], 0, null));
		}
	}

	/**
	 * [new_specialist_list_action 新晋榜列表]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-09-02
	 */
	public function new_specialist_list_action(){

		$page=max((int)$_REQUEST['page'],1);
		$limit=5;
		$offset=($page-1)*$limit;	

		// 新晋榜（最近加入切发布过方法的专家）
		$group_by='add_time DESC';
		$new_specialist_list = $this->model('specialist_topic')->select_topic_user_another($limit,$offset,$group_by);

		foreach ($new_specialist_list as $key => $value) {
			$data[$key]['avatar_file']=get_avatar_url($value['specialist_uid'], 'max');
			$data[$key]['uid']=$value['specialist_uid'];
			$data[$key]['user_name']=$value['user_name'];
			$data[$key]['signature']=$value['signature'];
			$data[$key]['introduction']=$value['introduction'];
		}

		// H::p($data);exit;
		H::ajax_json_output(AWS_APP::RSM($data, 0, null));
	}

	/**
	 * [topic_hot_topic_list 热门专题列表]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-09-02
	 */
	public function topic_hot_topic_list_action(){

		$page=max((int)$_REQUEST['page'],1);
		$limit=5;
		$offset=($page-1)*$limit;

		return $this->public_topic_list_action($limit,$offset,$order_by='add_time DESC');
	}

	/**
	 * [topic_category_detail_list 分类内容列表]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-09-12
	 */
	public function topic_category_detail_list_action(){
		if($_REQUEST['id']){
			$category_id=$_REQUEST['id'];
		}else{
			H::ajax_json_output(AWS_APP::RSM(null, 14410, '缺少参数'));
		}

		if($_REQUEST['type']){
			$type=$_REQUEST['type'];
		}else{
			$type=0;
		}

		$page=max((int)$_REQUEST['page'],1);
		$limit=5;
		$offset=($page-1)*$limit;

		$where="FIND_IN_SET('$category_id', topic_category_id)";
		if($type==1){
			// 选中分类的专家列表
			$list=$this->model('specialist_topic')->select_topic_specialist($limit,$offset,$order_by='aws_specialist_topic.update_time DESC',$where);
			foreach ($list as $key => $value) {
				$list[$key]['avatar_file']=get_avatar_url($list[$key]['specialist_uid'], 'max');;
			}
		}else{
			$where .= ' AND aws_specialist_topic.is_show = 1';
			// 选中分类的方法列表
			$list=$this->model('specialist_topic')->select_topic_with_specialist($limit,$offset,$order_by='update_time DESC',$where);
		}

		// H::p($list);exit;
		H::ajax_json_output(AWS_APP::RSM($list, 0, null));
	}

	/**
	 * 获取jssdk配置
	 * @return [type] [description]
	 */
	private function wxconfig($url=''){
		if(!$url){
			$url = ($_SERVER['HTTPS'] AND !in_array(strtolower($_SERVER['HTTPS']), array('off', 'no'))) ? 'https' : 'http';
			$url .= '://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
		}

		$data=$this->model('gaofen_weixin')->request('WeixinPub/getWXConfig', ['url'=>$url]);

		return $data;
	}

	/**
	 * ajax wxconfig
	 * @return [type] [description]
	 */
	public function wxconfig_action() {
		$url = $_REQUEST['url'];
		H::ajax_json_output(AWS_APP::RSM($this->wxconfig($url), 0, null));
	}

	/**
	 * [topic_tips_action 方法发布提示]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-10-24
	 */
	public function topic_tips_action(){

		$page=max((int)$_REQUEST['page'],1);
		$limit=5;
		$offset=($page-1)*$limit;

		$where = 'tips_type = 0';

		$list=$this->model('specialist_topicTips')->select_tips(null, $where, null, $limit, $offset);
		
		shuffle($list);
		// H::p($list);exit;
		H::ajax_json_output(AWS_APP::RSM($list, 0, null));
	}

	/**
	 * [topic_publish_action 专题（方法）发布]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-08-22
	 */
	public function topic_publish_action(){
		
		if(empty($this->get_verify($this->user_id))) {
			H::ajax_json_output(AWS_APP::RSM('', 100000, '缺少权限'));
		}

		$save_data = [];

		$fields = [
			'topic_name'		=>'title', 
			'topic_description'	=>'desc', 
			'topic_cover_url'	=>'faceimg', 
			'topic_voice_url'	=>'voice', 
			'question_fee'		=>'realMoney',
			'record_time'		=>'record_time',
		];

		foreach($fields as $field=>$flag) {
			if(isset($_POST[$flag])) {
				$save_data[$field] = $_POST[$flag];
			}
		}

		foreach($fieds as $field=>$flag) {
			if(empty($save_data[$field])) {
				H::ajax_json_output(AWS_APP::RSM('', 100000, '缺少参数'));
			}
		}

		if($_POST['category_id']){
			$save_data['topic_category_id'] = $_POST['category_id'];
		}else{
			H::ajax_json_output(AWS_APP::RSM('', 100001, '分类不能为空'));
		}

		$save_data['specialist_uid'] = $this->user_id;
		$save_data['add_time']		= TIMESTAMP;
		$save_data['update_time']	= TIMESTAMP;

		if(empty($save_data['record_time'])) {
			$audio_path = get_setting('upload_dir').$save_data['topic_voice_url'];
			$save_data['record_time'] = $this->model('specialist_audio')->getDuration($audio_path);
		}
		
		$topic_id=$this->model('specialist_topic')->add_topic($save_data);

		// 添加动态
		
		if($topic_id){
			//添加发布方法的动态
			$this->model('specialist_dynamic')->add_topic_dynamic($topic_id);

			//增加用户的方法总数
			$this->model('gaofen_account')->incr_topic_num($this->user_id);
			H::ajax_json_output(AWS_APP::RSM(['topic_id'=>$topic_id], 0, null));
		}else{
			H::ajax_json_output(AWS_APP::RSM('', 10000, '发布失败'));
		}
	}

	/**
	 * [total_income_action 总收入]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-08-29
	 */
	public function total_income_action(){

	}

	/**
	 * [question_detail_action 问题详细]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-09-21
	 */
	public function question_detail_action(){

		if($_REQUEST['qid']){
			$question_id=$_REQUEST['qid'];
		}else{
			H::ajax_json_output(AWS_APP::RSM(null, 14410, '缺少参数'));
		}
		
		$info=$this->model('specialist_question')->get_question_answer("aws_specialist_question.question_id='{$question_id}'");
		
		if($info['answer_id']){
			$answer=$this->model('specialist_answer')->get_answer_specialist('answer_id='.$info['answer_id']);
		    $info['specialist_uid'] = $answer['specialist_uid'];
		    // $info['user_name'] = $answer['user_name'];
		    $info['specialist_avatar_file'] = $answer['specialist_avatar_file'];

		    // 查询专家信息
			$specialist_uid=$info['specialist_uid'];
			$user_info=$this->model('account')->get_user_info_by_uid($specialist_uid,true);

			$info['specialist_name'] = $user_info['user_name'];
			$info['specialist_signature'] = $user_info['signature'];
			$info['specialist_introduction'] = $user_info['introduction'];

			$list_data=$this->topic_list("specialist_uid='{$specialist_uid}' AND is_show=1", $page=1, 'add_time DESC,topic_id DESC',2);
			foreach ($list_data as $key => $value) {
				$list_data[$key]['specialist_name'] = $user_info['user_name'];
			}
			$info['list_data'] = $list_data;
			
			// 查询是否关注了
			$info['fans_type']=0; //未关注
			if($this->user_id) {
				$friend_info=$this->model('follow')->user_follow_check($this->user_id, $specialist_uid);
				if($friend_info){
					$info['fans_type']=1; //已关注
				}
			}

			// 查询当前用户是否有支付了回答
			$answer_id = $info['answer_id'];
			if($this->user_id){

				$where = "uid = $this->user_id AND answer_id = $answer_id AND order_type = 1";
				$order_info = $this->model('specialist_order')->get_order($where);

				// 判断是否提问者、回答已支付者和专家本人，回答录音显示是否需要收费
				if( $info['uid']==$this->user_id || !empty($order_info) || $info['specialist_uid']==$this->user_id ){
				// if(!empty($order_info)){
					$info['belong'] = 1;
				}else{
					$info['belong'] = 0;
				}
			}else{
				$info['belong'] = 0;
			}
		}

		// H::p($info);
		H::ajax_json_output(AWS_APP::RSM($info, 0, null));
	}

	/**
	 * [answer_action 提交答案]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-09-01
	 */
	public function answer_action(){
		$save_data = [];

		$fields = [
			'question_id' => 'qid',
			'answer_url' => 'answer_url',
			'record_time' => 'record_time'
		];

		foreach($fields as $field=>$flag) {
			if(isset($_POST[$flag])) {
				$save_data[$field] = $_POST[$flag];
			}
		}

		foreach($fields as $field=>$flag) {
			if(empty($save_data[$field])) {
				H::ajax_json_output(AWS_APP::RSM('', 100000, '缺少参数'));
			}
		}

		// 问题超时不允许回复
		$question_info=$this->model('specialist_question')->get_question_by_id($save_data['question_id']);
		if($question_info['is_timeout']==1){
			H::ajax_json_output(AWS_APP::RSM('', 100001, '问题超时'));
		}

		$save_data['specialist_uid'] = $this->user_id;
		$save_data['add_time']		= TIMESTAMP;
		
		$answer_id=$this->model('specialist_answer')->add_answer($save_data);
		if(!$answer_id){
			H::ajax_json_output(AWS_APP::RSM(null, 15001, '提交失败'));
		}

		// 更新question表对应的answer_id
		$affect=$this->model('specialist_question')->update_question(['answer_id'=>$answer_id], "question_id='{$save_data['question_id']}'");

		if($affect){
			//发关专家动态
			$this->model('specialist_dynamic')->add_answer_dynamic($answer_id);

			//发送回复通知
			$notify = $this->model('specialist_notify');
			$notify->send($this->user_id, $question_info['uid'], $notify::TYPE_SPECIALIST_ANSWER, $notify::CATEGORY_SPECIALIST, $this->user_id, ['answer_id'=>$answer_id]);

			//分配支付金额提成
			$local_order_info = $this->model('specialist_order')->get_order("order_id='{$question_info['order_id']}'");
			if($local_order_info && $local_order_info['order_type']==1 && empty($local_order_info['refund_type'])) {
				$prorate = $this->model('specialist_prorate')->compute_prorate_by_order_id_for_question($local_order_info['order_id']);
				if($prorate) {//记录日志，方便提现时核对
			    	//普通用户
			    	if(!empty($prorate['questioner_prize'])) {
			    		$this->model('gaofen_reward')->reward_money($prorate['question_uid'], $prorate['questioner_prize'], ['type'=>$prorate['type'], 'order_id'=>$prorate['order_id']]);
			    	}

			    	//专家
			    	if(!empty($prorate['specialist_prize'])) {
			    		$this->model('gaofen_reward')->reward_money($prorate['specialist_uid'], $prorate['specialist_prize'], ['type'=>$prorate['type'], 'order_id'=>$prorate['order_id'], 'payer_uid'=>$local_order_info['uid']]);
			    	}
				}else{
					write_log('订单金额分配失败：'.$question_info['order_id']);
				}
			}
			
			// 储存及推送模板消息
			$gaofen_user = $this->model('gaofen_account')->get_gaofen_user_by_uid($question_info['uid']);
			$template_setttings = json_decode($gaofen_user['tmp_settings']);
			if($template_setttings->apply_receive){
				$user_info=$this->model('account')->get_user_info_by_uid($this->user_id);
				$topic = $this->model('specialist_topic')->get_topic($question_info['topic_id']);
				$openid = $this->get_openid($question_info['uid']);
				$question_id = $save_data['question_id'];
				$data = [
					'first' => '收到新的回复',
					'keyword1' => "你的提问已得到专家 ".$user_info['user_name']." 的回复",
					'keyword2' => '来自方法《'.$topic['topic_name'].'》',
					'remark' => '点击收听',
					'url' => get_js_url("/m/specialist/#!/replyed?id=$question_id"),
				];
				$save_data = [
					'uid' => $question_info['uid'],
					'message' => json_encode($data),
					'message_type' => self::APPLY_RECEIVE,
					'add_time' => time(),
				];
				$this->model('specialist_template')->add_template($save_data);
				$this->model('openid_weixin_weixin')->temp_send($openid, $access_token = $this->get_access_token(), $data, $tmp_type = 'common');
			}

			H::ajax_json_output(AWS_APP::RSM($answer_id, 0, null));
		}else{
			H::ajax_json_output(AWS_APP::RSM(null, 15002, '提交失败'));
		}
	}

	/**
	 * 音频支付地址
	 * @return [type] [description]
	 */
	public function get_voice_link_action() {

		if($_REQUEST['answer_id']){
			$answer_id=$_REQUEST['answer_id'];
		}else{
			H::ajax_json_output(AWS_APP::RSM(null, 14410, '缺少参数'));
		}

		$answer_question_data=$this->model('specialist_answer')->get_answer_question_order_other($answer_id);

		// H::p($answer_question_data);

		// 返回answer_id对应的question和answer数据
		if( !empty($answer_question_data['answer_info']) && !empty($answer_question_data['question_info']) ){
			$self_uid=$answer_question_data['question_info']['uid'];
			$specialist_uid=$answer_question_data['question_info']['specialist_uid'];
		}

		// H::p($self_uid);
		
		// 已支付过答案音频的
		$order_info=$this->model( 'specialist_order' )->get_order( 'answer_id='.$answer_id.' AND uid='.$this->user_id.' AND order_type=1' );
		if (!empty($order_info)) {
			$pay_answer_uid=$order_info['uid'];
		}else{
			$pay_answer_uid='';
		}

		// 判断回答录音是否需要支付,不需要的直接返回录音地址
		if( $this->user_id==$self_uid || $this->user_id==$pay_answer_uid || $this->user_id==$specialist_uid ){
			// 非专家收听时储存'我的收听'数据
			if( $this->user_id != $specialist_uid ){
				// 查询是否有收听过
				$listen_info=$this->model('specialist_userListen')->get_user_listen($this->user_id,2,$answer_id);
				if(empty($listen_info)){
					// 储存'我的收听'数据
					$listen_data=[
						'answer_id' => $answer_id,
				        'question_id' => $answer_question_data['question_info']['question_id'],
				        'question_uid' => $answer_question_data['question_info']['uid'],
				        'specialist_uid' => $specialist_uid,
				    ];
				    $listen_id=$this->model('specialist_userListen')->insert_user_listen($this->user_id,2,$answer_id,$listen_data);
				}
			}

			// 收听数+1
			$answer_heat_num_affect=$this->model('specialist_answer')->update_answer_heat_num($answer_id);

		    // 返回回答录音地址
		    // H::p($answer_question_info['answer_url']);
			H::ajax_json_output(AWS_APP::RSM(['answer_url'=>empty($answer_question_data['answer_info']['answer_url'])?'':get_setting('upload_url').$answer_question_data['answer_info']['answer_url'].'.mp3'], 0, null));
		}

		// 创建本地订单
		$local_order_data=[
			'uid'=>$this->user_id,
			'answer_id'=>$answer_id,
			'price'=>1,
			'order_type'=>0,
			'refund_type'=>0,
			'add_time'=>time(),
			'update_time'=>time(),
		];
		$local_order_id=$this->model('specialist_order')->add_order($local_order_data);
		if(!$local_order_data){
			H::ajax_json_output(AWS_APP::RSM(null, 11047, '提交失败'));exit;
		}

		// 创建远程订单
        $fee=1;
        $amount=1;
        $total_fee=$fee*$amount;
		$order_data=[
			'out_trade_no'=>$local_order_id,
			'pid'=>$this->user_id,
			'fee'=>$fee,
			'amount'=>$amount,
			'total_fee'=>AWS_APP::config()->get('gaofen')->env=='product'?$total_fee:0.01,
			'attach'	=> ['specialist_uid'=>$answer_question_data['question_info']['specialist_uid'], 'answer_id'=>$answer_id],
		];
		// H::p($order_data);exit;
		$order_id=$this->model('gaofen_order')->create($order_data);
		if(empty($order_id['order_num'])){
			H::ajax_json_output(AWS_APP::RSM(null, 11048, '提交失败'));exit;
		}

		// 更新支付订单id到本地订单
		$local_order_where="order_id='{$local_order_id}'";
		$local_order_affect=$this->model('specialist_order')->update_order(['order_num'=>$order_id['order_num']],$local_order_where);
		if(!$local_order_affect){
			H::ajax_json_output(AWS_APP::RSM(null, 11049, '提交失败'));exit;
		}

		// 支付跳转
		$callback='';
		$notify_url=get_js_url('/m/specialist/order_notify/');
		$redirect_url=$this->model('gaofen_order')->get_pay_link($order_id['order_num'], $callback, $notify_url);
		
		H::ajax_json_output(AWS_APP::RSM(['pay_link'=>$redirect_url], -100, null));
	}

	/**
	 * [make_follow_action 关注]
	 * @return [type]                 [description]
	 * @author ken
	 * @date   2016-08-24
	 */
	public function make_follow_action(){
		$friend_uid 	= (int)$_POST['uid'];
		$make_id=$this->model('follow')->user_follow_add($this->user_id,$friend_uid);

		if($make_id){
			$this->model('gaofen_account')->incr_fans_count($friend_uid);
			$this->model('gaofen_account')->incr_friend_count($this->user_id);

			H::ajax_json_output(AWS_APP::RSM('success', 0, null));
		}else{
			H::ajax_json_output(AWS_APP::RSM(null, 14011, '关注失败'));
		}
	}

	/**
	 * [follow_friends_list_action 关注列表]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-09-18
	 */
	public function follow_friends_list_action(){

		$page=max((int)$_REQUEST['page'],1);
		$limit=5;
		$offset=($page-1)*$limit;

		// 获取所有关注者
		// $friends_list=$this->model('follow')->get_user_friends($this->user_id, $limit, $offset);
		
		// 只获取关注的专家
		$friends_list=$this->model('follow')->get_specialist_friends($this->user_id, $limit, $offset);

		// H::p($friends_list);

		if(empty($friends_list)){
			H::ajax_json_output(AWS_APP::RSM(null, 14011, '没有关注其他用户'));
		}

		foreach ($friends_list as $key => $value) {
			$data[$key]=[
				'uid' => $value['uid'],
		        'user_name' => $value['user_name'],
		        'avatar_file' => get_avatar_url($value['uid'], 'max'),
		        'fans_count' => $value['fans_count'],
		        'verified' => $value['verified'],
		        'signature' => $value['signature']
			];
			if($value['verified']){
				$uids[]=$value['uid'];
			}else{
				$data[$key]['type']=2; //非专家
				$data[$key]['reason']='';
				$data[$key]['topic_num']=0;
			}
		}

		if(!empty($uids)){
			// 获取认证的uids认证信息
			$verify=$this->get_verify($uids);

			// 获取认证的uids发布的方法总数
			$topic_data=$this->model('gaofen_account')->fetch_user_gaofen_uids($uids);

			// 获取uids发布的最新方法信息
			$topics=$this->model('specialist_topic')->select_topic_uids($uids);

			foreach ($data as $key => $value) {
				// 整合专家头衔
				if(isset($verify[$key])) {
					$data[$key]['type']		= 1; //表示专家
					$data[$key]['reason']	= $verify[$key]['reason'];
				}

				// 整合专家方法总数
				if(isset($topic_data[$key])) {
					$data[$key]['topic_num']=$topic_data[$key]['topic_num'];
				}

				// 整合专家最新方法id
				if(isset($topics[$key])) {
					$data[$key]['topic_id']	=	$topics[$key]['topic_id'];
				}
			}
		}
		
		// H::p(array_values($data));exit;
		H::ajax_json_output(AWS_APP::RSM(array_values($data), 0, null));
	}

	/**
	 * [follow_fans_list_action 关注者列表（粉丝列表）]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-09-18
	 */
	public function follow_fans_list_action(){

		$page=max((int)$_REQUEST['page'],1);
		$limit=5;
		$offset=($page-1)*$limit;

		$fans_list=$this->model('follow')->get_user_fans($this->user_id,$limit,$offset);

		if(empty($fans_list)){
			H::ajax_json_output(AWS_APP::RSM(null, 14011, '没有关注者'));
		}

		foreach ($fans_list as $key => $value) {
			$data[$key]=[
				'uid' => $value['uid'],
		        'user_name' => $value['user_name'],
		        'avatar_file' => get_avatar_url($value['uid'], 'max'),
		        'fans_count' => $value['fans_count'],
		        'verified' => $value['verified'],
		        'signature' => $value['signature']
			];
			if($value['verified']){
				$uids[]=$value['uid'];
			}else{
				$data[$key]['type']=2; //表示非专家
				$data[$key]['reason']='';
				$data[$key]['topic_num']='';
			}
		}

		if(!empty($uids)){
			// 获取认证的uids认证信息
			$verify=$this->get_verify($uids);

			// 获取认证的uids发布的方法总数
			$topic_data=$this->model('gaofen_account')->fetch_user_gaofen_uids($uids);

			// 获取uids发布的最新方法信息
			$topics=$this->model('specialist_topic')->select_topic_uids($uids);

			foreach ($data as $key => $value) {
				// 整合专家头衔
				if(isset($verify[$key])) {
					$data[$key]['type']		= 1; //表示专家
					$data[$key]['reason']	= $verify[$key]['reason'];
				}

				// 整合专家方法总数
				if(isset($topic_data[$key])) {
					$data[$key]['topic_num']=$topic_data[$key]['topic_num'];
				}

				// 整合专家最新方法id
				if(isset($topics[$key])) {
					$data[$key]['topic_id']	=	$topics[$key]['topic_id'];
				}
			}
		}

		// H::p(array_values($data));
		H::ajax_json_output(AWS_APP::RSM(array_values($data), 0, null));
	}

	/**
	 * [free_time 免费剩余时间]
	 * @param  [int]     $start_time [专题发布时间]
	 * @return [string]                 [截至时间]
	 * @author ken
	 * @date   2016-08-23
	 */
	private function free_time($start_time,$time_long=259200){
		$free_time=(int)$start_time+(int)$time_long-time();
		$free_time_str=$this->time2string($free_time);
		// return [
		// 	'free_time_str'=>$free_time_str,
		// 	'free_time'=>$free_time
		// ];
		
		return $free_time;
	}

	/**
	 * [free_question 免费问题时间]
	 * @param  [type]     $free_num           [description]
	 * @param  [type]     $count_now_question [description]
	 * @return [type]                         [description]
	 * @author ken
	 * @date   2016-08-23
	 */
	private function free_question($count_now_question,$free_num=3){
		$free_question=$free_num-$count_now_question;
		return $free_question;
	}

	/**
	 * [get_time 获取时间差]
	 * @param  [type]     $time_s [description]
	 * @param  [type]     $time_n [description]
	 * @return [type]             [description]
	 * @author ken
	 * @date   2016-08-23
	 */
	private function get_time($time_s,$time_n){
		$time_s = strtotime($time_s);
		$time_n = strtotime($time_n);
		$strtime = '';
		$time = $time_n-$time_s;
		// return $time_s;
		if($time >= 86400){
			return $strtime .= intval($time/86400).'天前';
		}else if($time >= 3600){
			$strtime .= intval($time/3600).'小时前';
			$time = $time % 3600;
		}else if($time >= 60){
			$strtime .= intval($time/60).'分钟前';
			$time = $time % 60;
		}else if($time > 0){
			$strtime .= intval($time).'秒前';
		}else{
			$strtime = "时间错误";
		}
		return $strtime;
	}

	/**
	 * [time2string 剩余时间格式化]
	 * @param  [int]     $second [剩余的秒数]
	 * @return [type]             [description]
	 * @author ken
	 * @date   2016-08-23
	 */
	private function time2string($second){
		$day = floor($second/(3600*24));
		$second = $second%(3600*24);//除去整天之后剩余的时间
		$hour = floor($second/3600);
		$second = $second%3600;//除去整小时之后剩余的时间 
		$minute = floor($second/60);
		$second = $second%60;//除去整分钟之后剩余的时间 

		if($hour<10){
			$hour='0'.$hour;
		}
		if($minute<10){
			$minute='0'.$minute;
		}
		if($second<10){
			$second='0'.$second;
		}
		//返回字符串
		return $day*24+$hour.':'.$minute.':'.$second;
	}

	public function do_upload_action() {

		if(empty($this->get_verify($this->user_id))) {
			H::ajax_json_output(AWS_APP::RSM('', 100000, '缺少权限'));
		}
		
		$field = $_GET['field'];
		$data_stream = '';

		if(isset($_GET['media_id'])) {
			$data_stream = $this->model('specialist_audio')->get_file($_GET['media_id']);
			$field = $_GET['media_id'].'.amr';
		}

		$data = $this->upload_file($_GET['id'], $field, $data_stream);

		H::ajax_json_output($data);

	}

	

	private function upload_file($id, $field, $data_stream){

        $item_type = '';
        switch ($id)
        {
            case 'cover':
                $item_type = 'specialist/cover';

                break;

            case 'voice':
                $item_type = 'specialist/voice';

                break;
        }

        if(empty($item_type)) {
        	return AWS_APP::RSM('',10001, '上传目标标识不正确');
        }

        AWS_APP::upload()->initialize(array(
            'allowed_types' => get_setting('allowed_upload_types'),
            'upload_path' => get_setting('upload_dir') . '/' . $item_type . '/' . gmdate('Ymd'),
            'is_image' => FALSE,
            'max_size' => get_setting('upload_size_limit')
        ));

        if (!empty($field))
        {
            AWS_APP::upload()->do_upload($field, $data_stream);
        } else {
            return AWS_APP::RSM('',10002, '缺少field参数');
        }

        if (AWS_APP::upload()->get_error())
        {
            switch (AWS_APP::upload()->get_error())
            {
                default:
                	return AWS_APP::RSM('',10003, '错误代码:'.AWS_APP::upload()->get_error());
                    //die("{'error':'错误代码: " . AWS_APP::upload()->get_error() . "'}");
                break;

                case 'upload_invalid_filetype':
                	return AWS_APP::RSM('',10003, '文件类型无效');
                    //die("{'error':'文件类型无效'}");
                break;

                case 'upload_invalid_filesize':
                	return AWS_APP::RSM('',10003, '文件尺寸过大, 最大允许尺寸为 ' . get_setting('upload_size_limit') .  ' KB');
                    //die("{'error':'文件尺寸过大, 最大允许尺寸为 " . get_setting('upload_size_limit') .  " KB'}");
                break;
            }
        }

        if (! $upload_data = AWS_APP::upload()->data())
        {
        	return AWS_APP::RSM('',10004, '上传失败, 请与管理员联系');
           // die("{'error':'上传失败, 请与管理员联系'}");
        }

        if ($upload_data['is_image'] == 1)
        {
            foreach (AWS_APP::config()->get('image')->specialist_thumbnail AS $key => $val)
            {
                $thumb_file[$key] = $upload_data['file_path'] . $key . '_' . basename($upload_data['full_path']);

                AWS_APP::image()->initialize(array(
                    'quality' => 90,
                    'source_image' => $upload_data['full_path'],
                    'new_image' => $thumb_file[$key],
                    'width' => $val['w'],
                    'height' => $val['h']
                ))->resize();
            }
        }

        $attach_id = $this->model('publish')->add_attach($item_type, $upload_data['orig_name'], $_GET['attach_access_key'], time(), basename($upload_data['full_path']), $upload_data['is_image']);

        $attach_info = $this->model('publish')->get_attach_by_id($attach_id);

        $data = [
        	'id'		=> $attach_info['id'],
        	'is_image'	=> $attach_info['is_image'],
			'full_path'	=> $attach_info['attachment'].substr($attach_info['file_name'], strrpos($attach_info['file_name'], '.')),
        	'path'		=> str_replace(get_setting('upload_url'), '', $attach_info['attachment'])
        	];

        return AWS_APP::RSM($data, 0, null);

        /*$output = array(
            'success' => true,
            'delete_url' => get_js_url('/publish/ajax/remove_attach/attach_id-' . base64_encode(H::encode_hash(array(
                'attach_id' => $attach_id,
                'access_key' => $_GET['attach_access_key']
            )))),
            'attach_id' => $attach_id,
            'attach_tag' => 'attach'

        );

        $attach_info = $this->model('publish')->get_attach_by_id($attach_id);

        if ($attach_info['thumb'])
        {
            $output['thumb'] = $attach_info['thumb'];
        }
        else
        {
            $output['class_name'] = $this->model('publish')->get_file_class(basename($upload_data['full_path']));
        }

        exit(htmlspecialchars(json_encode($output), ENT_NOQUOTES));*/
	}

	/**
	 * 提取现金
	 * @return [type] [description]
	 */
	public function draw_money_action() {

		$user_info = $this->model('gaofen_account')->get_gaofen_user_by_uid($this->user_id);

		$draw_money = $user_info['total_reward'] - $user_info['freeze_reward'] - $user_info['draw_reward'];
		if($draw_money>=1) {
			$rs = $this->model('gaofen_reward')->draw_money($this->user_id, $draw_money);
			if($rs) {
				$this->model('gaofen_account')->draw_reward_by_uid($this->user_id, $draw_money);

				// 储存及推送模板消息
				$gaofen_user = $this->model('gaofen_account')->get_gaofen_user_by_uid($this->user_id);
				$template_setttings = json_decode($gaofen_user['tmp_settings']);
				if($template_setttings->withdraw){
					$openid = $this->get_openid($this->user_id);
					$data = [
						'first' => '成功发起提现',
						'keyword1' => "提现金额".$draw_money."元",
						'keyword2' => '将在48小时内自动进入微信钱包',
						'remark' => '点击查看',
						'url' => get_js_url('/m/specialist/#!/cash'),
					];
					$save_data = [
						'uid' => $this->user_id,
						'message' => json_encode($data),
						'message_type' => self::WITHDRAW, //消息类型
						'add_time' => time(),
					];
					$this->model('specialist_template')->add_template($save_data);
					$this->model('openid_weixin_weixin')->temp_send($openid, $access_token = $this->get_access_token(), $data, $tmp_type = 'common');
				}

				return H::ajax_json_output(AWS_APP::RSM('', 0, null));
			}
		}

		write_log('提取现金失败：'.var_export($user_info, true));
		return H::ajax_json_output(AWS_APP::RSM('', 10000, '申请失败！请稍后再试！'));
	}

	public function report_action() {
        $data = (string)$_POST['data'];
        $request = (string)$_POST['request'];

        $userAgent = $_SERVER['HTTP_USER_AGENT'].PHP_EOL;

        write_log($request, 'report_'.date('Ymd').'_request');
        write_log($userAgent.$data, 'report_'.date('Ymd').'_data');

        H::ajax_json_output(AWS_APP::RSM(''));
    }
}