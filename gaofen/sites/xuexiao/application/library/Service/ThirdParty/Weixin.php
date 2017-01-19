<?php
/**
 * 微信授权登录类
 */

namespace Service\ThirdParty;

use OAuth\Common\Storage\Session;
use OAuth\Common\Consumer\Credentials;
use OAuth\Common\Http\Client\CurlClient;
use OAuth\ServiceFactory;

class Weixin{

    const TICKET_SALT = 'zYuy21!Za';

    function __construct($appid, $secret, $redirect_uri='') {

        $redirect_uri = $redirect_uri ? $redirect_uri:\F::URL('auth:/Auth/Weixin/weixinCallback');
        $credentials = new Credentials(
            $appid,
            $secret,
            $redirect_uri //redirect_uri
        );

        $httpClient = new CurlClient();
        //$httpClient->setForceSSL3(true);
        //忽略ssl证书检测
        $httpClient->setCurlParameters(
            array(
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_SSL_VERIFYHOST => false,
            )
        );
        $storage = new Session();
        $serviceFactory = new ServiceFactory();
        $serviceFactory->registerService('weixin', 'Service\\ThirdParty\\Base\\Weixin');
        $serviceFactory->setHttpClient($httpClient);

        $this->service = $serviceFactory->createService('weixin', $credentials, $storage, array('snsapi_userinfo'));
    }

    public function getService() {
        return $this->service;
    }
}
