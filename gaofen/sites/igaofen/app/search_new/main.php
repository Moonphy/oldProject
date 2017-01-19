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
		$rule_action['rule_type'] = "white";

		if ($this->user_info['permission']['search_avail'] AND $this->user_info['permission']['visit_site'])
		{
			$rule_action['rule_type'] = "black"; //'black'黑名单,黑名单中的检查  'white'白名单,白名单以外的检查
			$rule_action['actions'][] = 'search_page';
		}

		$rule_action['actions'] = array();

		return $rule_action;
	}

	public function setup()
	{
		HTTP::no_cache_header();

		$this->crumb(AWS_APP::lang()->_t('搜索'), '/search_new/');
	}

	public function index_action()
	{
		if ($_POST['q'])
		{
			$url = '/search_new/q-' . base64_encode($_POST['q']);

			if ($_GET['is_recommend'])
			{
				$url .= '__is_recommend-1';
			}

			HTTP::redirect($url);
		}

		$keyword = htmlspecialchars(base64_decode($_GET['q']));

		$this->crumb($keyword, '/search_new/q-' . urlencode($keyword));

		if (!$keyword)
		{
			HTTP::redirect('/');
		}


		if ($_GET['page']) {
			// 页码
			$page=max((int)$_GET['page'],1);
			$limit=8;
			$offset=($page-1)*$limit;

			$list_info = $this->search_page_action($keyword, $page, $limit ,$offset);

			H::ajax_json_output(AWS_APP::RSM($list_info, 1, null));
		}

		// 搜索栏地址
		if (!$_GET['type'] || $_GET['type']=='article') {
			$current_url = base_url().'/search_new/q-'.$_GET['q'].'__type-article';
		}elseif($_GET['type']=='special'){
			$current_url = base_url().'/search_new/q-'.$_GET['q'].'__type-special';
		}elseif($_GET['type']=='question'){
			$current_url = base_url().'/search_new/q-'.$_GET['q'].'__type-question';
		}else{
			$current_url = base_url().'/search_new/q-'.$_GET['q'];
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

		if(!$_GET['type'] || $_GET['type']=='article'){
			// 查询文章
			$field = [
				'id',
	            'title',
	            'comments',
	            'views',
	            'add_time',
	            'has_attach',
	            'votes',
	            'category_id',
	            'is_recommend',
	            'sort',
	            'column_id',
	            'special_id',
	            'article_cover_url',
	            'parent_column_id',
	            'fav_num'
			];
			// 最新文章列表
            $where = "title like '%$keyword%'";
			if (!$_GET['sort'] || $_GET['sort']=='new') {
            	$order = 'add_time DESC';
            }else{
            	$order = 'views DESC,add_time DESC';
            }
			$list_info = $this->model('article')->select_article($field, $where, $order, $limit=8);
			// 格式化时间
			foreach ($list_info as $key => $value) {
				$list_info[$key]['add_date'] = H::get_time($value['add_time'], time());
			}

			// 统计文章总数
			$count = $this->model('article')->count_article($where);
			TPL::assign('count', $count);

		}else if($_GET['type']=='special'){
			// 专题
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
			// 最新专题列表
            $where = "special_title like '%$keyword%'";
            if (!$_GET['sort'] || $_GET['sort']=='new') {
            	$order = 'add_time DESC';
            }else{
            	$order = 'add_time DESC';
            }
			$list_info = $this->model('special')->select_special($special_field, $where, $order, $limit=8);
			
			// 统计专题总数
			$count = $this->model('special')->count_special($where);
			TPL::assign('count', $count);

		}else if($_GET['type']=='question'){
			// 查询问题
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
	            'sort'
	        ];
	        // 问题
            $where = "question_content like '%$keyword%'";
            if (!$_GET['sort'] || $_GET['sort']=='new') {
            	$order = 'add_time DESC';
            }else{
            	$order = 'answer_count DESC,add_time DESC';
            }
			$list_info = $this->model('question')->select_question($question_field, $where, $order, $limit=8);
			// 格式化时间
			foreach ($list_info as $key => $value) {
				$list_info[$key]['add_date'] = H::get_time($value['add_time'], time());
			}

			// 统计问题总数
			$count = $this->model('question')->count_question($where);
			TPL::assign('count', $count);
		}

		// 当前完整url
		$whole_url = 'http://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];

		TPL::assign('list_info', $list_info);
		TPL::assign('column_list', $column_list);
		TPL::assign('current_url', $current_url);
		TPL::assign('whole_url', $whole_url);
		TPL::assign('keyword', $keyword);
		TPL::assign('split_keyword', implode(' ', $this->model('system')->analysis_keyword($keyword)));
		TPL::output('search_new/index');
	}

	public function search_page_action($keyword, $page, $limit ,$offset){
		if(!$_GET['type'] || $_GET['type']=='article'){
			// 查询文章
			$field = [
				'id',
	            'title',
	            'comments',
	            'views',
	            'add_time',
	            'has_attach',
	            'votes',
	            'category_id',
	            'is_recommend',
	            'sort',
	            'column_id',
	            'special_id',
	            'article_cover_url',
	            'parent_column_id',
	            'fav_num'
			];
			// 最新文章列表
            $where = "title like '%$keyword%'";
			if (!$_GET['sort'] || $_GET['sort']=='new') {
            	$order = 'add_time DESC';
            }else{
            	$order = 'views DESC,add_time DESC';
            }
			$list_info = $this->model('article')->select_article($field, $where, $order, $limit, $offset);
			// 格式化时间
			foreach ($list_info as $key => $value) {
				$list_info[$key]['add_date'] = H::get_time($value['add_time'], time());
			}

		}else if($_GET['type']=='special'){
			// 专题
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
			// 最新专题列表
            $where = "special_title like '%$keyword%'";
            if (!$_GET['sort'] || $_GET['sort']=='new') {
            	$order = 'add_time DESC';
            }else{
            	$order = 'add_time DESC';
            }
			$list_info = $this->model('special')->select_special($special_field, $where, $order, $limit, $offset);

		}else if($_GET['type']=='question'){
			// 查询问题
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
	            'sort'
	        ];
	        // 问题
            $where = "question_content like '%$keyword%'";
            if (!$_GET['sort'] || $_GET['sort']=='new') {
            	$order = 'add_time DESC';
            }else{
            	$order = 'answer_count DESC,add_time DESC';
            }
			$list_info = $this->model('question')->select_question($question_field, $where, $order, $limit, $offset);
			// 格式化时间
			foreach ($list_info as $key => $value) {
				$list_info[$key]['add_date'] = H::get_time($value['add_time'], time());
			}

		}
		return $list_info;
	}
}