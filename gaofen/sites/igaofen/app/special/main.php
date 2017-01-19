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
			$rule_action['actions'][] = 'detail';
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
		if ($_REQUEST['page']) {
			// 页码
			$page=max((int)$_REQUEST['page'],1);
			$limit=8;
			$offset=($page-1)*$limit;

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
	            'special_link'
			];
			if ($_REQUEST['type']=='hot') {
				// 最受欢迎专题列表
				$special_list_key = 'special_list_hot_special_'.$page;
				if(!($special_list = AWS_APP::cache()->get($special_list_key))) {
		            $where = "is_show = 1 AND is_del = 0";
		            // $where = null;
		            $order = 'sort DESC,add_time DESC';
					$special_list = $this->model('special')->select_special($special_field, $where, $order, $limit, $offset);
					AWS_APP::cache()->set($special_list_key, $special_list, $this->cache_time_normal);
				}

			}else{
				// 最新专题列表
				$special_list_key = 'special_list_new_special_'.$page;
				if(!($special_list = AWS_APP::cache()->get($special_list_key))) {
		            $where = "is_show = 1 AND is_del = 0";
		            // $where = null;
		            $order = 'add_time DESC';
					$special_list = $this->model('special')->select_special($special_field, $where, $order, $limit, $offset);
					AWS_APP::cache()->set($special_list_key, $special_list, $this->cache_time_normal);
				}
			}
// H::p($special_list);
			H::ajax_json_output(AWS_APP::RSM($special_list, 1, null));
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
			$column_list = $this->model('column')->select_column($field, $where, $order, $limit=8);
			AWS_APP::cache()->set($column_list_key, $column_list, $this->cache_time_normal);
		}

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
            'special_link'
		];
		if ($_GET['type']=='hot') {
			// 最受欢迎专题列表
			$special_list_key = 'special_list_hot_special';
			if(!($special_list = AWS_APP::cache()->get($special_list_key))) {
	            // $where = null;
	            $where = "is_show = 1 AND is_del = 0";
	            $order = 'sort DESC';
				$special_list = $this->model('special')->select_special($special_field, $where, $order, $limit, $offset);
				AWS_APP::cache()->set($special_list_key, $special_list, $this->cache_time_normal);
			}
			TPL::assign('type', 'hot');
		}else{
			// 最新专题列表
			$special_list_key = 'special_list_new_special';
			if(!($special_list = AWS_APP::cache()->get($special_list_key))) {
	            // $where = null;
	            $where = "is_show = 1 AND is_del = 0";
	            $order = 'add_time DESC';
				$special_list = $this->model('special')->select_special($special_field, $where, $order, $limit, $offset);
				AWS_APP::cache()->set($special_list_key, $special_list, $this->cache_time_normal);
			}
			TPL::assign('type', 'new');
		}
		// H::p($special_list);
		
		TPL::assign('column_list', $column_list);
		TPL::assign('special_list', $special_list);
		
		TPL::output('special/index');
	}

	public function detail_action()
	{
		if (!$_GET['id']) {
			HTTP::redirect('/');
		}

		$special_id = $_GET['id'];

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
            $where = 'is_del = 0 AND parent_id = 0';
            $order = 'sort DESC';
			$column_list = $this->model('column')->select_column($field, $where, $order, $limit=11);
			AWS_APP::cache()->set($column_list_key, $column_list, $this->cache_time_normal);
		}

		$special_info = $this->model('special')->get_special("id = $special_id");
// H::p($special_info);
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

		if ($_GET['type'] == 'hot') {
			// 推荐文章列表
            $where = "special_id=$special_id";
			$order = 'comments DESC,add_time DESC';
			$article_list = $this->model('article')->select_article($field, $where, $order, $limit=8);
			// 格式化时间
			foreach ($article_list as $key => $value) {
				$article_list[$key]['add_date'] = H::get_time($value['add_time'], time());
			}
		}else{
			// 最新文章列表
            $where = "special_id=$special_id";
			$order = 'add_time DESC';
			$article_list = $this->model('article')->select_article($field, $where, $order, $limit=8);
			// 格式化时间
			foreach ($article_list as $key => $value) {
				$article_list[$key]['add_date'] = H::get_time($value['add_time'], time());
			}
		}
		
		// H::p($this->current_url);
		TPL::assign('special_info', $special_info);
		TPL::assign('column_list', $column_list);
		TPL::assign('article_list', $article_list);
		TPL::assign('article_list_count', count($article_list));
		TPL::output('special/detail');
	}
}