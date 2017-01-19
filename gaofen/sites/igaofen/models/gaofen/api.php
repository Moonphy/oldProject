<?php 

/**
 * 高分微信授权
 */

if (!defined('IN_ANWSION'))
{
    die;
}


class gaofen_api_class extends AWS_MODEL{

	
	//API请求source
	const APP_SOURCE = '2678132890';

	//API请求token
	const APP_TOKEN = 'a803c266281f9abdbaf7c3821e314472';

	//API请求签名加密票据
	const APP_SECRET = '724cebe11a604204d81fa10d4f26e91d';

	
	/**
	 * API请求
	 * @param  [type] $path [description]
	 * @param  array  $params [description]
	 * @return [type]         [description]
	 * @example request('cms:/docs/get', ['id'=>1]); [<description>]
	 */
	public function request($path, array $params, $method='get', $content='' ) {
		$env = AWS_APP::config()->get('gaofen')->env;
		$result = json_decode(HTTP::request($this->buildApiRequestUrl($path, $params, $env), $method, $content), true);

		return $result;
	}

	/**
	 * build api url
	 * @param  [type] $path   [description]
	 * @param  array  $params [description]
	 * @return [type]         [description]
	 */
	public function buildApiRequestUrl($path, array $params, $env='product') {
		$timestamp = time();
		$signature = md5(implode('#', [static::APP_TOKEN, $timestamp, static::APP_SOURCE, static::APP_SECRET]));
		$extParams = ['source'=>static::APP_SOURCE, 'token'=>static::APP_TOKEN, 'timestamp'=>$timestamp, 'signature'=>$signature];

		$params = array_merge($params, $extParams);
		$api = $this->getApiPath($path, $env).'?'.http_build_query($params);
		return $api;
	}

	public function getApiPath($path, $env){
		$path = explode(':', $path);
		return $this->getApiHost($path[0], $env).(substr($path[1], 0, 1)==='/' ? '':'/').$path[1];
	}


	public function getApiHost($prj, $env) {
		$alias = [
			'develop'   => [
				'cms' => 'http://dev.cms.gaofen.com/api',
				// 'cms'   => 'http://ziliao.gaofen.com/api',
				'sso'   => 'http://dev.login.gaofen.com/api',
				// 'cp'    => 'http://dev.cp.gaofen.com/api.php',
				'cp'    => 'http://cp.dev.gaofen.com/api.php',
				'sphinx' => 'http://dev.sphinx.gaofen.com',
				//'sphinx' => 'http://sphinx.dev.gaofen.com',
				// 'baike' => 'http://dev.baike.gaofen.com/api',
				'baike' => 'http://baike.dev.gaofen.com/api',
				'comment' => 'http://comment.gaofen.com/api',
				'auth'	=> 'http://u.gaofen.com/api',
				'teacher' => 'http://dev.xuexiao.gaofen.com/api',
				'pay'	=> 'http://u.gaofen.com/api',
				'form'	=> 'http://dev.form.gaofen.com/api',
				'weixin'	=> 'http://dev.wx.gaofen.com',
			],
			'test'      => [
				'cms'   => 'http://ziliao.dev.gaofen.com/api',
				'sso'   => 'http://login.gaofen.com',
				'cp'    => 'http://cp.gaofen.com/api.php',
				'sphinx' => 'http://sphinx.dev.gaofen.com',
				'baike' => 'http://baike.gaofen.com/api',
				'comment' => 'http://comment.dev.gaofen.com/api',
				'auth'	=> 'http://u.gaofen.com/api',
				'teacher' => 'http://teachertest.dev.gaofen.com/api',
				'pay'	=> 'http://u.dev.gaofen.com/api',
				'form'	=> 'http://formdev.dev.gaofen.com/api',
				'weixin'	=> 'http://wx.gaofen.com',
			],
			'product'   => [
				'cms'   => 'http://ziliao.gaofen.com/api',
				'sso'   => 'http://login.gaofen.com',
				'cp'    => 'http://cp.gaofen.com/api.php',
				'sphinx' => 'http://sphinx.gaofen.com',
				'baike' => 'http://baike.gaofen.com/api',
				'comment' => 'http://comment.gaofen.com/api',
				'auth'	=> 'http://u.gaofen.com/api',
				'teacher' => 'http://teacher.gaofen.com/api',
				'pay'	=> 'http://u.gaofen.com/api',
				'form'	=> 'http://form.dev.gaofen.com/api',
				'weixin'	=> 'http://wx.gaofen.com',
			],
		];

		return isset($alias[$env][$prj]) ? $alias[$env][$prj]:'';

	}

}