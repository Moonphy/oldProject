<?php
class Users {

	/**
	 * 检测是否登录
	 *
	 * @return bool
	 */
	static function isLogin()
	{
		if (isset($_COOKIE['gaofen_uid']) && $_COOKIE['gaofen_uid'] &&
            isset($_COOKIE['gaofen_user']) && $_COOKIE['gaofen_user'] &&
            isset($_COOKIE['auth']) && $_COOKIE['auth']) {
            $userInfo = self::verification();
			return $userInfo ? true : false;
		}

		return false;
	}

	/**
	 * 获取登录用户uid
	 *
	 */
	static function uid($id = false,$name = 'gaofen_uid')
	{
		if ($id) {
			//todo
			return true;
		}

        $userInfo = self::verification();
		return isset($userInfo[$name]) ? $userInfo[$name] : false;
	}

	/**
	 * 获取登录用户名
	 *
	 */
	static function username($id = false, $name = 'gaofen_user')
	{
		if ($id) {
			//todo
			return true;
		}

        $userInfo = self::verification();
		return isset($userInfo[$name]) ? $userInfo[$name] : false;
	}

	/**
	 * 检查是否绑定第三方账户
	 *
	 * @param string $type sina是否绑定sina weibo账户，qq是否绑定qq账户
	 *
	 * @return bool
	 */
	static function isBind($type = 'sina')
	{
		if ('sina' == $type) {
			if (isset($_SESSION['OPEN_OAUTH_SINA']) && $_SESSION['OPEN_OAUTH_SINA']['token']) {
				return true;
			}
			return false;
		}
		if ('qq' == $type) {
			if (isset($_SESSION['OPEN_OAUTH_QQ']) && $_SESSION['OPEN_OAUTH_QQ']['token']) {
				return true;
			}
			return false;
		}
		return false;
	}

	/**
	 * 获取第三方oAuth信息
	 *
	 * @param string|bool $type 类型
	 *
	 * @return string|bool
	 */
	static function getOauthInfo($type = false)
	{
		$oAuthInfo = array();
		if (isset($_SESSION['OPEN_OAUTH_SINA']) && $_SESSION['OPEN_OAUTH_SINA']['token']) {
			$oAuthInfo['sina'] = $_SESSION['OPEN_OAUTH_SINA'];
		}
		if (isset($_SESSION['OPEN_OAUTH_QQ']) && $_SESSION['OPEN_OAUTH_QQ']['token']) {
			$oAuthInfo['qq'] = $_SESSION['OPEN_OAUTH_QQ'];
		}
		if ($type) {
			return isset($oAuthInfo[$type]) ? $oAuthInfo[$type] : false;
		}
		return $oAuthInfo;
	}

	/**
	 * 设置第三方oAuth信息
	 *
	 * @param array $oAuthInfo oAuth信息
	 * @param string|bool $type 类型
	 *
	 * @return string|bool
	 */
	static function setOauthInfo($oAuthInfo = array(), $type = 'sina')
	{
		if ('sina' == $type) {
			$_SESSION['OPEN_OAUTH_SINA']['token'] = $oAuthInfo['access_token'];
			$_SESSION['OPEN_OAUTH_SINA']['openid'] = $oAuthInfo['openid'];
			$_SESSION['OPEN_OAUTH_SINA']['oauth2_expiretime'] = $oAuthInfo['oauth2_expiretime'];
		}

		if ('qq' == $type) {
			$_SESSION['OPEN_OAUTH_QQ']['token']   = $oAuthInfo['oauth_token'];
			$_SESSION['OPEN_OAUTH_QQ']['secret']  = $oAuthInfo['oauth_token_secret'];
			$_SESSION['OPEN_OAUTH_QQ']['openid']  = $oAuthInfo['openid'];
		}
	}

    /**
     * 用户登录cookie验证处理
     *
     */
    static function verification()
    {
        $auth = isset($_COOKIE['auth']) ? $_COOKIE['auth'] : false;
        if (!$auth) {
            return false;
        }
        $userInfo = F::uc_authcode($auth, 'DECODE', UC_KEY);
        if (empty($userInfo)) {
            return false;
        }
        $userInfoArray = array();
        $userInfoArray = explode("\t", $userInfo);
        if (empty($userInfoArray)) {
            return false;
        }

        $users = array();
        $users['gaofen_uid'] = $userInfoArray[0];
        $users['gaofen_user'] = $userInfoArray[1];
        return $users;
    }

}