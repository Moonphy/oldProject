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

    public function publish_question_action()
    {
        if (!$this->user_info['permission']['publish_question'] || !$this->user_info['permission']['is_administortar'])
        {
            H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('你没有权限发布问题')));
        }

        if ($this->user_info['integral'] < 0 AND get_setting('integral_system_enabled') == 'Y')
        {
            H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('你的剩余积分已经不足以进行此操作')));
        }

        if (!$_POST['question_content'])
        {
            H::ajax_json_output(AWS_APP::RSM(null, - 1, AWS_APP::lang()->_t('请输入问题标题')));
        }

        if (get_setting('category_enable') == 'N')
        {
            $_POST['category_id'] = 1;
        }

        if (!$_POST['category_id'])
        {
            H::ajax_json_output(AWS_APP::RSM(null, -1, AWS_APP::lang()->_t('请选择问题分类')));
        }

        if (cjk_strlen($_POST['question_content']) < 5)
        {
            H::ajax_json_output(AWS_APP::RSM(null, -1, AWS_APP::lang()->_t('问题标题字数不得少于 5 个字')));
        }

        if (get_setting('question_title_limit') > 0 AND cjk_strlen($_POST['question_content']) > get_setting('question_title_limit'))
        {
            H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('问题标题字数不得大于 %s 字节', get_setting('question_title_limit'))));
        }

        if (!$this->user_info['permission']['publish_url'] AND FORMAT::outside_url_exists($_POST['question_detail']))
        {
            H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('你所在的用户组不允许发布站外链接')));
        }

        if (human_valid('question_valid_hour') AND !AWS_APP::captcha()->is_validate($_POST['seccode_verify']))
        {
            H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('请填写正确的验证码')));
        }

        if ($_POST['topics'])
        {
            foreach ($_POST['topics'] AS $key => $topic_title)
            {
                $topic_title = trim($topic_title);

                if (!$topic_title)
                {
                    unset($_POST['topics'][$key]);
                }
                else
                {
                    $_POST['topics'][$key] = $topic_title;
                }
            }

            if (get_setting('question_topics_limit') AND sizeof($_POST['topics']) > get_setting('question_topics_limit'))
            {
                H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('单个问题话题数量最多为 %s 个, 请调整话题数量', get_setting('question_topics_limit'))));
            }
        }

        if (!$_POST['topics'] AND get_setting('new_question_force_add_topic') == 'Y')
        {
            H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('请为问题添加话题')));
        }

        if (!$this->model('publish')->insert_attach_is_self_upload($_POST['question_detail'], $_POST['attach_ids']))
        {
            H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('只允许插入当前页面上传的附件')));
        }

        if ($_POST['weixin_media_id'])
        {
            $_POST['weixin_media_id'] = base64_decode($_POST['weixin_media_id']);

            $weixin_pic_url = AWS_APP::cache()->get('weixin_pic_url_' . md5($_POST['weixin_media_id']));

            if (!$weixin_pic_url)
            {
                H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('图片已过期或 media_id 无效')));
            }

            $file = $this->model('openid_weixin_weixin')->get_file($_POST['weixin_media_id']);

            if (!$file)
            {
                H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('远程服务器忙')));
            }

            if (is_array($file) AND $file['errmsg'])
            {
                H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('获取图片失败，错误为: %s', $file['errmsg'])));
            }

            AWS_APP::upload()->initialize(array(
                'allowed_types' => get_setting('allowed_upload_types'),
                'upload_path' => get_setting('upload_dir') . '/questions/' . gmdate('Ymd'),
                'is_image' => TRUE,
                'max_size' => get_setting('upload_size_limit')
            ));

            AWS_APP::upload()->do_upload($_POST['weixin_media_id'] . '.jpg', $file);

            $upload_error = AWS_APP::upload()->get_error();

            if ($upload_error)
            {
                switch ($upload_error)
                {
                    default:
                        H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('保存图片失败，错误为: %s', $upload_error)));

                        break;

                    case 'upload_invalid_filetype':
                        H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('保存图片失败，本站不允许上传 jpeg 格式的图片')));

                        break;

                    case 'upload_invalid_filesize':
                        H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('图片尺寸过大, 最大允许尺寸为 %s KB', get_setting('upload_size_limit'))));

                        break;
                }
            }

            $upload_data = AWS_APP::upload()->data();

            if (!$upload_data)
            {
                H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('保存图片失败，请与管理员联系')));
            }

            foreach (AWS_APP::config()->get('image')->attachment_thumbnail AS $key => $val)
            {
                $thumb_file[$key] = $upload_data['file_path'] . $val['w'] . 'x' . $val['h'] . '_' . basename($upload_data['full_path']);

                AWS_APP::image()->initialize(array(
                    'quality' => 90,
                    'source_image' => $upload_data['full_path'],
                    'new_image' => $thumb_file[$key],
                    'width' => $val['w'],
                    'height' => $val['h']
                ))->resize();
            }

            $this->model('publish')->add_attach('question', $upload_data['orig_name'], $_POST['attach_access_key'], time(), basename($upload_data['full_path']), true);
        }

        // !注: 来路检测后面不能再放报错提示
        if (!valid_post_hash($_POST['post_hash']))
        {
            H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('页面停留时间过长,或内容已提交,请刷新页面')));
        }

        $this->model('draft')->delete_draft(1, 'question', $this->user_id);

        $user_id = !empty($_POST['user_id']) ? $_POST['user_id']:$this->user_id;
        $ask_user_id = $_POST['ask_user_id']; //!empty($_POST['user_id']) ? $_POST['user_id']:$_POST['ask_user_id'];

        $data = [$_POST['question_content'], $_POST['question_detail'], $_POST['category_id'], $user_id, $_POST['topics'], $_POST['anonymous'], $_POST['attach_access_key'], $ask_user_id, $this->user_info['permission']['create_topic']];
        
        $save_data = [
            'uid'=>$this->user_id,
            'mj_id' => $user_id,
            'type'=>1, 
            'publish_time'=>empty($_POST['publish_time'])?time():strtotime($_POST['publish_time']),
            'data'=>json_encode($data),
        ];

        $question_id = $this->model('plugin_publisher_model')->save_data($save_data);

        $url = get_js_url('/publish/');

        H::ajax_json_output(AWS_APP::RSM(array(
            'url' => $url
        ), 1, null));
        
    }

    public function publish_article_action()
    {
        if (!$this->user_info['permission']['publish_article'] || !$this->user_info['permission']['is_administortar'])
        {
            H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('你没有权限发布文章')));
        }

        if (!$_POST['title'])
        {
            H::ajax_json_output(AWS_APP::RSM(null, - 1, AWS_APP::lang()->_t('请输入文章标题')));
        }

        if (get_setting('category_enable') == 'N')
        {
            $_POST['category_id'] = 1;
        }

        if (!$_POST['category_id'])
        {
            H::ajax_json_output(AWS_APP::RSM(null, -1, AWS_APP::lang()->_t('请选择文章分类')));
        }

        if (get_setting('question_title_limit') > 0 AND cjk_strlen($_POST['title']) > get_setting('question_title_limit'))
        {
            H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('文章标题字数不得大于 %s 字节', get_setting('question_title_limit'))));
        }

        if (!$this->user_info['permission']['publish_url'] AND FORMAT::outside_url_exists($_POST['message']))
        {
            H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('你所在的用户组不允许发布站外链接')));
        }

        if (!$this->model('publish')->insert_attach_is_self_upload($_POST['message'], $_POST['attach_ids']))
        {
            H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('只允许插入当前页面上传的附件')));
        }

        if (human_valid('question_valid_hour') AND !AWS_APP::captcha()->is_validate($_POST['seccode_verify']))
        {
            H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('请填写正确的验证码')));
        }

        if ($_POST['topics'])
        {
            foreach ($_POST['topics'] AS $key => $topic_title)
            {
                $topic_title = trim($topic_title);

                if (!$topic_title)
                {
                    unset($_POST['topics'][$key]);
                }
                else
                {
                    $_POST['topics'][$key] = $topic_title;
                }
            }

            if (get_setting('question_topics_limit') AND sizeof($_POST['topics']) > get_setting('question_topics_limit'))
            {
                H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('单个文章话题数量最多为 %s 个, 请调整话题数量', get_setting('question_topics_limit'))));
            }
        }
        if (get_setting('new_question_force_add_topic') == 'Y' AND !$_POST['topics'])
        {
            H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('请为文章添加话题')));
        }

        // !注: 来路检测后面不能再放报错提示
        if (!valid_post_hash($_POST['post_hash']))
        {
            H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('页面停留时间过长,或内容已提交,请刷新页面')));
        }

        $this->model('draft')->delete_draft(1, 'article', $this->user_id);


        $user_id = !empty($_POST['user_id']) ? $_POST['user_id']:$this->user_id;
        $ask_user_id = !empty($_POST['user_id']) ? $_POST['user_id']:$_POST['ask_user_id'];

        $data = [$_POST['title'], $_POST['message'], $user_id, $_POST['topics'], $_POST['category_id'], $_POST['attach_access_key'], $this->user_info['permission']['create_topic']];
        
        $save_data = [
            'uid'=>$this->user_id,
            'mj_id' => $user_id,
            'type'=>2, 
            'publish_time'=>empty($_POST['publish_time'])?time():strtotime($_POST['publish_time']),
            'data'=>json_encode($data),
        ];

        $id = $this->model('plugin_publisher_model')->save_data($save_data);

        $url = get_js_url('/publish/article/');

         H::ajax_json_output(AWS_APP::RSM(array(
                'url' => $url
            ), 1, null));
    }
}
