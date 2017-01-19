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

	private $cache_time_normal = 5;

	public $day_time = 86400;
	public $week_time = 604800;
	public $month_time = 2678400;

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

		$delta_week_time = time()-$this->week_time;
		$delta_month_time = time()-$this->month_time;
		$types_arr = [
			'week_views' => [
				'where' => "(add_time <= ".time()." AND add_time > ".$delta_week_time.")",
				'order' => 'views DESC,add_time DESC',
			],
			'month_views' => [
				'where' => "(add_time <= ".time()." AND add_time > ".$delta_month_time.")",
				'order' => 'views DESC,add_time DESC',
			],
			'views' => [
				'where' => null,
				'order' => 'views DESC,add_time DESC',
			],
			'fav_num' => [
				'where' => null,
				'order' => 'fav_num DESC,add_time DESC',
			]
		];

		$article_lists = $this->get_article_list($types_arr);

		// H::p($article_lists);

		TPL::assign('column_list', $column_list);
		TPL::assign('article_lists', $article_lists);
		TPL::output('list/index');
	}

	/**
	 * [get_article_list 分别获取月度最佳、一周欢迎、最热、收藏最多文章列表]
	 * @param  [type]     $types_arr [description]
	 * @return [type]                [description]
	 * @author ken
	 * @date   2017-01-09
	 */
	public function get_article_list($types_arr){
		$article_lists = [];
		// 文章字段
		$field = [
			'id',
            'title',
            'comments',
            'views',
            'add_time',
            'votes',
            'title_fulltext',
            'category_id',
            'is_recommend',
            'sort',
            'column_id',
            'special_id',
            'article_cover_url',
            'parent_column_id',
            'fav_num'
		];
		foreach ($types_arr as $k => $v) {
			// 文章列表
			$article_list_key = 'article_list_'.$k.'_list';
			if(!($article_list = AWS_APP::cache()->get($article_list_key))) {
	            $where = $v['where'];
				$order = $v['order'];
				$article_list = $this->model('article')->select_article($field, $where, $order, $limit=6);
				// 格式化时间
				foreach ($article_list as $key => $value) {
					$article_list[$key]['add_date'] = H::get_time($value['add_time'], time());
				}
				AWS_APP::cache()->set($article_list_key, $article_list, $this->cache_time_normal);
			}
			$article_lists[$k] = $article_list;
		}
		return $article_lists;
	}
}
