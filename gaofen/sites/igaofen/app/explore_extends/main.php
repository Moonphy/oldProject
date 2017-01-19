<?php

if (!defined('IN_ANWSION'))
{
	die;
}

class main extends AWS_CONTROLLER
{
	private $cache_time_normal = 5;

	public function get_access_rule()
	{
		$rule_action['rule_type'] = "white"; //'black'黑名单,黑名单中的检查  'white'白名单,白名单以外的检查

		if ($this->user_info['permission']['visit_explore'] AND $this->user_info['permission']['visit_site'])
		{
			$rule_action['actions'][] = 'index';
		}
		return $rule_action;
	}
	
	public function setup()
	{
		if (is_mobile() AND !$_GET['ignore_ua_check'])
		{
			switch ($_GET['app'])
			{
				default:
					HTTP::redirect('/m/');
				break;
			}
		}
	}

	public function index_action()
	{
		if (is_mobile())
		{
			HTTP::redirect('/m/explore/' . $_GET['id']);
		}

		if ($this->user_id)
		{
			$this->crumb(AWS_APP::lang()->_t('发现'), '/explore_extends');

			if (! $this->user_info['email'])
			{
				HTTP::redirect('/account/complete_profile/');
			}
		}

		// 宝库(父栏目)
		$column_list_key = 'column_list_index';
		if(!($column_list = AWS_APP::cache()->get($column_list_key))) {
			$field = 
			[
				'id',
	            'parent_id',
	            'title',
	            'seo_title',
	            'column_cover_url',
	            'column_description',
	            'type',
	            'sort',
	            'column_link',
	            'is_show',
	            'is_del',
	            'template_file',
	            'add_time',
	            'update_time'
            ];
            $where = 'is_del = 0 AND parent_id = 0 AND is_show = 1';
            $order = 'sort DESC';
			$column_list = $this->model('column')->select_column($field, $where, $order, $limit=11);
			AWS_APP::cache()->set($column_list_key, $column_list, $this->cache_time_normal);
		}

		// 轮播数据
		$loop_list_key = 'loop_list_index';
		if(!($loop_list = AWS_APP::cache()->get($loop_list_key))) {
			$field = null;
            $where = "type = 'loop'";
            $order = 'id ASC';
			$loop_list = $this->model('loop')->select_loop($field, $where, $order, $limit=4);
			AWS_APP::cache()->set($loop_list_key, $loop_list, $this->cache_time_normal);
		}

		// 超级话题
		$s_topic_key = 's_topic_index';
		if(!($s_topic_info = AWS_APP::cache()->get($s_topic_key))) {
			$field = null;
            $where = "type = 's_topic'";
            $order = 'id ASC';
			$s_topic_info = $this->model('loop')->get_loop($where, $field);
			AWS_APP::cache()->set($s_topic_key, $s_topic_info, $this->cache_time_normal);
		}

		// 手动推荐话题
		$field = [
			'topic_id',
            'topic_title',
            'add_time',
            'discuss_count',
            'topic_description',
            'topic_pic',
            'topic_lock',
            'focus_count',
            'user_related',
            'url_token',
            'merged_id',
            'seo_title',
            'parent_id',
            'is_parent',
            'discuss_count_last_week',
            'discuss_count_last_month',
            'discuss_count_update',
            'sort'
		];
		$where = null;
		$order = 'sort DESC,add_time DESC';
		$topic_list = $this->model('topic')->select_topic($field, $where, $order, $limit=1);
		$topic = $topic_list[0];
		// H::p($topic);

		// 推荐的qq群
		$qq_group = AWS_APP::config()->get('qq_group')->qq_group;

		// 文章字段
		$field = [
			'id',
            'uid',
            'title',
            'comments',
            'views',
            'add_time',
            'has_attach',
            'votes',
            'title_fulltext',
            'category_id',
            'is_recommend',
            'chapter_id',
            'sort',
            'column_id',
            'special_id',
            'article_cover_url',
            'parent_column_id',
            'fav_num'
		];
		// // 最新文章列表
		// $article_list_key = 'article_list_new';
		// if(!($article_list_new = AWS_APP::cache()->get($article_list_key))) {
  //           $where = null;
		// 	$order = 'add_time DESC';
		// 	$article_list_new = $this->model('article')->select_article($field, $where, $order, $limit=7);
		// 	// 格式化时间
		// 	foreach ($article_list_new as $key => $value) {
		// 		$article_list_new[$key]['add_date'] = H::get_time($value['add_time'], time());
		// 	}
		// 	AWS_APP::cache()->set($article_list_key, $article_list_new, $this->cache_time_normal);
		// }
		
		// 最新推荐文章列表
		$article_list_key = 'article_list_sort';
		if(!($article_list_sort = AWS_APP::cache()->get($article_list_key))) {
            $where = null;
			$order = 'sort DESC,add_time DESC';
			$article_list_sort = $this->model('article')->select_article($field, $where, $order, $limit=8);
			// 格式化时间
			foreach ($article_list_sort as $key => $value) {
				$article_list_sort[$key]['add_date'] = H::get_time($value['add_time'], time());
			}
			AWS_APP::cache()->set($article_list_key, $article_list_sort, $this->cache_time_normal);
		}

		// 父栏目下的文章列表
		$article_list_key = 'column_article_list_explore_extend';
		if(!($column_article_list = AWS_APP::cache()->get($article_list_key))) {
			$parent_columns = [];
			foreach ($column_list as $key => $value) {
				if ( $key <= 7 ) {
					$parent_columns[$value['id']] = $value['title'];
				}
			}
			$column_article_list = [];
			$where = null;
			$order='sort DESC,add_time DESC';
			foreach ($parent_columns as $key => $value) {
				$where = "parent_column_id = $key";
				$column_article_list[$value] = $this->model('article')->select_article($field, $where, $order, $limit=7);
			}
			// 格式化时间
			foreach ($column_article_list as $key => $value) {
				foreach ($value as $k => $v) {
					$column_article_list[$key][$k]['add_date'] = H::get_time($v['add_time'], time());
				}
			}
			AWS_APP::cache()->set($article_list_key, $column_article_list, $this->cache_time_normal);
		}

// H::p($column_article_list);
		// 问题
		$question_field = 
		[
			'question_id',
            'question_content',
            'question_detail',
            'add_time',
            'update_time',
            'published_uid',
            'answer_count',
            'answer_users',
            'view_count',
            'focus_count',
            'comment_count',
            'action_history_id',
            'category_id',
            'agree_count',
            'against_count',
            'best_answer',
            'has_attach',
            'unverified_modify',
            'unverified_modify_count',
            'ip',
            'last_answer',
            'popular_value',
            'popular_value_update',
            'lock',
            'anonymous',
            'thanks_count',
            'question_content_fulltext',
            'is_recommend',
            'weibo_msg_id',
            'received_email_id',
            'chapter_id',
            'sort',
            'question_cover_url'
        ];
        // 热门问题
		$question_list_key = 'question_list_hot';
		if(!($question_list_hot = AWS_APP::cache()->get($question_list_key))) {
            $where = null;
            $order = 'answer_count DESC,add_time DESC';
			$question_list_hot = $this->model('question')->select_question($question_field, $where, $order, $limit=5);
			AWS_APP::cache()->set($question_list_key, $question_list_hot, $this->cache_time_normal);
		}
		// H::p($question_list_hot);
		// 手动推荐问题
		$question_list_key = 'question_list_sort';
		if(!($question_list_sort = AWS_APP::cache()->get($question_list_key))) {
            $where = null;
            $order = 'sort DESC,add_time DESC';
			$question_list_sort = $this->model('question')->select_question($question_field, $where, $order, $limit=4);
			AWS_APP::cache()->set($question_list_key, $question_list_sort, $this->cache_time_normal);
		}
// H::p($question_list_sort);
		// 专题字段
		$special_field = [
			'id',
            'special_title',
            'special_seo_title',
            'special_cover_url',
            'article_num',
            'add_time',
            'update_time',
            'is_recommend',
            'view_count',
            'sort',
            'special_link',
            'is_show',
            'is_del'
		];
		// 最新专题列表
		$special_list_key = 'special_list_new';
		if(!($special_list_new = AWS_APP::cache()->get($special_list_key))) {
            // $where = null;
            $where = "is_show = 1 AND is_del = 0";
            $order = 'add_time DESC';
			$special_list_new = $this->model('special')->select_special($special_field, $where, $order, $limit=8);
			AWS_APP::cache()->set($special_list_key, $special_list_new, $this->cache_time_normal);
		}
		// 最受欢迎专题列表
		$special_list_key = 'special_list_hot';
		if(!($special_list_hot = AWS_APP::cache()->get($special_list_key))) {
            // $where = null;
            $where = "is_show = 1 AND is_del = 0";
            $order = 'sort DESC';
			$special_list_hot = $this->model('special')->select_special($special_field, $where, $order, $limit=8);
			AWS_APP::cache()->set($special_list_key, $special_list_hot, $this->cache_time_normal);
		}

		// 高分专家方法列表
		$specialist_topic_list_key = 'specialist_topic_list';
		if(!($specialist_topic_list = AWS_APP::cache()->get($specialist_topic_list_key))) {
            $where = "is_show = 1";
            $limit = 3;
            $offset = 0;
			$order_by='add_time DESC';
			$specialist_topic_list=$this->model('specialist_topic')->select_topic_with_specialist($limit,$offset,$order_by,$where);
			AWS_APP::cache()->set($special_list_key, $specialist_topic_list, $this->cache_time_normal);
		}
// H::p($specialist_topic_list);
		// 获取活动数据
		$activity_list_index_key = 'activity_list_index';
		if(!($activity_list = AWS_APP::cache()->get($specialist_topic_list_key))) {
			$field = null;
            $where = "is_show = 1 AND is_del = 0";
            $order = 'id ASC';
			$activity_list = $this->model('activity')->select_activity($field, $where, $order, $limit=4);
			AWS_APP::cache()->set($activity_list_index_key, $activity_list, $this->cache_time_normal);
		}
// H::p($s_topic_info);
		TPL::assign('column_list', $column_list);
		TPL::assign('loop_list', $loop_list);
		TPL::assign('s_topic_info', $s_topic_info);
		TPL::assign('topic', $topic);
		TPL::assign('qq_group', $qq_group);
		TPL::assign('article_list_new', $article_list_new);
		TPL::assign('article_list_sort', $article_list_sort);
		TPL::assign('column_article_list', $column_article_list);
		TPL::assign('question_list_hot', $question_list_hot);
		TPL::assign('question_list_sort', $question_list_sort);
		TPL::assign('special_list_new', $special_list_new);
		TPL::assign('special_list_hot', $special_list_hot);
		TPL::assign('specialist_topic_list', $specialist_topic_list);
		TPL::assign('activity_list', $activity_list);

		TPL::output('explore_extends/index');
	}
}