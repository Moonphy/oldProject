<?php
use Modules\Huodong\Bestvoice\User;

class Comment_CommentController extends Yaf_Controller_Abstract
{
	public function init(){
		header('Access-Control-Allow-Origin:*');
		$this->project = V('r:project');
		$this->config = \CFG::comment('standard', 'project');

		$this->callback = F::O(V('g:callback'), true);

		//项目检测
		if(empty($this->project) || !isset($this->config[$this->project])) {
			\F::ajaxRst(false, 10000, '项目不存在', false, $this->callback);
		}

		$this->config = $this->config[$this->project];

		if( F::inEnv('product') && !$this->refererPass()) {
			\F::ajaxRst(false, 10001, '非法操作', false, $this->callback);
		}

		//登录检测
		$this->userObj = new User();

		
	}


	private function getProjectId() {
		if(isset($this->config['project_id'])) {
			return $this->config['project_id'];
		}
		return $this->project;
	}

	/**
	 * 创建评论
	 * @return [type] [description]
	 */
	public function createAction() {
		$threadId 	= V('p:threadId');
		$rootId		= (int)V('p:rootId');
		$parentId	= (int)V('p:parentId');
		$message 	= V('p:message');

		//检测活动时间
		$this->checkBeginAndEnd();

		//登录检测
		$this->loginCheck();

		//字符检测
		$this->messageCheck($message);

		//验证码检测
		$this->vCodeCheck();

		$data = [
			'project_id'	=>$this->getProjectId(),
			'thread_id'		=>$threadId,
			'root_id'		=>$rootId,
			'parent_id'		=>$parentId,
			'uid'			=>$this->userObj->getUserId(),
			'message'		=>F::O($message, true),
			'is_verify'		=>!empty($this->config['verify'])?1:0,
		];

		//是否可以评论检测
		$this->canCommentCheck($data);

		$rs = F::api('/Comment/Standard/create', $data);

		if(empty($rs) || !empty($rs['errno'])) {
			F::ajaxRst(false, 10003, '评论失败', false, $this->callback);
		}


		//定制功能，评论同时增加作品评论数
		if(strpos($threadId, 'material_')!==false) {
			$tmp = explode('_', $threadId);
			$material_type 	= $tmp[1];
			$material_id	= $tmp[2];
			F::api('/Huodong/Bestvoice/Material/incr', ['field'=>'cmt_num', 'id'=>$material_id]);

			if(in_array($material_type, [2,17])) {
				F::api('/Huodong/Bestvoice/Material/incr', ['field'=>'fav_num_total', 'id'=>$material_id, 'num'=>2]);
			}
		}

		if($rs->uid) {
			$userInfo = F::api('/Huodong/Bestvoice/User/get', ['id'=>$rs->uid]);
			$rs->user = $userInfo ? array_only($userInfo->toArray(), ['id', 'nickname', 'headimgurl']):[];
		}

		F::ajaxRst($rs, 0, '', false, $this->callback);
	}


	/**
	 * 评论列表
	 * @return [type] [description]
	 */
	public function listAction() {

		$page 		= max((int)V('g:page'), 1);
		$limit 		= min(max((int)V('g:limit'), 5), 30); //单页评论条数限制在5~20之间

		$threadId 	= V('g:threadId'); //主题ID

		if(empty($threadId)) {
			F::ajaxRst(false, 10002, '不可评论', false, $this->callback);
		}

		if(empty($this->config['verify'])) {
			$list = F::api('/Comment/Standard/listByCond', ['project_id'=>$this->getProjectId(), 'thread_id'=>$threadId, 'page'=>$page, 'limit'=>$limit]);
		} else {
			$list = F::api('/Comment/Standard/listByCond', ['project_id'=>$this->getProjectId(), 'thread_id'=>$threadId, 'is_verify'=>1, 'page'=>$page, 'limit'=>$limit]);
			//过滤模式下隐藏数也计入总评数，所以只能用拆中模式获取总评数
			$tmp = F::api('/Comment/Standard/listByCond', ['project_id'=>$this->getProjectId(), 'thread_id'=>$threadId, 'page'=>1, 'limit'=>1]);

			if(!empty($tmp['total'])) {
				$list['total'] = $tmp['total'];
			}
		}
		
		$list = json_decode(json_encode($list), true);
		$uids = array_column($list['list'], 'uid');
		$users = F::api('/Huodong/Bestvoice/User/getBatch', ['ids'=>array_unique($uids)]);

		foreach($list['list'] as $key=>$row) {
			$list['list'][$key]['user'] = isset($users[$row['uid']])?array_only($users[$row['uid']]->toArray(), ['id', 'nickname', 'headimgurl']):[];
		}

		$list['limit'] = $limit;

		F::ajaxRst($list, 0, '', false, $this->callback);
	}


	//来源检测
	private function refererPass() {
		$allow_referer = isset($this->config['referer_host']) ?$this->config['referer_host']:[];
		if($allow_referer) {
			$referer = parse_url($_SERVER['HTTP_REFERER']);
			if(empty($referer['host']) || !in_array($referer['host'], $allow_referer)) {
				return false;
			}
		}

		return true;
	}

	/**
	 * 登录检测
	 * @return [type] [description]
	 */
	private function loginCheck() {
		if(!$this->userObj->isLogin()) {
			F::ajaxRst(false, -10005, '请先登录！', false, $this->callback);
		}
	}

	/**
	 * 验证码检测
	 * @return [type] [description]
	 */
	private function vCodeCheck() {
		$cookieName = 'H_VCODE_FLAG';
		$hVCodeFlag = V('c:'.$cookieName);
		$vcode 		= V('p:code');

		if(!empty($this->config['captcha'])) {
			if(empty($hVCodeFlag) || $hVCodeFlag!=$this->getVCodeFlag()) {
				if(empty($vcode)) {
					F::ajaxRst(false, -10006, '请输入验证码', false, $this->callback);
				}
			}

			if($vcode) {
				$captcha = DIBuilder::make('Adapters\Captcha\CaptchaInterface');
				if($captcha->isValid($vcode)) {
					F::setcookie($cookieName, $this->getVCodeFlag(), time()+3600*24*7);
				}else{
					F::ajaxRst(false, 10007, '验证码不正确', false, $this->callback);
				}

				$captcha->resetCode();
			}
		}
	}

	/**
	 * [getVCodeFlag description]
	 * @param  [type] $H_VCODE_FLAG [description]
	 * @return [type]               [description]
	 */
	private function getVCodeFlag() {
		$sessid = session_id();
		$salt 	= '*sw!a1z';
		$uid 	= $this->userObj->getUserId();

		$current_hVCodeFlag = crc32(implode(':',[$sessid, $salt, $uid]));

		return $current_hVCodeFlag;
	}

	/**
	 * 检测是否可以评论
	 * @param  [type] $data [description]
	 * @return [type]       [description]
	 * $data = [
			'project_id'	=>$this->getProjectId(),
			'thread_id'		=>$threadId,
			'root_id'		=>$rootId,
			'parent_id'		=>$parentId,
			'uid'			=>$this->userObj->getUserId(),
			'message'		=>F::O($message, true),
		];
	 */
	private function canCommentCheck($data) {
		$this->canCommentCheck_dayTimes($data, isset($this->config['day_times'])?$this->config['day_times']:'');
	}

	/**
	 * 检测活动的开始与结束
	 * @return [type] [description]
	 */
	private function checkBeginAndEnd() {
		if(!empty($this->config['begin_time'])) {
			if(time()<strtotime($this->config['begin_time'])) {
				F::ajaxRst(false, 20008, '活动还没开始！', false, $this->callback);
			}
		}

		if(!empty($this->config['end_time'])) {
			if(time()>strtotime($this->config['end_time'])) {
				F::ajaxRst(false, 20009, '活动已结束！', false, $this->callback);
			}
		}
	}

	/**
	 * 每天评论次数检测
	 * @param  [type] $data  [description]
	 * @param  [type] $times [description]
	 * @return [type]        [description]
	 */
	private function canCommentCheck_dayTimes($data, $times) {
		if($times) {
			$list = F::api('/Comment/Standard/listByCond', ['project_id'=>$data['project_id'], 'thread_id'=>$data['thread_id'], 'uid'=>$data['uid'], 'limit'=>$times]);

			$today_times =0;
			if(isset($list['list']) && is_array($list['list'])) {
				foreach($list['list'] as $row){
					if(date('Y-m-d')==date('Y-m-d', strtotime($row->created_at))) {
						$today_times++;
					}
				}
			}
			if($today_times>=$times) {
				F::ajaxRst(false, 20007, '提交评论失败，一天只能评论'.$times.'次', false, $this->callback);
			}
		}
	}


	/**
	 * 内容检测
	 * @param  [type] $text [description]
	 * @return [type]       [description]
	 */
	private function messageCheck($text) {
		if(!empty($this->config['min_word'])) {
			//一个utf8 三个字节
			if(strlen($text)<($this->config['min_word']*3)) {
				F::ajaxRst(false, 20011, '评论内容不能少于'.(int)($this->config['min_word']).'个字！', false, $this->callback);				
			}
		}
	}

}