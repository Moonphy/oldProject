<?php
/**
 * 项目名称:  高分CMS
 * 建立日期:  2013年03月11日
 *
 * 后台ajax请求管理
 *
 * @作者 heli <heli@gaofen.com>
 * @版本 $Id:
 **/
class AjaxController extends Yaf_Controller_Abstract
{
    /**
     * JS API：忽略安全检查的接口
     * @var array
     */
    private $_jsapi_ignore_sec_check = array('uploadfile');


    private $_callback = false;

    private function getCallback()
    {
        return $this->_callback;
    }

    private function setCallback($callback)
    {
        $this->_callback = $callback;
    }
    /**
     * 关闭自动显示视图
     *
     */
    public function init()
    {
        Yaf_Dispatcher::getInstance()->disableView();
        // 回调函数
        $callback = V('R:'.JSONPCALLBACK, false);
        $this->setCallback($callback);
        // 检查访问权限
        if (V('r:'.V_JS_REQUEST_ROUTE)) {
            // 加载 user_agent
            $agent = NY('userAgent');
            // 获取请求的action
            $getRequest = Yaf_Dispatcher::getInstance()->getRequest();
            $method = $getRequest->getActionName();
            if (!in_array($method, $this->_jsapi_ignore_sec_check) &&
                !$agent->is_browser() &&
                !$agent->is_mobile()) {
                F::ajaxRst(null, '700001', 'Api security check failure', false, $callback);
            }
        } else {
            F::ajaxRst(null, '700002', 'Does not allow access', false, $callback);
        }
    }



    /**
     * 代理登录处理
     *
     */
    public function loginAction()
    {
        $loginUrl = 'http://my.gaofen.com/signin/login?returntype=TEXT';
        $username = V('R:username');
        $password = V('R:password');
        $callback = V('R:callback', '');

        $http = NY('http');
        $params = array();
        $params['username'] = $username;
        $params['password'] = $password;
        $ret = $http->setData($params)->setUrl($loginUrl)->request('post');
        $loginInfo = explode("\r\n", $ret);
        $codeInfoJson = end($loginInfo);
        $codeInfoArray = json_decode($codeInfoJson, true);
        if ($codeInfoArray['code'] < 0) {
            F::ajaxRst(null, '711501', $codeInfoArray['msg'], false, $callback);
        }

        //改为一年
        if (V('P:save_me')) {
            $time = 365*24*3600;
            $uid = $codeInfoArray['code'];
            $cookie_value = F::uc_authcode($uid."\t".$username."\t", 'ENCODE', UC_KEY);
            setcookie(COOKIE_NAME_PRE.'auth', $cookie_value, $time);
        }

        F::ajaxRst(array('data' => $loginInfo[0]), 0, '', false, $callback);
    }

    /**
     * 学校搜索
     * @return [type] [description]
     */
    public function searchAction()
    {
        $q = V('g:q');

        $list = F::api('/Search/cz', array('q' => $q));

        $return = array();
        if (!empty($list['list']) && is_array($list['list'])) {
            foreach ($list['list'] as $row) {
                $return[] = array('id' => $row['id'], 'name' => $row['name'], 'link' => $row['link']);
            }
        }

        F::ajaxRst($return);
    }

    /**
     * 收藏学校接口
     * @return
     */
    public function followAction()
    {
        $school_id = V('R:school_id');
        $uid = Users::uid();
        $username = Users::username();
        $data = ['school_id' => $school_id, 'uid' => $uid,
        'username' => $username, 'action' => 'faved'];

        $rst = NY('FeedModel')->follow($uid, $school_id);

        if ($rst) {
            F::api('cz/active/setActive', $data);
        }

        return $this->isFollowAction();
    }

    /**
     * 取消学校收藏
     * @return
     */
    public function unfollowAction()
    {
        $school_id = V('R:school_id');
        $uid = Users::uid();

        $rst = NY('FeedModel')->unfollow($uid, $school_id);

        return $this->isFollowAction();
    }

    public function isFollowAction()
    {
        $school_id = V('R:school_id');

        $uid = Users::uid();

        $rst = F::api('cz/feed/isFollow', ['uid' => $uid, 'school_id' => $school_id]);

        F::ajaxRstIfError($rst);

        F::ajaxRst(['isFollow' => $rst]);
    }

    /**
     * qqgroup
     * @return [type] [description]
     */
    public function qqgroupAction() {
        $section = V('g:section'); //学段名 [幼升小|小升初|初中|高中]
        $city       = V('g:city', '全国');          //城市 [广州|深圳]
        $channel    = strtolower(V('g:channel'));       //频道 [article|baike|tool]

        if($city!='广州' && $city!='深圳') {
            $city = '全国';
        }

        //$sectionEx = ['幼升小'=>'ysx', '小升初'=>'xsc', '初中'=>'zhongkao', '高中'=>'gaokao'];


        $agent = NY('UserAgent');

        $platform = $agent->is_mobile() ? 'mobile':'pc';

        $key = 'qqgroup_'.md5(implode(":", [$section, $city, $channel, $platform]));

        $html = \Cache::get($key);

        if($html===false) {
            $tpl = CFG::qqgroup($city, 'tpl', $channel, $platform);
            if(!empty($tpl)) {
                //$section = isset($sectionEx[$section_name]) ?$sectionEx[$section_name]:'';
                $data = CFG::qqgroup($city, 'qqgroup', $section);
                if($data) {
                    $title = CFG::qqgroup($city, 'title', $section);

                    $html = $this->getView()->render($tpl, ['data'=>$data, 'title'=>$title]);
                }
            }
            \Cache::set($key, $html?:'', 60*60);
        }

        F::ajaxRst($html, 0, '', false, $this->getCallback());
    }
}
