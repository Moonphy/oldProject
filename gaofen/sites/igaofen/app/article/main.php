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


if (!defined('IN_ANWSION'))
{
	die;
}

class main extends AWS_CONTROLLER
{
	private $cache_time_normal = 3;

	public function get_access_rule()
	{
		$rule_action['rule_type'] = 'white';

		if ($this->user_info['permission']['visit_question'] AND $this->user_info['permission']['visit_site'])
		{
			$rule_action['actions'][] = 'square';
			$rule_action['actions'][] = 'index';
		}

		return $rule_action;
	}

	public function index_action()
	{
		// 新增部分，新版取消分页，此部分为page获取分页留言内容
		if($_GET['page']){

			if ($_GET['item_id'])
			{
				$comments[] = $this->model('article')->get_comment_by_id($_GET['item_id']);
			}
			else
			{
				$comments = $this->model('article')->get_comments($_GET['id'], $_GET['page'], 3);
			}

			if ($comments AND $this->user_id)
			{
				foreach ($comments AS $key => $val)
				{
					$comments[$key]['vote_info'] = $this->model('article')->get_article_vote_by_id('comment', $val['id'], 1, $this->user_id);
					$comments[$key]['message'] = $this->model('question')->parse_at_user($val['message']);

				}
			}

			foreach ($comments as $key => $value) {
				$comments[$key]['avatar_url'] = get_avatar_url($value['uid'], 'mid');
			}

			H::ajax_json_output(AWS_APP::RSM($comments, 1, null));
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

		// 旧版开始部分
		if ($_GET['notification_id'])
		{
			$this->model('notify')->read_notification($_GET['notification_id'], $this->user_id);
		}

		if (is_mobile())
		{
			HTTP::redirect('/m/article/' . $_GET['id']);
		}

		if (! $article_info = $this->model('article')->get_article_info_by_id($_GET['id']))
		{
			header('HTTP/1.1 404 Not Found');

			H::redirect_msg(AWS_APP::lang()->_t('文章不存在或已被删除'), '/');
		}

		if ($article_info['has_attach'])
		{
			$article_info['attachs'] = $this->model('publish')->get_attach('article', $article_info['id'], 'min');

			$article_info['attachs_ids'] = FORMAT::parse_attachs($article_info['message'], true);
		}

		$article_info['user_info'] = $this->model('account')->get_user_info_by_uid($article_info['uid'], true);

		$article_info['message'] = FORMAT::parse_attachs(nl2br(FORMAT::parse_bbcode($article_info['message'])));

		if ($this->user_id)
		{
			$article_info['vote_info'] = $this->model('article')->get_article_vote_by_id('article', $article_info['id'], null, $this->user_id);
		}

		$article_info['vote_users'] = $this->model('article')->get_article_vote_users_by_id('article', $article_info['id'], 1, 10);

		TPL::assign('article_info', $article_info);

		$article_topics = $this->model('topic')->get_topics_by_item_id($article_info['id'], 'article');

		if ($article_topics)
		{
			TPL::assign('article_topics', $article_topics);

			foreach ($article_topics AS $topic_info)
			{
				$article_topic_ids[] = $topic_info['topic_id'];
			}
		}

		TPL::assign('reputation_topics', $this->model('people')->get_user_reputation_topic($article_info['user_info']['uid'], $user['reputation'], 5));

		$this->crumb($article_info['title'], '/article/' . $article_info['id']);

		TPL::assign('human_valid', human_valid('answer_valid_hour'));

		if ($_GET['item_id'])
		{
			$comments[] = $this->model('article')->get_comment_by_id($_GET['item_id']);
		}
		else
		{
			$comments = $this->model('article')->get_comments($article_info['id'], $_GET['page'], 3);
		}

		if ($comments AND $this->user_id)
		{
			foreach ($comments AS $key => $val)
			{
				$comments[$key]['vote_info'] = $this->model('article')->get_article_vote_by_id('comment', $val['id'], 1, $this->user_id);
				$comments[$key]['message'] = $this->model('question')->parse_at_user($val['message']);

			}
		}

		foreach ($comments as $key => $value) {
			$comments[$key]['avatar_url'] = get_avatar_url($value['uid'], 'mid');
		}

		TPL::assign('comments', $comments);
		TPL::assign('comments_count', $article_info['comments']);

		if ($this->user_id)
		{
			TPL::assign('user_follow_check', $this->model('follow')->user_follow_check($this->user_id, $article_info['uid']));
		}

		// 查询相关文章
		$article_related_list_key = 'article_related_list_article_detail';
		if(!($article_related_list = AWS_APP::cache()->get($article_related_list_key))) {
			$keyword = $this->model('system')->analysis_keyword($this->model('system')->analysis_keyword($article_info['title']));
			$article_related_list = $this->model('search_fulltext')->query_all($this->model('search_fulltext')->bulid_query('article', 'title', $keyword), 4);
			foreach ($article_related_list as $key => $value) {
				$article_related_list[$key] = $this->model('article')->format($value);
			}
			AWS_APP::cache()->set($article_related_list_key, $article_related_list, $this->cache_time_normal);
		}
		TPL::assign('question_related_list', $article_related_list);

		// 热门问题
		$question_field = 
		[
			'question_id',
            'question_content',
            'add_time',
            'answer_count',
            'sort'
        ];
		$question_list_key = 'question_list_hot_article_detail';
		if(!($question_list_hot = AWS_APP::cache()->get($question_list_key))) {
            $where = null;
            $order = 'answer_count DESC';
			$question_list_hot = $this->model('question')->select_question($question_field, $where, $order, $limit=5);
			AWS_APP::cache()->set($question_list_key, $question_list_hot, $this->cache_time_normal);
		}
		TPL::assign('question_list_hot', $question_list_hot);

		$this->model('article')->update_views($article_info['id']);

		TPL::assign('human_valid', human_valid('answer_valid_hour'));

		TPL::assign('pagination', AWS_APP::pagination()->initialize(array(
			'base_url' => get_js_url('/article/id-' . $article_info['id']),
			'total_rows' => $article_info['comments'],
			'per_page' => 3
		))->create_links());

		TPL::set_meta('keywords', implode(',', $this->model('system')->analysis_keyword($article_info['title'])));

		TPL::set_meta('description', $article_info['title'] . ' - ' . cjk_substr(str_replace("\r\n", ' ', strip_tags($article_info['message'])), 0, 128, 'UTF-8', '...'));

		TPL::assign('attach_access_key', md5($this->user_id . time()));

		// 获取文章当前收藏标签
		$fav_tags_list = $this->model('favorite')->get_item_tags_by_item_id($_GET['id'], 'article');
// H::p($fav_tags_list);
		TPL::assign('fav_tags_list', $fav_tags_list);
		TPL::assign('column_list', $column_list);
		// TPL::output('article/index');
		TPL::output('article/index_extends');
	}

	public function index_square_action()
	{
		if (is_mobile())
		{
			HTTP::redirect('/m/article/');
		}

		$this->crumb(AWS_APP::lang()->_t('文章'), '/article/');

		if ($_GET['category'])
		{
			if (is_digits($_GET['category']))
			{
				$category_info = $this->model('system')->get_category_info($_GET['category']);
			}
			else
			{
				$category_info = $this->model('system')->get_category_info_by_url_token($_GET['category']);
			}
		}

		if ($_GET['feature_id'])
		{
			$article_list = $this->model('article')->get_articles_list_by_topic_ids($_GET['page'], get_setting('contents_per_page'), 'add_time DESC', $this->model('feature')->get_topics_by_feature_id($_GET['feature_id']));

			$article_list_total = $this->model('article')->article_list_total;

			if ($feature_info = $this->model('feature')->get_feature_by_id($_GET['feature_id']))
			{
				$this->crumb($feature_info['title'], '/article/feature_id-' . $feature_info['id']);

				TPL::assign('feature_info', $feature_info);
			}
		}
		else
		{
			$article_list = $this->model('article')->get_articles_list($category_info['id'], $_GET['page'], get_setting('contents_per_page'), 'add_time DESC');

			$article_list_total = $this->model('article')->found_rows();
		}

		if ($article_list)
		{
			foreach ($article_list AS $key => $val)
			{
				$article_ids[] = $val['id'];

				$article_uids[$val['uid']] = $val['uid'];
			}

			$article_topics = $this->model('topic')->get_topics_by_item_ids($article_ids, 'article');
			$article_users_info = $this->model('account')->get_user_info_by_uids($article_uids);

			foreach ($article_list AS $key => $val)
			{
				$article_list[$key]['user_info'] = $article_users_info[$val['uid']];
			}
		}

		// 导航
		if (TPL::is_output('block/content_nav_menu.tpl.htm', 'article/square'))
		{
			TPL::assign('content_nav_menu', $this->model('menu')->get_nav_menu_list('article'));
		}

		//边栏热门话题
		if (TPL::is_output('block/sidebar_hot_topics.tpl.htm', 'article/square'))
		{
			TPL::assign('sidebar_hot_topics', $this->model('module')->sidebar_hot_topics($category_info['id']));
		}

		if ($category_info)
		{
			TPL::assign('category_info', $category_info);

			$this->crumb($category_info['title'], '/article/category-' . $category_info['id']);

			$meta_description = $category_info['title'];

			if ($category_info['description'])
			{
				$meta_description .= ' - ' . $category_info['description'];
			}

			TPL::set_meta('description', $meta_description);
		}

		TPL::assign('article_list', $article_list);
		TPL::assign('article_topics', $article_topics);

		TPL::assign('hot_articles', $this->model('article')->get_articles_list(null, 1, 10, 'votes DESC', 30));

		TPL::assign('pagination', AWS_APP::pagination()->initialize(array(
			'base_url' => get_js_url('/article/category_id-' . $_GET['category_id'] . '__feature_id-' . $_GET['feature_id']),
			'total_rows' => $article_list_total,
			'per_page' => get_setting('contents_per_page')
		))->create_links());

		TPL::output('article/square');
	}
}
