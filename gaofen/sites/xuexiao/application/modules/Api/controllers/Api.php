<?php
use Api\OpenApi;

class ApiController extends \Yaf_Controller_Abstract
{
    public function init()
    {
        Yaf_Dispatcher::getInstance()->disableView();
        // http访问标识
        define('API_IN_HTTP_REQUEST', TRUE);
    }

    public function indexAction()
    {
        return OpenApi::doApiRequest();
    }
}