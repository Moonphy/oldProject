<?php

namespace Service\ThirdParty\Base;

use OAuth\OAuth2\Token\StdOAuth2Token;
use OAuth\Common\Http\Exception\TokenResponseException;
use OAuth\Common\Http\Uri\Uri;
use OAuth\Common\Consumer\CredentialsInterface;
use OAuth\Common\Http\Client\ClientInterface;
use OAuth\Common\Storage\TokenStorageInterface;
use OAuth\Common\Http\Uri\UriInterface;
use OAuth\OAuth2\Service\AbstractService;
use OAuth\Common\Token\TokenInterface;

class WeixinPub extends AbstractService
{

    const PUB_MATERIAL_COUNT    = 'material/get_materialcount';
    const PUB_MEDIA_UPLOAD      = 'media/upload';
    const PUB_MEDIA_GET         = 'media/get';
    const PUB_GETTICKET         = 'ticket/getticket';

    private $defaultCurlParams = [
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => false,
    ];

    public function __construct(
        CredentialsInterface $credentials,
        ClientInterface $httpClient,
        TokenStorageInterface $storage,
        $scopes = array(),
        UriInterface $baseApiUri = null,
        $stateParameterInAutUrl = false
    ) {
        parent::__construct($credentials, $httpClient, $storage, $scopes, $baseApiUri, $stateParameterInAutUrl);

        if (null === $baseApiUri) {
            $this->baseApiUri = new Uri('https://api.weixin.qq.com/cgi-bin/');
        }

    }




    /**
     * {@inheritdoc}
     */
    public function requestAccessToken($code='')
    {

        $bodyParams = array(
            'appid'         => $this->credentials->getConsumerId(),
            'secret'        => $this->credentials->getConsumerSecret(),
            'grant_type'    => 'client_credential',
        );

        $responseBody = $this->httpClient->retrieveResponse(
            $this->getAccessTokenEndpoint(),
            $bodyParams,
            $this->getExtraOAuthHeaders()
        );

        $token = $this->parseAccessTokenResponse($responseBody);
        $this->storage->storeAccessToken($this->service(), $token);

        return $token;
    }

    /**
     * {@inheritdoc}
     */
    protected function parseAccessTokenResponse($responseBody)
    {
        $data = json_decode($responseBody, true);

        if (null === $data || !is_array($data)) {
            throw new TokenResponseException('Unable to parse response.');
        } elseif (isset($data['errmsg'])) {
            throw new TokenResponseException('Error in retrieving token: "' . $data['errmsg'] . '"');
        } elseif (isset($data['errcode'])) {
            throw new TokenResponseException('Error in retrieving token: "' . $data['errcode'] . '"');
        }

        $token = new StdOAuth2Token();
        $token->setAccessToken($data['access_token']);
        $token->setLifeTime($data['expires_in']);

        if (isset($data['refresh_token'])) {
            $token->setRefreshToken($data['refresh_token']);
            unset($data['refresh_token']);
        }

        unset($data['access_token']);
        unset($data['expires_in']);

        $token->setExtraParams($data);

        return $token;
    }

    /**
     * Sends an authenticated API request to the path provided.
     * If the path provided is not an absolute URI, the base API Uri (must be passed into constructor) will be used.
     *
     * @param string|UriInterface $path
     * @param string              $method       HTTP method
     * @param array               $body         Request body if applicable.
     * @param array               $extraHeaders Extra headers if applicable. These will override service-specific
     *                                          any defaults.
     *
     * @return string
     *
     * @throws ExpiredTokenException
     * @throws Exception
     */
    public function request($path, $method = 'GET', $body = null, array $extraHeaders = array(), $extraParams = array())
    {
        $this->setCurlParameters();
        $uri = $this->determineRequestUriFromPath($path, $this->baseApiUri);
        try {
            $token = $this->storage->retrieveAccessToken($this->service());
        }catch(\OAuth\Common\Storage\Exception\TokenNotFoundException $e) {
            $this->requestAccessToken();
            $token = $this->storage->retrieveAccessToken($this->service());
        }

        $expireTime = time()+600; //因为服务器时间与实际access_token过期时间有误差，所加一个偏移量，允许误差

        if ($token->getEndOfLife() !== TokenInterface::EOL_NEVER_EXPIRES
            && $token->getEndOfLife() !== TokenInterface::EOL_UNKNOWN
            && $expireTime > $token->getEndOfLife()
        ) {
            /*throw new ExpiredTokenException(
                sprintf(
                    'Token expired on %s at %s',
                    date('m/d/Y', $token->getEndOfLife()),
                    date('h:i:s A', $token->getEndOfLife())
                )
            );*/

            $this->requestAccessToken();
            $token = $this->storage->retrieveAccessToken($this->service());
        }

        // add the token where it may be needed
        if (static::AUTHORIZATION_METHOD_HEADER_OAUTH === $this->getAuthorizationMethod()) {
            $extraHeaders = array_merge(array('Authorization' => 'OAuth ' . $token->getAccessToken()), $extraHeaders);
        } elseif (static::AUTHORIZATION_METHOD_QUERY_STRING === $this->getAuthorizationMethod()) {
            $uri->addToQuery('access_token', $token->getAccessToken());
        } elseif (static::AUTHORIZATION_METHOD_QUERY_STRING_V2 === $this->getAuthorizationMethod()) {
            $uri->addToQuery('oauth2_access_token', $token->getAccessToken());
        } elseif (static::AUTHORIZATION_METHOD_QUERY_STRING_V3 === $this->getAuthorizationMethod()) {
            $uri->addToQuery('apikey', $token->getAccessToken());
        } elseif (static::AUTHORIZATION_METHOD_HEADER_BEARER === $this->getAuthorizationMethod()) {
            $extraHeaders = array_merge(array('Authorization' => 'Bearer ' . $token->getAccessToken()), $extraHeaders);
        }

        $extraHeaders = array_merge($this->getExtraApiHeaders(), $extraHeaders);

        $this->setCurlParameters($extraParams);

        $return = $this->httpClient->retrieveResponse($uri, $body, $extraHeaders, $method);

        if(strpos($return, 'errcode')!==false) { //少于80字节时检测是否微信API返回错误码，以重新获取access token
            //\F::log('1---'.$uri->getAbsoluteUri());
            //\F::log('1---'.$return);
            $jsondecode = json_decode($return);
            if(!empty($jsondecode->errcode)){
                $this->setCurlParameters([]);
                $this->requestAccessToken();
                $token = $this->storage->retrieveAccessToken($this->service());
                $uriBeta =  $this->determineRequestUriFromPath($path, $this->baseApiUri);
                if (static::AUTHORIZATION_METHOD_QUERY_STRING === $this->getAuthorizationMethod()) {
                    $uriBeta->addToQuery('access_token', $token->getAccessToken());
                }

                $this->setCurlParameters($extraParams);
                $return = $this->httpClient->retrieveResponse($uriBeta, $body, $extraHeaders, $method);
                //\F::log('2---'.$uriBeta->getAbsoluteUri());
                //\F::log('2---'.$return);
            }
        }

        return $return;
    }



    /**
     * Generates a random string to be used as state
     *
     * @return string
     */
    public function generateAuthorizationState()
    {
        return NULL;
    }

    /**
     * {@inheritdoc}
     */
    public function getAuthorizationEndpoint()
    {
        return NULL;
    }


    /**
     * {@inheritdoc}
     */
    protected function getAuthorizationMethod()
    {
        return static::AUTHORIZATION_METHOD_QUERY_STRING;
    }

    public function getAuthorizationUri(array $additionalParameters = array())
    {

        return NULL;
    }


    /**
     * {@inheritdoc}
     */
    public function getAccessTokenEndpoint()
    {
        return new Uri('https://api.weixin.qq.com/cgi-bin/token');
    }

    /**
     * 设置curl opt
     * @param array $extraParams [description]
     */
    public function setCurlParameters(array $extraParams=[]) {
        $curlParameters = $this->defaultCurlParams+$extraParams;
        $this->httpClient->setCurlParameters($curlParameters);
        return $this;
    }
}
