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

    public function save_answer_action()
    {
        if ($this->user_info['integral'] < 0 and get_setting('integral_system_enabled') == 'Y')
        {
            H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('你的剩余积分已经不足以进行此操作')));
        }

        if (!$question_info = $this->model('question')->get_question_info_by_id($_POST['question_id']))
        {
            H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('问题不存在')));
        }

        if ($question_info['lock'] AND ! ($this->user_info['permission']['is_administortar'] OR $this->user_info['permission']['is_moderator']))
        {
            H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('已经锁定的问题不能回复')));
        }

        $answer_content = trim($_POST['answer_content'], "\r\n\t");

        if (! $answer_content)
        {
            H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('请输入回复内容')));
        }

        // 判断是否是问题发起者
        if (get_setting('answer_self_question') == 'N' and $question_info['published_uid'] == $this->user_id)
        {
            H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('不能回复自己发布的问题，你可以修改问题内容')));
        }

        // 判断是否已回复过问题
        if ((get_setting('answer_unique') == 'Y') AND $this->model('answer')->has_answer_by_uid($question_info['question_id'], $this->user_id))
        {
            H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('一个问题只能回复一次，你可以编辑回复过的回复')));
        }

        if (strlen($answer_content) < get_setting('answer_length_lower'))
        {
            H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('回复内容字数不得少于 %s 字节', get_setting('answer_length_lower'))));
        }

        if (! $this->user_info['permission']['publish_url'] AND FORMAT::outside_url_exists($answer_content))
        {
            H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('你所在的用户组不允许发布站外链接')));
        }

        if (!$this->model('publish')->insert_attach_is_self_upload($answer_content, $_POST['attach_ids']))
        {
            H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('只允许插入当前页面上传的附件')));
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

        $this->model('draft')->delete_draft($question_info['question_id'], 'answer', $user_id);

        $data = [$question_info['question_id'], $answer_content, $user_id, $_POST['anonymous'], $_POST['attach_access_key'], $_POST['auto_focus']];
        
        $save_data = [
            'uid'=>$this->user_id,
            'mj_id' => $user_id,
            'type'=>1, 
            'publish_time'=>empty($_POST['publish_time'])?time():strtotime($_POST['publish_time']),
            'data'=>json_encode($data),
        ];

        $answer_id = $this->model('plugin_answerer_model')->save_data($save_data);

        H::ajax_json_output(AWS_APP::RSM(array(
            'result' => true
        ), 1, null));
        
    }

}
