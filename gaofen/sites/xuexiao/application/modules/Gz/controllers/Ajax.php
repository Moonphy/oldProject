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
     * 学校搜索
     * @return [type] [description]
     */
    public function searchAction()
    {
        $q = V('g:q');
        $district = (int)V('g:district', '');

        $list = F::api('/Gz/School/getSchools', array('q' => $q, 'district'=>$district, 'limit' => 100));

        $return = array();
        if (!empty($list['list']) && is_array($list['list'])) {
            foreach ($list['list'] as $row) {
                $return[] = array('id' => $row['id'], 'name' => $row['name'], 'link' => $row['link']);
            }
        }

        F::ajaxRst($return, 0, '', false, $this->getCallback());
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

        $rst = NY('Gz_FeedModel')->follow($uid, $school_id);

        if ($rst) {
            F::api('gz/active/setActive', $data);
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

        $rst = NY('Gz_FeedModel')->unfollow($uid, $school_id);

        return $this->isFollowAction();
    }

    public function isFollowAction()
    {
        $school_id = V('R:school_id');

        $uid = Users::uid();

        $rst = F::api('gz/feed/isFollow', ['uid' => $uid, 'school_id' => $school_id]);

        F::ajaxRstIfError($rst);

        F::ajaxRst(['isFollow' => $rst]);
    }
}
