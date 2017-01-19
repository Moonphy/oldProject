<?php

namespace Modules\Teacher;
use Sms\Client\Emay;

class Sms {
	static function send($tel,$msg) {
		/**
		 * 网关地址
		 */	
		$gwUrl = 'http://sdk999ws.eucp.b2m.cn:8080/sdk/SDKService?wsdl';


		/**
		 * 序列号,请通过亿美销售人员获取
		 */
		$serialNumber = '9SDK-EMY-0999-JDSLP';

		/**
		 * 密码,请通过亿美销售人员获取
		 */
		$password = '';

		/**
		 * 登录后所持有的SESSION KEY，即可通过login方法时创建
		 */
		$sessionKey = 'zydx@@2015';

		/**
		 * 连接超时时间，单位为秒
		 */
		$connectTimeOut = 5;

		/**
		 * 远程信息读取超时时间，单位为秒
		 */ 
		$readTimeOut = 10;

		/**
		 *	$proxyhost		可选，代理服务器地址，默认为 false ,则不使用代理服务器
		 *	$proxyport		可选，代理服务器端口，默认为 false
		 *	$proxyusername	可选，代理服务器用户名，默认为 false
		 *	$proxypassword	可选，代理服务器密码，默认为 false
		**/	
		$proxyhost = false;
		$proxyport = false;
		$proxyusername = false;
		$proxypassword = false; 

		$smsClient = new Emay($gwUrl,$serialNumber,$password,$sessionKey,$proxyhost,$proxyport,$proxyusername,$proxypassword,$connectTimeOut,$readTimeOut);
		/**
		 * 发送向服务端的编码，如果本页面的编码为GBK，请使用GBK
		 */
		$smsClient->setOutgoingEncoding("UTF-8");

		// login();   //激活序列号
		// chkError();
		// updatePassword();  //修改密码
		// logout();          //注销序列号 
		// registDetailInfo();//注册企业信息
		// getEachFee();      //得到单价 
		// getMO();           //接收短信
		// cancelMOForward(); //注销转接服务
		// getVersion();      //得到版本号  
		// setMOForward();    //注册转接服务  
		// sendSMS();         //发送短信
		// setMOForwardEx();  //注册转接服务(多个手机号)
		// getBalance();      //得到余额
		// chargeUp();        //充值
		/**
		 * 下面的代码将发送内容为 test 给 159xxxxxxxx 和 159xxxxxxxx
		 * $client->sendSMS还有更多可用参数，请参考 Client.php
		 */
		if(strlen($tel)==11){
			$statusCode = $smsClient->sendSMS(array($tel),$msg);
		}else{
			$statusCode= array('return'=>-100000); //自定义错误码 手机号位数不正确
		}
		return (array)$statusCode;
	}
}