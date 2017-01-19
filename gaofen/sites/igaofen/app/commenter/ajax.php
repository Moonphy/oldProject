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

    public function save_comment_action()
    {
        if (!$article_info = $this->model('article')->get_article_info_by_id($_POST['article_id']))
        {
            H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('指定文章不存在')));
        }

        if ($article_info['lock'] AND !($this->user_info['permission']['is_administortar'] OR $this->user_info['permission']['is_moderator']))
        {
            H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('已经锁定的文章不能回复')));
        }

        $message = trim($_POST['message'], "\r\n\t");

        if (! $message)
        {
            H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('请输入回复内容')));
        }

        if (strlen($message) < get_setting('answer_length_lower'))
        {
            H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('回复内容字数不得少于 %s 字节', get_setting('answer_length_lower'))));
        }

        if (! $this->user_info['permission']['publish_url'] AND FORMAT::outside_url_exists($message))
        {
            H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('你所在的用户组不允许发布站外链接')));
        }

        if (human_valid('answer_valid_hour') and ! AWS_APP::captcha()->is_validate($_POST['seccode_verify']))
        {
            H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('请填写正确的验证码')));
        }

        // !注: 来路检测后面不能再放报错提示
        if (! valid_post_hash($_POST['post_hash']))
        {
            H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('页面停留时间过长,或内容已提交,请刷新页面')));
        }

        
        $user_id = !empty($_POST['user_id']) ? $_POST['user_id']:$this->user_id;


        $data = [$_POST['article_id'], $message, $user_id, $_POST['at_uid']];
        
        $save_data = [
            'uid'=>$this->user_id,
            'mj_id' => $user_id,
            'type'=>1, 
            'publish_time'=>empty($_POST['publish_time'])?time():strtotime($_POST['publish_time']),
            'data'=>json_encode($data),
        ];

        $comment_id = $this->model('plugin_commenter_model')->save_data($save_data);

        H::ajax_json_output(AWS_APP::RSM(array(
            'result' => true
        ), 1, null));
        
    }

}
