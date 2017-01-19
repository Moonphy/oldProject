<?php
namespace Modules\Teacheradmin;

class Admin{
	
	const _SESSION_KEY = 't_admin';

	private $cookieName = 't_a_n';		//本地uid cookie名
	private $cookieNameWithSolt = 't_a_s'; //验证值
	private $aclKeyName = 'a_c_n'; //权限cookie name
	private $venueKeyName = 't_v_v';
	private $salt = 'SZ21z@1*slz';		//盐值

	private $expire = '';

	function __construct() {
		$this->expire = time()+3600*24*30*6;
	}

	/**
	 * 获取登录状态
	 * @return boolean [description]
	 */
	public function isLogin(){
		if($this->cookieValid()){
			return true;
		}else{
			return false;
		}
	}

	/**
	 * 登录验证
	 * @return [type] [description]
	 */
	public function cookieValid() {
		$val = \F::getCookie($this->cookieName);
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
	public function setCookie($val, $isSupperAdmin=false) {
		$expire = $this->expire;
		$sign = $val?$this->makeSaltValue($val):'';
		\F::setCookie($this->cookieName, $val, $val?$expire:0);
		\F::setCookie($this->cookieNameWithSolt, $sign, $sign?$expire:0);
		\F::setCookie($this->aclKeyName, (int)$isSupperAdmin, $val?$expire:0);

		return true;
	}

	/**
	 * 是否为超级管理员
	 * @return boolean [description]
	 */
	public function isSupperAdmin() {
		return !empty(\F::getCookie($this->aclKeyName));
	}

	/**
	 * 获取校区
	 * @param  [type] $id [description]
	 * @return [type]     [description]
	 */
	public function getVenue() {
		return (int)\F::getCookie($this->venueKeyName);
	}

	/**
	 * 设置管理员所在校区
	 * @param [type] $id [description]
	 */
	public function setVenue($id) {
		$expire = $this->expire;
		return \F::setCookie($this->venueKeyName, (int)$id, $id?$expire:0);
	}

	//生成加盐值
	public function makeSaltValue($val){
		return sprintf('%u', crc32(trim($val).$this->salt));
	}

	public function login($uname, $pwd) {
		if($uname==='beststudy' && $pwd==='niushibang^&*') {
			$this->setCookie(time(), true);
			return true;
		}else{
			$adminList = \CFG::teacher('trainingCenter');
			$unameList = array_flip(array_column($adminList, 'TrainingCenterName', 'id'));
			$upwdList = array_column($adminList, 'password', 'id');
			if(isset($unameList[$uname]) && $upwdList[$unameList[$uname]]===$pwd) {
				$this->setCookie(time());
				$this->setVenue($unameList[$uname]);
				return true;
			}
		}

		return false;
	}

	/**
	 * 退出
	 * @return [type] [description]
	 */
	public function logout() {
		return $this->setCookie(null, true);
	}

}