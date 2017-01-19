<?php

use \Users;
use \F;

/**
 * 项目名称:  高分CMS
 * 建立日期:  2013年0月04日
 *
 * 后台的公共Action
 *
 **/
class AdminCommonController extends \Yaf_Controller_Abstract
{

    public function init()
    {
        $login_url = 'http://my.gaofen.com/signin';
        $_editor_auth = V('c:editor_auth');

        if (!Users::isLogin() || !$_editor_auth) {

            F::redirect($login_url);

        } else {

            if (!Users::username()) {

                F::redirect($login_url);
            }

            $adminUser = NY('Admin_AdminUserModel');

            $adminUserInfo = $adminUser->getUserById(Users::username());

            if (empty($adminUserInfo)) {
                // F::redirect($login_url);
            }
        }

        if (F::inEnv('product')) {
            define('ROOT_DIR', '/chuzhong');
        } else {
            define('ROOT_DIR', '');
        }

        $_req = Yaf_Dispatcher::getInstance()->getRequest();

        $this->getView()->assign('r_module', strtolower($_req->getModuleName()));
        $this->getView()->assign('r_controller', strtolower($_req->getControllerName()));
        $this->getView()->assign('r_action', strtolower($_req->getActionName()));
    }

    protected function checkAjax()
    {
        Yaf_Dispatcher::getInstance()->disableView();

        $_jsapi_ignore_sec_check = array('uploadfile');

        // 回调函数
        $callback = V('R:' . JSONPCALLBACK, false);

        // 检查访问权限
        if (V('r:' . V_JS_REQUEST_ROUTE)) {
            // 加载 user_agent
            $agent = NY('userAgent');
            // 获取请求的action
            $getRequest = Yaf_Dispatcher::getInstance()->getRequest();
            $method = $getRequest->getActionName();
            if (!in_array($method, $this->_jsapi_ignore_sec_check) &&
                !$agent->is_browser() &&
                !$agent->is_mobile()
            ) {
                F::ajaxRst(null, '700001', 'Api security check failure', false, $callback);
            }
        } else {
            F::ajaxRst(null, '700002', 'Does not allow access', false, $callback);
        }
    }

    public function showError($msg)
    {
        header("Content-type:text/html; charset=utf-8");
        $msg .= '&nbsp;&nbsp;<a href="javascript:void(0)" onclick="history.go(-1)">返回</a>';
        die($msg);
    }

}

