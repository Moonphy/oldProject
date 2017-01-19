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
		// 宝库(父栏目)
		$column_list_key = 'column_list_index_feature';
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
		// 最新文章列表
		$article_list_key = 'article_list_new_feature';
		if(!($article_list_new = AWS_APP::cache()->get($article_list_key))) {
            $where = null;
			$order = 'sort DESC,add_time DESC';
			$article_list_new = $this->model('article')->select_article($field, $where, $order, $limit=8);
			// 格式化时间
			foreach ($article_list_new as $key => $value) {
				$article_list_new[$key]['add_date'] = H::get_time($value['add_time'], time());
			}
			AWS_APP::cache()->set($article_list_key, $article_list_new, $this->cache_time_normal);
		}

		TPL::assign('column_list', $column_list);
		TPL::assign('article_list_new', $article_list_new);
		TPL::output('feature_article/index');
	}
}