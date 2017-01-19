<?php
/*
+--------------------------------------------------------------------------
|   WeCenter [#RELEASE_VERSION#]
|   ========================================
|   by WeCenter Software
|   © 2011 - 2014 WeCenter. All Rights Reserved
|   http://www.wecenter.com
|   ========================================
|   Support: WeCenter@qq.com
|
+---------------------------------------------------------------------------
*/

define('IN_AJAX', TRUE);


if (!defined('IN_ANWSION'))
{
    die;
}

class ajax extends AWS_CONTROLLER
{
    public function get_access_rule()
    {
        $rule_action['rule_type'] = 'white'; //黑名单,黑名单中的检查  'white'白名单,白名单以外的检查
        $rule_action['actions'] = array();

        return $rule_action;
    }

    public function setup()
    {
        HTTP::no_cache_header();
    }

    /**
     * [list_by_pagedata description]
     * @return [type] [description]
     */
    public function is_mj_action() {

        if (!$this->user_info['permission']['is_administortar'])
        {
            H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('你没有权限操作')));
        }
        
        $uids       = is_array($_GET['uids']) ? $_GET['uids']:explode(',', $_GET['uids']);
        $group_id   = $this->user_id;

        $list = $this->model('plugin_gfmj_model')->get_list_by_uids($uids, $group_id);
        $list = array_column($list, null, 'mj_id');

        $result = [];
        foreach($uids as $uid) {
            if(isset($list[$uid])) {
                $result["$uid"] = $list[$uid];
            } else {
                $result["$uid"] = null;
            }
        }

        H::ajax_json_output(AWS_APP::RSM($result, '1', null));
    }

    /**
     * 添加马甲
     */
    public function add_action() {
        if (!$this->user_info['permission']['is_administortar'])
        {
            H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('你没有权限操作')));
        }

        $uid        = $_GET['uid'];         //马甲user_id
        $unickname  = $_GET['nickname'];   //马甲user_nickname
        $flag       = $_GET['flag'];
        $group_id   = $this->user_id;

        if($rs = $this->model('plugin_gfmj_model')->save_data(['group_id'=>$group_id, 'mj_id'=>$uid, 'mj_nickname'=>$unickname, 'flag'=>$flag])) {
            H::ajax_json_output(AWS_APP::RSM($rs, '1', null));
        } else {
            H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('添加失败')));
        }
    }

    /**
     * 删除马甲
     * @return [type] [description]
     */
    public function delete_action() {
        if (!$this->user_info['permission']['is_administortar'])
        {
            H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('你没有权限操作')));
        }

        $id = $_GET['id'];
        $group_id   = $this->user_id;
        $info = $this->model('plugin_gfmj_model')->get($id);

        if(isset($info['group_id']) && $info['group_id']==$group_id) {
            $this->model('plugin_gfmj_model')->del($id);
            H::ajax_json_output(AWS_APP::RSM(true, '1', null));
        }

        H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('非法操作')));
    }

    public function get_my_list_action() {
        if (!$this->user_info['permission']['is_administortar'])
        {
            H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('你没有权限操作')));
        }

        $group_id   = $this->user_id;
        $list = $this->model('plugin_gfmj_model')->get_list_by_group_id($group_id, 500);

        foreach($list as $k=>$item) {
            $list[$k]['mj_nickname']    = $list[$k]['flag'].'-'.$list[$k]['mj_nickname'];
        }

        H::ajax_json_output(AWS_APP::RSM($list, '1', null));
    }
}
