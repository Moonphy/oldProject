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

class Weixin extends AbstractService
{
    const SNSAPI_USERINFO   = 'snsapi_userinfo';
    const SNSAPI_BASE       = 'snsapi_base';

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
            $this->baseApiUri = new Uri('https://api.weixin.qq.com/');
        }

    }

    /**
     * 使用state参数
     * @return [type] [description]
     */
    public function useStateParameterInAuthUrl() {
        $this->stateParameterInAuthUrl = true;
    }

    /**
     * Generates a random string to be used as state
     *
     * @return string
     */
    public function generateAuthorizationState()
    {
        return crc32(rand());
    }

    /**
     * {@inheritdoc}
     */
    public function getAuthorizationEndpoint()
    {
        return new Uri('https://open.weixin.qq.com/connect/oauth2/authorize');
    }

    /**
     * {@inheritdoc}
     */
    public function getAccessTokenEndpoint()
    {
        return new Uri('https://api.weixin.qq.com/sns/oauth2/access_token');
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
        $parameters = array_merge(
            array(
                'appid'         => $this->credentials->getConsumerId(),
                'redirect_uri'  => $this->credentials->getCallbackUrl(),
                'response_type' => 'code',
                'scope'         => implode(' ', $this->scopes),
            ),
            $additionalParameters
        );

        if ($this->needsStateParameterInAuthUrl()) {
            if (empty($parameters['state'])) {
                $parameters['state'] = $this->generateAuthorizationState();
            }
            $this->storeAuthorizationState($parameters['state']);
        }

        // Build the url
        $url = clone $this->getAuthorizationEndpoint();
        foreach ($parameters as $key => $val) {
            $url->addToQuery($key, $val);
        }

        $url->setFragment('wechat_redirect');

        return $url;
    }

    /**
     * 重置scope
     * @param  array  $scopes [description]
     * @return [type]         [description]
     */
    public function scopes(array $scopes) {
        foreach ($scopes as $scope) {
            if (!$this->isValidScope($scope)) {
                throw new InvalidScopeException('Scope ' . $scope . ' is not valid for service ' . get_class($this));
            }
        }

        $this->scopes = $scopes;
        return $this;
    }


    /**
     * {@inheritdoc}
     */
    public function requestAccessToken($code, $state = null)
    {
        if (null !== $state) {
            $this->validateAuthorizationState($state);
        }

        $bodyParams = array(
            'code'          => $code,
            'appid'         => $this->credentials->getConsumerId(),
            'secret'        => $this->credentials->getConsumerSecret(),
            'grant_type'    => 'authorization_code',
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
    public function request($path, $method = 'GET', $body = null, array $extraHeaders = array())
    {
        $uri = $this->determineRequestUriFromPath($path, $this->baseApiUri);
        $token = $this->storage->retrieveAccessToken($this->service());

        if ($token->getEndOfLife() !== TokenInterface::EOL_NEVER_EXPIRES
            && $token->getEndOfLife() !== TokenInterface::EOL_UNKNOWN
            && time() > $token->getEndOfLife()
        ) {
            throw new ExpiredTokenException(
                sprintf(
                    'Token expired on %s at %s',
                    date('m/d/Y', $token->getEndOfLife()),
                    date('h:i:s A', $token->getEndOfLife())
                )
            );
        }

        // add the token where it may be needed
        if (static::AUTHORIZATION_METHOD_HEADER_OAUTH === $this->getAuthorizationMethod()) {
            $extraHeaders = array_merge(array('Authorization' => 'OAuth ' . $token->getAccessToken()), $extraHeaders);
        } elseif (static::AUTHORIZATION_METHOD_QUERY_STRING === $this->getAuthorizationMethod()) {
            $uri->addToQuery('access_token', $token->getAccessToken());
            $extra = $token->getExtraParams();
            $uri->addToQuery('openid', $extra['openid']);
        } elseif (static::AUTHORIZATION_METHOD_QUERY_STRING_V2 === $this->getAuthorizationMethod()) {
            $uri->addToQuery('oauth2_access_token', $token->getAccessToken());
        } elseif (static::AUTHORIZATION_METHOD_QUERY_STRING_V3 === $this->getAuthorizationMethod()) {
            $uri->addToQuery('apikey', $token->getAccessToken());
        } elseif (static::AUTHORIZATION_METHOD_HEADER_BEARER === $this->getAuthorizationMethod()) {
            $extraHeaders = array_merge(array('Authorization' => 'Bearer ' . $token->getAccessToken()), $extraHeaders);
        }

        $extraHeaders = array_merge($this->getExtraApiHeaders(), $extraHeaders);

        return $this->httpClient->retrieveResponse($uri, $body, $extraHeaders, $method);
    }
}
