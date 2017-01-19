<?php

namespace Modules\Teacher;
use Modules\Teacher\TeacherClient;
use Modules\Teacher\Order as OrderPresent;
use Modules\Teacher\Sms;

class User{
	
	private $_session_key;

	private static $userData = []; //['studentNid'=>'59460','id'=>'8839518', 'name'=>'gaofen', 'phone'=>'13751831002', 'headimgurl'=>'http://file.gaofen.com/xuexiao/2014/12/201412220423475497d5131aa1c_260_195.jpg'];
	private $cookieName;		//本地uid cookie名
	private $cookieNameWithSolt; //验证值
	private $salt = 'SZwoz@1*slz1';		//盐值

	function __construct() {
		$this->cookieName = \CFG::teacher('student_vaild_key', 'cookieName');
		$this->cookieNameWithSolt = \CFG::teacher('student_vaild_key', 'cookieSalt');
		$this->_session_key = \CFG::teacher('student_vaild_key', 'session_key');
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
				$uInfo = \F::api('/Teacher/User/get', array('id'=>$uid));
				if(!isset($uInfo['errno']) && !empty($uInfo)){
					static::$userData = $uInfo->toArray();
					$this->setData(static::$userData);
					return true;
				}
			}			
		}
		$this->setCookie(''); //clean cookie value
		return false;
	}

	/**
	 * 注册本地用户
	 * @params 	['name', 'phone', 'weixin_id', 'weixin_nickname', 'sex', 'province', 'city', 'headimgurl']
	 * @return [type] [description]
	 */

	public function save($params){
		$rs = NULL;
		if(!empty($params['id'])){
			$uInfo = \F::api('/Teacher/User/get', array('id'=>$params['id']));
			if(!empty($uInfo->id)) {
				$rs = \F::api('/Teacher/User/update', $params);
			}else{
				$rs = \F::api('/Teacher/User/create', $params);
			}
		}

		if(!empty($rs->id)) {
			$uInfo = \F::api('/Teacher/User/get', array('id'=>$params['id']));
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
	public function cookieValid($val) {
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
		//return $this->id ? $this->id:\F::getCookie($this->cookieName);
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

	/**
     * 更新用户订单状态
     * @param  int $uid 本地用户uid
     * @param  int $studentNid 卓越用户id
     * @param  timestamp $bg  开始时间
     * @param  timestamp $ed  结束时间
     * @return bool
     */
    public function updateOrderStatusByUid($uid, $studentNid, $bg='', $ed='') {
        if(!empty($studentNid)) {
            $bg = $bg && is_numeric($bg) ? $bg:strtotime('-10 month');
            $ed = $ed && is_numeric($ed) ? $ed:strtotime('+2 month');

            $orderList = \F::api('/Teacher/Order/listBycond', ['uid'=>$uid, 'limit'=>500, '_useFormat'=>false]);

            $OrderPresent = new OrderPresent();
            $arragementStatusList = [];

            if(!empty($orderList['list'])) {
	            $client = new TeacherClient();
	            $result = $client->GetOrderMessageByStudent(
	                    ['StudentNid'=>$studentNid, 'TrainingCenterNid'=>0, 'beginTime'=>$bg, 'endTime'=>$ed]
	                    );
	            
	            if(!empty($result->GetOrderMessageByStudentResult->StudentOrderMessageExt)) {
	                $result = $result->GetOrderMessageByStudentResult->StudentOrderMessageExt; 
	                if(is_array($result)){
	                    foreach($result as $item){
	                        $arragementStatusList[$item->WebOrderNumber] = [
	                            'IsRowClass'=>$item->IsRowClass, //是否有排课
	                            'SummaryEnd'=>$item->SummaryEnd, //是否已结束
	                            ];
	                    }
	                }else{
	                    $arragementStatusList[$result->WebOrderNumber] = [
	                            'IsRowClass'=>$result->IsRowClass, //是否有排课
	                            'SummaryEnd'=>$result->SummaryEnd, //是否已结束
	                    ];
	                }
	            }
	        }

	        //排课状态更新
            foreach($orderList['list'] as $item){
            	if($OrderPresent->isExpired($item)){ //过期检测, 删除时间大于24小时的为系统删除，小于的为用户删除
            		 \F::api('/Teacher/Order/delete', array('id'=>$item->id));
                }elseif(isset($arragementStatusList[$item->id]) 
                	&& $arragementStatusList[$item->id]['SummaryEnd']
                    && $OrderPresent->hadPay($item) 
                    && !$OrderPresent->isFinish($item)){
                    \F::api('/Teacher/Order/update', array('id'=>$item->id, 'order_status'=>4)); //已完成
                }elseif(isset($arragementStatusList[$item->id]) 
                	&& $arragementStatusList[$item->id]['IsRowClass']
                    && $OrderPresent->hadPay($item) 
                    && !$OrderPresent->isProcess($item) 
                    && !$OrderPresent->isFinish($item)) {
                    \F::api('/Teacher/Order/update', array('id'=>$item->id, 'order_status'=>3)); //已排课
                }elseif(isset($arragementStatusList[$item->id]) 
                		&& $OrderPresent->hadPay($item)
                		&& ($OrderPresent->isFinish($item) || $OrderPresent->isProcess($item))
                		&& !$arragementStatusList[$item->id]['IsRowClass']
                		&& !$arragementStatusList[$item->id]['SummaryEnd']) {
                	\F::api('/Teacher/Order/update', array('id'=>$item->id, 'order_status'=>2)); //未排课
                }
            }
        }

        return true;
    }

    /**
     * 生成随机码
     * @param  integer $num 随机数长度
     * @return [type]       [description]
     */
    public function randomCode($num=5) {
    	$min = 1;
    	$max = 9;
    	return rand(str_pad($min, $num, 0), str_pad($max, $num, 9));
    }




    /**
     * 发送用户绑定验证短信
     * @param number $tel 接收短信手机号码
     * 
     * @return [type]       [description]
     */
    public function sendSMSCode($tel, $need='') {
    	$code = $this->randomCode(6);

    	$minute = 30;//随机码N分钟内有效
    	$codeTTL = 60*$minute; 
    	$codeResendTTL = 55; //允许N秒内可重发
    	$msg = "牛师帮验证码：{$code}，{$minute}分钟有效。";

    	$codeCacheKey = $this->getSmsValidCodeCacheKey($tel);
    	$codeResendCacheKey = $this->getSmsValidCodeCacheKey($tel, 'resend');
    	if(empty(\Cache::get($codeResendCacheKey))) {
    		$rs = Sms::send(trim($tel), $msg);
    		if(empty($rs['return'])) { //发送成功
    			\Cache::set($codeCacheKey, $code.$need, $codeTTL);
    			//var_dump($codeCacheKey, $code.$need, $codeTTL, \Cache::get($codeCacheKey));
    			\Cache::set($codeResendCacheKey, time(), $codeResendTTL);
    			return true;
    		}
    	}
    	
    	return false;
    }

    /**
     * 检测手机验证码是否正确
     * @param  [string] $tel  [description]
     * @param  [string] $code [description]
     * @param  [string] $need 验证内容的必含部份
     * @return [type]       [description]
     */
    public function checkSMSCode($tel, $code, $need=''){
    	$codeCacheKey = $this->getSmsValidCodeCacheKey($tel);
    	$cacheCode = (string)trim(\Cache::get($codeCacheKey));
    	$code = (string)trim($code).$need;//var_dump($cacheCode, $code);
    	if($code && $cacheCode===$code) {
    		\Cache::del($codeCacheKey);
    		return true;
    	} else {
    		return false;
    	}
    }

    /**
     * 获取SMS验证KEY
     * @param  [type] $tel [description]
     * @return [type]      [description]
     */
    private function getSmsValidCodeCacheKey($tel, $postfix='') {
    	$key = 'CUSTOM:TEACHER:USER:BIND:VALIDCODE:'.$tel.':'.$postfix;
    	return $key;
    }
}