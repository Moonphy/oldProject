<?php

use Service\ThirdParty\Weixin;
use Service\Sign;
use Service\Ticket;

class WeixinController extends Yaf_Controller_Abstract
{   

    //败码
    const AUTH_FAILURE  = 'E100210'; //授权失败

    private function getService($randomCode){
        $appid      = $this->appid($randomCode);
        $app_secret = $this->app_secret($randomCode);
        $catid      = $this->catid($randomCode);
        $redirect_uri = V('g:redirect_uri', '');

        if(empty($catid)){
            $catid = V('g:catid', \CFG::auth('default_catid'));
            $this->catid($randomCode, $catid);
        }

        if(!($appid && $app_secret)) {
            $appid = CFG::auth('cat_list', $catid, 'app_id');
            $mch_id  = CFG::auth('weixin_cfg',  $appid, 'mch_id');
            $this->appid($randomCode, $appid);

            $app_secret = CFG::auth('weixin_cfg', $appid, 'app_secret');
            $this->app_secret($randomCode, $app_secret);
        }

        static $wxService = NULL;

        if(empty($wxService)) {
            $tmp = new Weixin($appid, $app_secret, $redirect_uri);
            $wxService = $tmp->getService();
        }

        $wxService ->useStateParameterInAuthUrl(); //强制验证请求合法性
        return $wxService;
    }

    public function authorizeAction() {
        $state      = V('g:state');
        $callback   = V('g:callback');
        $scope      = (string)V('g:scope', 'snsapi_userinfo'); //多个用','分隔

        $randomCode = $this->genRandomCode();
        $service  = $this->getService($randomCode);
        
        F::redirect($service->scopes(explode(',', $scope))->getAuthorizationUri(array('state'=>$state)));
        return false;
    }

    /**
     * 登录授权
     * @return [type] [description]
     */
    public function syncAction() {
        $state      = V('g:state');
        $callback   = V('g:callback');
        $scopes     = (string)V('g:scopes', 'snsapi_userinfo'); //多个用','分隔

        $randomCode = $this->genRandomCode();
        $service  = $this->getService($randomCode);
        
        //state 最长128个字符
        $validStr = urlencode($randomCode.'::'.$state);

        $this->callbackUrl($randomCode, $callback);
        $this->scopes($randomCode, $scopes);

        F::redirect($service->scopes(explode(',', $scopes))->getAuthorizationUri(array('state'=>$validStr)));
        return false;
    }

    /**
     * 微信授权call
     * @return [type] [description]
     */
    public function weixinCallbackAction() {
        $code = V('g:code');
        $state = V('g:state');

        $state = array_pad(explode('::', urldecode($state)), 2, '');
        $state = (object)array_combine(array('rnd', 'state'), $state);

        $state->callback = $this->callbackUrl($state->rnd);

        //验证state->rnd

        try{
            $uid = '';
            $wxService = $this->getService($state->rnd);
            $token = $wxService->requestAccessToken($code);
            $tokenExtraData = $token->getExtraParams();

            $scopes = $this->scopes($state->rnd);

            if(strpos($scopes, 'snsapi_userinfo')!==false) {
                $info = $wxService->request('sns/userinfo');

                $info = json_decode($info);

                if(!empty($info->unionid)) {
                    $saveData = (array)$info;
                    $saveData['access_token']   = $token->getAccessToken();
                    $saveData['refresh_token']  = $token->getRefreshToken();
                    $saveData['expires_in']     = date('Y-m-d H:i:s', $token->getEndOfLife());
                    $saveData['nickname']       = json_decode(preg_replace("#(\\\u(d[0-9a-f]{3}|26[0-1a-f]{2}|f[0-9a-f]{3}))#i", '' ,json_encode($saveData['nickname']))); //过滤emoji表情
                    $saveData['appid']          = $this->appid($state->rnd);
                    $saveData['catid']          = $this->catid($state->rnd);
                    if(!empty($info) && !isset($info->errcode)){
                        $list = F::api('/Auth/Weixin/listByCond', array('unionid'=>$info->unionid));
                        if(!empty($list['list'])) {
                            $tmp = array_shift($list['list']);
                            $uid = $tmp->uid;
                        }else{
                            $rs = F::api('/Auth/User/create', array('nickname'=>$info->nickname, 'name'=>$info->nickname));
                            $saveData['uid'] = $rs->id;
                        }

                        
                        if($uid) {
                            $saveData['uid'] = $uid;
                            $rs = F::api('/Auth/Weixin/update', $saveData);
                        } else {
                            $rs = F::api('/Auth/Weixin/create', $saveData);
                            $uid = $rs->uid;
                        }
                    }
                }
            }

            if(!empty($state->callback)) {
                $timestamp = time();
                $openid = $tokenExtraData['openid'];
                $params = array('uid'=>$uid, 'state'=>$state->state, 'openid'=>$openid, 'timestamp'=>$timestamp, 'catid'=>$this->catid($state->rnd),
                    'ticket'=>Ticket::genTicket($openid, $timestamp, CFG::auth('cat_list', $this->catid($state->rnd), 'catkey')));

                $callbackUrl = $this->buildUrl($state->callback, $params);
                header('Location:'.$callbackUrl);
            }

        }catch(Exception $e) {
            if(!empty($state->callback)) {
                $params = array('state'=>$state->state, 'errno'=>$e->getCode(), 'message'=>$e->getMessage());
                $callbackUrl = $this->buildUrl($state->callback, $params);
                header('Location:'.$callbackUrl);
            }
        }

        return false;
    }

    public function getOpenIdAction() {
        $code = V('g:code');

        if(empty($code)) {
            exit('deny!');
        }

        $rand = rand(800000, 999999);
        $wxService = $this->getService($rand);
        $token = $wxService->requestAccessToken($code);
        $tokenExtraData = $token->getExtraParams();

        $return = ['openid'=>$tokenExtraData['openid'], 'catid'=>$this->catid($rand)];

        echo json_encode($return);

        return false;
    }

    //创建地址
    public function buildUrl($url, array $params=array()) {

        if(!empty($params)) {
            $urlParam = http_build_query($params);
            if(strpos($url, '?')!==false){
                $url .= '&'.$urlParam;
            }else{
                $url .= '?'.$urlParam;
            }
        }        

        return $url;
    }

    /**
     * 生成随机码
     * @return [type] [description]
     */
    private function genRandomCode() {
        return crc32(rand());
    }

    /**
     * get/set callback url session
     * @param  string $key         [description]
     * @param  string $callbackUrl [description]
     * @return [type]              [description]
     */
    private function callbackUrl($key, $callbackUrl='') {
        return $this->sessData($key.':callbackurl', $callbackUrl);
    }

    /**
     * get/set request weixin api scopes
     * @param  [type] $key    [description]
     * @param  string $scopes [description]
     * @return [type]         [description]
     */
    private function scopes($key, $scopes='') {
        return $this->sessData($key.':scopes', $scopes);
    }

    /**
     * get/set used appid
     * @param  [type] $key   [description]
     * @param  string $appid [description]
     * @return [type]        [description]
     */
    private function appid($key, $appid='') {
        return $this->sessData($key.':appid', $appid);
    }
    
    /**
     * get/set used app_secret
     * @param  [type] $key        [description]
     * @param  string $app_secret [description]
     * @return [type]             [description]
     */
    private function app_secret($key, $app_secret='') {
        return $this->sessData($key.':app_secret', $app_secret);
    }

    /**
     * get/set used catid
     * @param  [type] $key        [description]
     * @param  string $catid [description]
     * @return [type]             [description]
     */
    private function catid($key, $catid='') {
        return $this->sessData($key.':catid', $catid);
    }

    /**
     * session get/set mothod
     * @param  [type] $key   [description]
     * @param  [type] $value [description]
     * @return [type]        [description]
     */
    private function sessData($key, $value=NULL) {
        $_sses_key = 'WEIXIN_AUTH_SESS_DATA';
        if(!empty($value)){
            return ($_SESSION[$_sses_key][$key] = $value);
        }elseif(isset($_SESSION[$_sses_key][$key])) {
            return $_SESSION[$_sses_key][$key];
        }

        return null;
    }
}
