<?php

if (! defined('IN_ANWSION'))
{
	die();
}

class age extends AWS_ADMIN_CONTROLLER
{
	public function setup()
	{
		TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(313));
	}

	public function list_action()
	{
		if ($this->is_post())
		{
			foreach ($_POST as $key => $val)
			{
				if ($key == 'start_date' OR $key == 'end_date')
				{
					$val = base64_encode($val);
				}

				if ($key == 'keyword' OR $key == 'user_name')
				{
					$val = rawurlencode($val);
				}

				$param[] = $key . '-' . $val;
			}

			H::ajax_json_output(AWS_APP::RSM(array(
				'url' => get_js_url('/admin/age/list/' . implode('__', $param))
			), 1, null));
		}

		// 初始where条件
		$where = array("is_del = 0");

		if ($_GET['keyword'])
		{
			$where[] = "(`name` LIKE '%" . $this->model('article')->quote($_GET['keyword']) . "%')";
		}

		if ($_GET['start_date'])
		{
			$where[] = 'add_time >= ' . strtotime(base64_decode($_GET['start_date']));
		}

		if ($_GET['end_date'])
		{
			$where[] = 'add_time <= ' . strtotime('+1 day', strtotime(base64_decode($_GET['end_date'])));
		}

		if ($age_list = $this->model('age')->fetch_page('age', implode(' AND ', $where), 'id DESC', $_GET['page'], $this->per_page, false))
		{
			$search_age_total = $this->model('age')->found_rows();
		}

		$url_param = array();

		foreach($_GET as $key => $val)
		{
			if (!in_array($key, array('app', 'c', 'act', 'page')))
			{
				$url_param[] = $key . '-' . $val;
			}
		}

		TPL::assign('pagination', AWS_APP::pagination()->initialize(array(
			'base_url' => get_js_url('/admin/age/list/') . implode('__', $url_param),
			'total_rows' => $search_age_total,
			'per_page' => $this->per_page
		))->create_links());

		$this->crumb(AWS_APP::lang()->_t('年龄段管理'), 'admin/age/list/');

		TPL::assign('age_count', $search_age_total);
		TPL::assign('list', $age_list);

		TPL::output('admin/age/list');
	}

	/**
	 * [add_age_action 添加年龄段]
	 * @author ken
	 * @date   2016-12-27
	 */
	public function add_age_action(){
		// 获取当前年龄段信息
		$field = ['id', 'name'];
		$parent_age_info = $this->model('age')->select_age($field, 'is_del != 1');

		TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(313));

		TPL::output('admin/age/add');
	}

	/**
	 * [age_add_action 保存添加年龄段数据]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-12-27
	 */
	public function age_add_action(){
		$id = $_POST['id'];

		$data = [];

		$filter_arr = [
			'name',
		];

		foreach ($filter_arr as $val) {
			if($_POST[$val] != ''){
				$data[$val] = $_POST[$val];
			}else{
				H::ajax_json_output(AWS_APP::RSM(array(
					'url' => get_js_url('/admin/age/add_age/' . implode('__', $param))), 11001, '请填写完整信息'
				));
			}
		}

		if($data) {
			$data['add_time']	= TIMESTAMP;

			$this->model('age')->add_age($data);

			H::ajax_json_output(AWS_APP::RSM(array(
				'url' => get_js_url('/admin/age/list/' . implode('__', $param))
			), 1, '已添加'));
		}

		H::ajax_json_output(AWS_APP::RSM(array(
				'url' => get_js_url('/admin/age/list/' . implode('__', $param))
			), 1, '添加失败'));
	}

	/**
	 * [edit_age_action 年龄段编辑]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-12-26
	 */
	public function edit_age_action() {
		$age_id = $_GET['id'];

		// 获取当前年龄段信息
		$age_info = $this->model('age')->get_age_by_id($age_id);

		TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(313));
		TPL::assign('age_info', $age_info);
		TPL::assign('parent_age_info', $parent_age_info);

		TPL::output('admin/age/edit');
	}

	/**
	 * [update_age_action 更新年龄段数据]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-12-27
	 */
	public function update_age_action() {

		$id = $_POST['id'];

		$data = [];

		$filter_arr = [
			'id',
			'name',
		];

		foreach ($filter_arr as $val) {
			if($_POST[$val] != ''){
				$data[$val] = $_POST[$val];
			}else{
				H::ajax_json_output(AWS_APP::RSM(array(
					'url' => get_js_url('/admin/age/edit_age/' . implode('__', ["id=$age_id"]))), 11001, '请填写完整信息'
				));
			}
		}

		if($data) {
			$data['update_time']	= TIMESTAMP;

			$this->model('age')->update_age($data, "`id`='{$id}'");

			H::ajax_json_output(AWS_APP::RSM(array(
				'url' => get_js_url('/admin/age/list/' . implode('__', $param))
			), 1, '已更新'));
		}

		H::ajax_json_output(AWS_APP::RSM(array(
				'url' => get_js_url('/admin/age/list/' . implode('__', $param))
			), 1, '更新失败'));
	}

	/**
	 * [age_article_list_action 年龄段文章列表]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-12-28
	 */
	public function age_article_list_action(){

		$id = $_GET['id'];
		$url_param = ['id-'.$id];

		$page 	= max((int)$_GET['page'], 1);
		$limit 	= $this->per_page;
		$offset	= ($page-1) * $limit;

		// 查询年龄段下的文章
		$where = [
			'age_id ='.$id
		];
		$field = 'aws_article.id as article_id,aws_article.title as article_title,aws_age.name as age_name';

		$articles_list = $this->model('article')->select_article_age(implode(' AND ', $where), $field, $limit, $offset);

		$articles_total = $this->model('article')->count_article(implode(' AND ', $where));

		TPL::assign('pagination', AWS_APP::pagination()->initialize(array(
			'base_url' => get_js_url('/admin/age/age_article_list/') . implode('__', $url_param),
			'total_rows' =>	$articles_total,
			'per_page' => $this->per_page
		))->create_links());

		// title
		$this->crumb(AWS_APP::lang()->_t('年龄段文章管理'), 'admin/age/age_article_list/');

		TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(313));
		TPL::assign('article_count',$articles_total);
		TPL::assign('list', $articles_list);

		TPL::output('admin/age/age_article_list');
	}

	/**
	 * [article_list_action 文章列表]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-12-28
	 */
	public function article_list_action(){

		$id = $_GET['id'];
		$url_param = ['id-'.$id];

		$page 	= max((int)$_GET['page'], 1);
		$limit 	= $this->per_page;
		$offset	= ($page-1) * $limit;

		// 查询所有文章
		$field = 'aws_article.id as article_id,aws_article.title as article_title,aws_age.name as age_name';

		$articles_list = $this->model('article')->select_article_age('', $field, $limit, $offset, 'aws_article.add_time DESC');

		$articles_total = $this->model('article')->count_article();

		// 查询年龄段
		$age_list = $this->model('age')->select_age(['id','name'], 'is_del = 0');

		TPL::assign('pagination', AWS_APP::pagination()->initialize(array(
			'base_url' => get_js_url('/admin/age/article_list/') . implode('__', $url_param),
			'total_rows' =>	$articles_total,
			'per_page' => $this->per_page
		))->create_links());

		// title
		$this->crumb(AWS_APP::lang()->_t('年龄段文章管理'), 'admin/age/article_list/');

		TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(313));
		TPL::assign('article_count',$articles_total);
		TPL::assign('age_list',$age_list);
		TPL::assign('list', $articles_list);

		TPL::output('admin/age/article_list');
	}
}