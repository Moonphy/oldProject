<?php
/**
 * 公众号API访问类
 */

namespace Service\ThirdParty;

use OAuth\Common\Storage\Redis as Storage;
use OAuth\Common\Consumer\Credentials;
use OAuth\Common\Http\Client\CurlClient;
use OAuth\ServiceFactory;
use Predis\Client as PredisClient;

class WeixinPub{

    const TICKET_SALT = 'zYuy!Za';
    const OAUTH_TOKEN_KEY = 'lusitanian_oauth_token';
    const OAUTH_STATE_KEY = 'lusitanian_oauth_state';

    function __construct($appid='', $secret='', $catid = null) {
        if (is_null($catid)) {
            $catid = \CFG::auth('default_catid');
        }
        $this->appid = $appid ?: \CFG::auth('cat_list', $catid, 'app_id');
        $this->secret = $secret ?: \CFG::auth('weixin_cfg', $this->appid, 'app_secret');
 
        $credentials = new Credentials(
            $this->appid,
            $this->secret,
            '' //callback url
        );

        $httpClient = new CurlClient();
        //$httpClient->setForceSSL3(true);
        //忽略ssl证书检测
        //
        $httpParams = array(
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false,
        );

        //使用代理，测试抓包使用
        if(defined('CURL_PROXY_HOST') && !empty(CURL_PROXY_HOST)){
            $httpParams[CURLOPT_PROXY] = CURL_PROXY_HOST;
        }

        $redisObj = new PredisClient();
        $storage = new Storage($redisObj, $this->getOAuthCacheKey(static::OAUTH_TOKEN_KEY), $this->getOAuthCacheKey(static::OAUTH_STATE_KEY));
        $serviceFactory = new ServiceFactory();
        $serviceFactory->registerService('weixin_pub', 'Service\\ThirdParty\\Base\\WeixinPub');
        $serviceFactory->setHttpClient($httpClient);

        $this->service = $serviceFactory->createService('weixin_pub', $credentials, $storage, array());
    }

    /**
     * [getOAuthCacheKey description]
     * @param  [type] $key [description]
     * @return [type]      [description]
     */
    protected function getOAuthCacheKey($key) {
        return $key.':'.$this->appid;
    }

    public function getService() {
        return $this->service;
    }
}
