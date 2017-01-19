<?php
namespace Api\Apis\Auth;

use Api\OpenApi;
use Service\ThirdParty\WeixinPub as pubServicer;
use Service\ThirdParty\WeixinJssdk as jssdk;

class WeixinPub extends \Api\Apis\Base
{   
    //获取公众号access_token
    public function getAccessToken( $p=array() ){
        $catid = OpenApi::param($p, 'catid');

        if(empty($catid) || empty(\CFG::auth('cat_list', $catid))) {
            OpenApi::throwException(100000, '缺少参数');
        }

        $wxpub = new pubServicer('', '', $catid);
        $service = $wxpub->getService();
        $storage = $service->getStorage();
        try{
            $token = $storage->retrieveAccessToken($service->service());
        }catch(\OAuth\Common\Storage\Exception\TokenNotFoundException $e) {
            $service->requestAccessToken();
            $token = $storage->retrieveAccessToken($service->service());
        }

        $expires = time()+6900; //原本是7200秒过期，但希望300秒过期一次，以解决token外因失效问题

        if ($token->getEndOfLife() !== $token::EOL_NEVER_EXPIRES
        && $token->getEndOfLife() !== $token::EOL_UNKNOWN
        && $expires >$token->getEndOfLife()) {
            $service->requestAccessToken();
            $token = $storage->retrieveAccessToken($service->service());
        }

        $expires_in = $token->getEndOfLife() - $expires; //原token是7200秒过期，查
        $expires_in = $expires_in>0 ? $expires_in:0;
        $data = ['access_token'=>$token->getAccessToken(), 'refresh_token'=>$token->getRefreshToken(), 'expires_in'=>$expires_in];

        return $data;

    }

    /**
     * 获取jssdk ticket
     * @param  array  $p [description]
     * @return [type]    [description]
     */
    public function getWXConfig( $p=array() ) {
        $catid = OpenApi::param($p, 'catid');
        $url = OpenApi::param($p, 'url');

        if(empty($catid) || empty(\CFG::auth('cat_list', $catid))) {
            OpenApi::throwException(100000, '缺少参数');
        }

        $jssdk = new jssdk($catid);

        return $jssdk->getCfg($url);
    }

    /**
     * 获取jssdk 票据
     * @param  array  $p [description]
     * @return [type]    [description]
     */
    public function getTicket($p=array()) {
        $catid = OpenApi::param($p, 'catid');

        if(empty($catid) || empty(\CFG::auth('cat_list', $catid))) {
            OpenApi::throwException(100000, '缺少参数');
        }

        $jssdk = new jssdk($catid);

        return $jssdk->getTicket();
    }
}
