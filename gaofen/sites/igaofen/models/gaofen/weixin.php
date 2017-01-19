<?php 

/**
 * 高分微信授权
 */

if (!defined('IN_ANWSION'))
{
    die;
}


class gaofen_weixin_class extends AWS_MODEL{

	//微信登录授权地址
	const AUTH_REDIRECT_URL	= 'http://u.gaofen.com/auth/weixin/sync';


	/**
	 * API请求
	 * @param  [type] $name [description]
	 * @param  array  $params [description]
	 * @return [type]         [description]
	 */
	public function request($name, array $params=[], $method='get', $content='' ) {
		$params['catid'] = AWS_APP::config()->get('gaofen')->catid;
		$result = $this->model('gaofen_api')->request('auth:/auth/'.$name, $params, $methd, $content);
		return $result;
	}


	/**
	 * 微信授权登录
	 * @param  [type] $callback [description]
	 * @param  string $state    [description]
	 * @param  string $scope    [description]
	 * @return [type]           [description]
	 */
	public function loginRedirect($callback, $state='', $scope='snsapi_userinfo', $auto_redirect=true) {
		$params = ['catid'=>AWS_APP::config()->get('gaofen')->catid, 'callback'=>$callback, 'state'=>$state, 'scopes'=>$scope];
		$url = static::AUTH_REDIRECT_URL.'?'.http_build_query($params);
		if($auto_redirect) {
			HTTP::redirect($url);
		}else{
			return $url;
		}
	}
}