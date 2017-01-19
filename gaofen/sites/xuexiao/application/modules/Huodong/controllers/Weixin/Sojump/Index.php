<?php 

use Modules\Huodong\Bestvoice\Common as BCommon;
use Service\ThirdParty\WeixinJssdk;
use Cache\Redis;

class Weixin_Sojump_IndexController extends Yaf_Controller_Abstract
{
    protected $appid;

    public function init() {
        $this->redis = 'sojump';
        $this->cache = Redis::getInstance('huodong');
    }

    protected function getAccountId() {
        if (!isset($this->appid)) {
            $config = CFG::huodong('sojump');
            $catid = $config['catid'];
            $this->appid = CFG::auth('cat_list', $catid, 'app_id');
        }
        return $this->appid;
    }

    protected function _session_start() {
		if (!isset($_SESSION)) {
			session_start();
		}
        if (!isset($_SESSION['E_SJ'])) {
            $_SESSION['E_SJ'] = [];
        }

		return true;
    }
    
    protected function encrypt($data) {
        return $data['totalValue'].'|'.$data['openid'];
    }

    protected function decrypt($msg) {
        $data = explode('|', $msg);
        return [
            'totalValue' => $data[0],
            'openid' => $data[1],
        ];
    }

    public function landingAction() {
        // encript totalvalue
        // redirect to wx auth
        $totalValue = V('g:totalvalue');

        $appid = $this->getAccountId();
        $cb = F::Url('huodong_m:/huodong/weixin_sojump_index/index/', [
            'e' => $this->encrypt([
                'totalValue' => $totalValue,
                'openid' => '',
            ]),
        ]);
        $url = F::URL("weixin:/account/{$appid}/user/auth", [
            'scope' => 'snsapi_userinfo',
            'redirect_uri' => $cb,
        ]);
        F::redirect($url);
        exit;
    }

    public function indexAction() {
        // encript totalvalue and openid 
        // redirect to share
        $openid = V('g:openid', 'owner deny');
        $e = V('g:e');
        $data = $this->decrypt($e);
        $data['openid'] = $openid;
    
        $url = F::Url('huodong_m:/huodong/weixin_sojump_index/share/', [
            'e' => $this->encrypt($data),
        ]);

        $this->_session_start();
        if (!isset($_SESSION['E_SJ'])) {
            $_SESSION['E_SJ'] = [];
        }
        $_SESSION['E_SJ']['openid2'] = $openid;
 
        F::redirect($url);
        exit;
    }

    public function index2Action() {
        $openid = V('g:openid');
        $e = V('g:e');

        $url = F::Url('huodong_m:/huodong/weixin_sojump_index/share/', [
            'e' => $e,
        ]);

        $this->_session_start();
        if (!isset($_SESSION['E_SJ'])) {
            $_SESSION['E_SJ'] = [];
        }
        $_SESSION['E_SJ']['openid2'] = $openid;
 
        F::redirect($url);
        exit;
    }

    public function shareAction() {
        // get opener openid -> openid2
        // make friend
        // get openid data
        // get js sdk
        // output

        $this->_session_start();
        if (isset($_SESSION['E_SJ']) && isset($_SESSION['E_SJ']['openid2'])) {
            $openid2 = $_SESSION['E_SJ']['openid2'];
        }

        $e = V('g:e', '');
        $type = V('g:type', 3);
        $data = $this->decrypt($e);
        $appid = $this->getAccountId();

        if (empty($openid2)) {
            $cb = F::Url('huodong_m:/huodong/weixin_sojump_index/index2/', [
                'e' => $this->encrypt($data),
            ]);
 
            $url = F::URL("weixin:/account/{$appid}/user/auth", [
                'scope' => 'snsapi_base',
                'redirect_uri' => $cb,
            ]);

            F::redirect($url);
            exit;
        }

        if (empty($data)) {
            $data = [
                'totalValue' => 0,
                'openid' => 'no owner',
            ];
            $user = null;

        } else if ($openid2 != $data['openid']) {
            F::api("weixin:/account/{$appid}/user/open/{$data['openid']}/make-friend/", [
                'openid' => $openid2,
                'src' => 3,
                'type' => $type,
            ]);
        }

        $userkey = "{$this->redis}:open:{$data['openid']}";
        $user = json_decode($this->cache->get($userkey), true);
        if (!$user) {
            $user = F::api("weixin:/account/{$appid}/user/open/{$data['openid']}/");
            if (isset($user['content'])) {
                $user = $user['content'];
                $this->cache->setex($userkey, 24*3600, json_encode($user));
            } else {
                $user = null;
            }
        }

        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
        $url = "$protocol$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

        $jsConfig = F::api("weixin:/account/{$appid}/jssdk/getConfig/", [
            'url' => $url,
        ]);
        $jsConfig = $jsConfig['content'];

        $data['totalValue'] = round($data['totalValue']*2/3);

        $this->getView()->assign('wxConfig', $jsConfig);
        $this->getView()->assign('user', $user);
        $this->getView()->assign('data', $data);
        $this->getView()->assign('isOwner', $openid2 == $data['openid']);
    }
}
