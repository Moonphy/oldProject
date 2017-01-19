<?php

namespace Modules\Huodong\Bestvoice;

class User{
	
	protected static $userData 	= []; //['id'=>'8839493', 'openid'=>'odBhXuC4hJoK2Lc1FU7oyQT9qaMw', 'access_token'=>'OezXcEiiBSKSxW0eoylIeGXLGdAwQEZvYs_T2zGiaOlDEOaW1FIGJkCLM-7DvFpyOtPOpA8q8GGo52DpKYwejyqHGiH-pdmGHK_x-1QwHCkVZlctGF5dJG4jAxYeA84-1yPptXunPvSdfDFWwh67EA', 'name'=>'gzarlex',  'nickname'=>'gzarlex'];

	private $_session_key		= 'E_BV_SESS_DATA125';	
	private $cookieName 		= 'EV_BV_U';		//本地uid cookie名
	private $cookieNameWithSolt	= 'EV_BV_S';//验证值
	private $salt 				= 'SZwozd1*slzbsk';		//盐值

	function __construct() {
		$this->_session_start();
		if(empty(static::$userData)) {
			if(!empty($this->getData($this->sessionName))) {
				static::$userData = $this->getData($this->sessionName);
			}
		}
	}

	function __destruct() {
		$this->setData(static::$userData);
	}

	function __get($key){
		if(!empty(static::$userData) && isset(static::$userData[$key])){
			return static::$userData[$key];
		}
		return NULL;
	}

	/**
	 * 获取登录状态
	 * @return boolean [description]
	 */
	public function isLogin(){
		if(!empty(static::$userData)){
			return true;
		}else{
			return false;
		}
	}

	/**
	 * 自动登录
	 * @return [type] [description]
	 */
	public function autoLogin(){
		if(empty(static::$userData)){
			$uid = \F::getCookie($this->cookieName);
			if($uid && $this->cookieValid($uid)) {
				$uInfo = \F::api('/Huodong/Bestvoice/User/get', array('id'=>$uid));
				if (!isset($uInfo['errno']) && !empty($uInfo)) {
					static::$userData = $uInfo->toArray();
					$this->setData(static::$userData);
				}
			} else {
				$this->setcookie('');
				return false;
			}		
		}

		return true;
	}

	/**
	 * 注册本地用户
	 * @params 	['name', 'phone', 'weixin_id', 'weixin_nickname', 'sex', 'province', 'city', 'headimgurl']
	 * @return [type] [description]
	 */

	public function save($params){
		$rs = NULL;
		if(!empty($params['id'])){
			$uInfo = \F::api('/Huodong/Bestvoice/User/get', array('id'=>$params['id']));
			if(!empty($uInfo->id)) {
				$rs = \F::api('/Huodong/Bestvoice/User/update', $params);
				$rs = $uInfo;
			}else{
				$rs = \F::api('/Huodong/Bestvoice/User/create', $params);
			}
		}

		if(!empty($rs->id)) {
			$uInfo = \F::api('/Huodong/Bestvoice/User/get', array('id'=>$params['id']));
			$uInfo = $uInfo?$uInfo->toArray():array();
			static::$userData = $params+$uInfo;
			$this->setData(static::$userData);
			$this->setCookie($params['id']);
		}

		return $rs;
	}

	/**
	 * 登录验证
	 * @return [type] [description]
	 */
	public function cookieValid($uid) {
		$val = $uid;
		if(((int)\F::getCookie($this->cookieNameWithSolt)!==(int)$this->makeSaltValue($val)) || 
			empty($val) || empty(\F::getCookie($this->cookieNameWithSolt))){
			return false;
		}
		return true;
	}

	/**
	 * 销毁验证cookie
	 * @return [type] [description]
	 */
	public function setCookie($val) {
		$expire = time()+3600*24*2;
		$sign = $val?$this->makeSaltValue($val):'';
		\F::setCookie($this->cookieName, $val, $val?$expire:0);
		\F::setCookie($this->cookieNameWithSolt, $sign, $sign?$expire:0);
		return true;
	}

	/**
	 * 获取用户ID
	 * @return [type] [description]
	 */
	public function getUserId(){
		if(!$this->isLogin()) {
			$this->autoLogin();
		}
		return $this->id;
	}

	//生成加盐值
	public function makeSaltValue($val){
		return crc32(trim($val).$this->salt);
	}

	private function _session_start() {
		if(!isset($_SESSION)) {
			session_start();
		}

		return true;
	}

	public function setData($data) {		
		$_SESSION[$this->_session_key] = $data;
		return true;
	}

	public function getData($key='') {
		if($key) {
			return isset($_SESSION[$this->_session_key][$key])?$_SESSION[$this->_session_key][$key]:NULL;
		}else {
			return isset($_SESSION[$this->_session_key])?$_SESSION[$this->_session_key]:NULL;	
		}		
	}

	//拒绝非微信浏览
    public function denyNoWeixin($type, $curUrl='') {
        $agent = new \UserAgent();
        $noCheckBrowser = V('g:no_check_browser');


        if(!$noCheckBrowser && !$agent->is_weixin()) {

        	$curUrl = $curUrl ? 'http://qr.liantu.com/api.php?text='.$curUrl:'';
        	$view  = new \Yaf_View_Simple(MODULES_PATH.DS.'/Huodong/views/weixin');
        	$view->assign('type', $type);
        	$view->assign('qrsrc', $curUrl);
        	$viewContent = $view->render('common/denyNoWeixin.html');
        	echo $viewContent;
        	exit;
        }
    }

    /**
     * 提示
     * @param  [int] $type 项目ID
     * @param  [type] $section  所属消息配置的大类
     * @return [type]       [description]
     */
    public function getGlobalInformScript($type) {
    	$confPath = DATA_PATH.'/inform/system_'.$type;

    	if(!is_file($confPath)) {
    		touch($confPath);
    	}

    	$obj = new \Yaf_Config_Ini($confPath);

    	$return = '';

    	$uid 	= $this->getUserId();//当前uid

    	foreach($obj->toArray() as $key=>$section) {
    		if($key==='toall') {
    			if(!empty($section['message'])) {
		    		$message = addslashes($section['message']);
	    			$cachekey = isset($section['cache'])?$section['cache']:'';
			    	$localKey = "allnotify-{$cachekey}";
			    	$return .=  "<script>Gaofen.FN.popup('{$localKey}', '{$message}');</script>".PHP_EOL;
			    }
    		}

    		if($key==='tomany') {
		    	if(!empty($section['uids']) && !empty($section['message'])) {
		    		$message = addslashes($section['message']);
		    		$_uids 	= explode(',', $section['uids']);
		    		
		    		$cachekey = isset($section['cache'])?$section['cache']:'';
		    		$localKey = "enterTips-{$type}-{$uid}-{$cachekey}";
		    		if($uid && in_array($uid, $_uids)) {
		    			$return .=  "<script>Gaofen.FN.popup('{$localKey}', '{$message}');</script>".PHP_EOL;
		    		}
		    	}
		    }

		    if($key==='toone') {
		    	if(isset($section['uid']) && is_array($section['uid'])) {
		    		foreach($section['uid'] as $_uid=>$message) {
		    			if($uid==$_uid) {
			    			$message 	= addslashes($message);
			    			$cachekey = isset($section['cache'])?$section['cache']:'';
			    			$localKey = "enterTips-{$type}-o-{$uid}-{$cachekey}";		    			
		    				$return .=  "<script>Gaofen.FN.popup('{$localKey}', '{$message}');</script>".PHP_EOL;
		    			}
		    		}
		    	}
		    }
	    }


	    return $return;
    }

    private function getInviterCookieName() {
    	return 'EV_BV_INVITER';
    }

    /**
     * 分配邀请者
     * @return [type] [description]
     */
    public function assignInviter($val) {
    	$inviter = \F::getCookie($this->getInviterCookieName());
    	if(!$inviter && $val && $this->getUserId()!=$val) {
    		\F::setCookie($this->getInviterCookieName(), $val, 0);
    		return true;
    	}
    	return false;
    }

    /**
     * 获取邀请都ID
     * @return [type] [description]
     */
    public function getInviter() {
    	return \F::getCookie($this->getInviterCookieName());
    }

    /**
     * 清除邀请者
     * @return [type] [description]
     */
    public function cleanInviter() {
    	\F::setCookie($this->getInviterCookieName(), '');

    	return true;
    }
}
