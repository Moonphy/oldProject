<?php

if (! defined('IN_ANWSION'))
{
	die();
}

class column extends AWS_ADMIN_CONTROLLER
{
	public function setup()
	{
		TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(310));
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
				'url' => get_js_url('/admin/column/list/' . implode('__', $param))
			), 1, null));
		}

		// 初始where条件
		$where = array("is_del = 0");

		if ($_GET['keyword'])
		{
			$where[] = "(`title` LIKE '%" . $this->model('article')->quote($_GET['keyword']) . "%')";
		}

		if ($_GET['start_date'])
		{
			$where[] = 'add_time >= ' . strtotime(base64_decode($_GET['start_date']));
		}

		if ($_GET['end_date'])
		{
			$where[] = 'add_time <= ' . strtotime('+1 day', strtotime(base64_decode($_GET['end_date'])));
		}

		if ($column_list = $this->model('column')->fetch_page('column', implode(' AND ', $where), 'sort DESC,id DESC', $_GET['page'], $this->per_page, false))
		{
			$search_column_total = $this->model('column')->found_rows();
		}

		foreach ($column_list as $key => $value) {
			$column_list[$key]['parent_column_title'] = '无';
		}

		// 父栏目
		$column_parent_list = $this->model('column')->select_column($field, 'parent_id = 0 AND is_del = 0');
		foreach ($column_list as $key => $value) {
			foreach ($column_parent_list as $k => $v) {
				if($value['parent_id'] == $v['id']){
					$column_list[$key]['parent_column_title'] = $v['title'];
				}
			}
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
			'base_url' => get_js_url('/admin/column/list/') . implode('__', $url_param),
			'total_rows' => $search_column_total,
			'per_page' => $this->per_page
		))->create_links());

		$this->crumb(AWS_APP::lang()->_t('文章栏目管理'), 'admin/column/list/');

		TPL::assign('column_count', $search_column_total);
		TPL::assign('list', $column_list);

		TPL::output('admin/column/list');
	}

	/**
	 * [add_column_action 添加栏目]
	 * @author ken
	 * @date   2016-12-27
	 */
	public function add_column_action(){
		// 获取当前栏目信息
		$field = ['id', 'title', 'parent_id'];
		$parent_column_info = $this->model('column')->select_column($field, 'parent_id = 0 AND is_del != 1');

		TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(310));
		TPL::assign('parent_column_info', $parent_column_info);

		TPL::output('admin/column/add');
	}

	/**
	 * [column_add_action 保存添加栏目数据]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-12-27
	 */
	public function column_add_action(){
		$id = $_POST['id'];

		$data = [];

		$filter_arr = [
			'title',
			'seo_title',
			'column_description',
			'parent_id',
			'is_show'
		];

		foreach ($filter_arr as $val) {
			if($_POST[$val] != ''){
				$data[$val] = $_POST[$val];
			}else{
				H::ajax_json_output(AWS_APP::RSM(array(
					'url' => get_js_url('/admin/column/add_column/' . implode('__', $param))), 11001, '请填写完整信息'
				));
			}

			$data['column_link'] = $_POST['column_link'];
		}

		$item_type = 'column';

		if(!empty($_FILES['column_cover']['name'])) {
			AWS_APP::upload()->initialize(array(
	            'allowed_types' => get_setting('allowed_upload_types'),
	            'upload_path' => get_setting('upload_dir') . '/'.$item_type.'/' . gmdate('Ymd'),
	            'is_image' => FALSE,
	            'max_size' => get_setting('upload_size_limit')
	        ))->do_upload('column_cover');

	        if (AWS_APP::upload()->get_error())
	        {
	            switch (AWS_APP::upload()->get_error())
	            {
	                default:
	                	return AWS_APP::RSM('',11003, '错误代码:'.AWS_APP::upload()->get_error());
	                    //die("{'error':'错误代码: " . AWS_APP::upload()->get_error() . "'}");
	                break;

	                case 'upload_invalid_filetype':
	                	return AWS_APP::RSM('',11003, '文件类型无效');
	                    //die("{'error':'文件类型无效'}");
	                break;

	                case 'upload_invalid_filesize':
	                	return AWS_APP::RSM('',11003, '文件尺寸过大, 最大允许尺寸为 ' . get_setting('upload_size_limit') .  ' KB');
	                    //die("{'error':'文件尺寸过大, 最大允许尺寸为 " . get_setting('upload_size_limit') .  " KB'}");
	                break;
	            }
	        }

	        if (! $upload_data = AWS_APP::upload()->data())
	        {
	        	return AWS_APP::RSM('', 10004, '上传失败, 请与开发人员联系');
	        }

	        if ($upload_data['is_image'] == 1)
	        {
	            foreach (AWS_APP::config()->get('image')->specialist_thumbnail AS $key => $val)
	            {
	                $thumb_file[$key] = $upload_data['file_path'] . $key . '_' . basename($upload_data['full_path']);

	                AWS_APP::image()->initialize(array(
	                    'quality' => 90,
	                    'source_image' => $upload_data['full_path'],
	                    'new_image' => $thumb_file[$key],
	                    'width' => $val['w'],
	                    'height' => $val['h']
	                ))->resize();
	            }
	        }

	        $attach_id = $this->model('publish')->add_attach($item_type, $upload_data['orig_name'], $_GET['attach_access_key'], time(), basename($upload_data['full_path']), $upload_data['is_image']);

	        $attach_info = $this->model('publish')->get_attach_by_id($attach_id);

	        if(!empty($attach_info['attachment'])) {
	        	$data['column_cover_url']	= str_replace(get_setting('upload_url'), '', $attach_info['attachment']);
	        }
	    }

	    // 上传文件时文字乱码转码
	    if(!empty($_FILES['column_cover']['name'])){
	    	$data = file_upload_iconv($data);
	    }
	    // H::p($data);

		if($data) {
			$data['add_time']	= TIMESTAMP;

			$this->model('column')->add_column($data);

			H::ajax_json_output(AWS_APP::RSM(array(
				'url' => get_js_url('/admin/column/list/' . implode('__', $param))
			), 1, '已添加'));
		}

		H::ajax_json_output(AWS_APP::RSM(array(
				'url' => get_js_url('/admin/column/list/' . implode('__', $param))
			), 1, '添加失败'));
	}

	/**
	 * [edit_column_action 栏目编辑]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-12-26
	 */
	public function edit_column_action() {
		$column_id = $_GET['id'];

		// 获取当前栏目信息
		$column_info = $this->model('column')->get_column_by_id($column_id);

		// 获取父级栏目数据
		$field = ['id', 'title', 'parent_id'];
		$all_parent_column_info = $this->model('column')->select_column($field, 'parent_id = 0');
		foreach ($all_parent_column_info as $key => $value) {
			if ($value['id'] != $column_id) {
				$parent_column_info[$key] = $value;
			}
		}

		TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(310));
		TPL::assign('column_info', $column_info);
		TPL::assign('parent_column_info', $parent_column_info);

		TPL::output('admin/column/edit');
	}

	/**
	 * [update_column_action 更新栏目数据]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-12-27
	 */
	public function update_column_action() {

		$id = $_POST['id'];

		$data = [];

		$filter_arr = [
			'id',
			'title',
			'seo_title',
			'column_description',
			'parent_id',
			'is_show'
		];

		foreach ($filter_arr as $val) {
			if($_POST[$val] != ''){
				$data[$val] = $_POST[$val];
			}else{
				H::ajax_json_output(AWS_APP::RSM(array(
					'url' => get_js_url("/admin/column/edit_column/$id" . implode('__', ["id=$column_id"]))), 11001, '请填写完整信息'
				));
			}

			$data['column_link'] = $_POST['column_link'];
		}

		$item_type = 'column';

		if(!empty($_FILES['column_cover']['name'])) {
			AWS_APP::upload()->initialize(array(
	            'allowed_types' => get_setting('allowed_upload_types'),
	            'upload_path' => get_setting('upload_dir') . '/'.$item_type.'/' . gmdate('Ymd'),
	            'is_image' => FALSE,
	            'max_size' => get_setting('upload_size_limit')
	        ))->do_upload('column_cover');

	        if (AWS_APP::upload()->get_error())
	        {
	            switch (AWS_APP::upload()->get_error())
	            {
	                default:
	                	return AWS_APP::RSM('',11003, '错误代码:'.AWS_APP::upload()->get_error());
	                    //die("{'error':'错误代码: " . AWS_APP::upload()->get_error() . "'}");
	                break;

	                case 'upload_invalid_filetype':
	                	return AWS_APP::RSM('',11003, '文件类型无效');
	                    //die("{'error':'文件类型无效'}");
	                break;

	                case 'upload_invalid_filesize':
	                	return AWS_APP::RSM('',11003, '文件尺寸过大, 最大允许尺寸为 ' . get_setting('upload_size_limit') .  ' KB');
	                    //die("{'error':'文件尺寸过大, 最大允许尺寸为 " . get_setting('upload_size_limit') .  " KB'}");
	                break;
	            }
	        }

	        if (! $upload_data = AWS_APP::upload()->data())
	        {
	        	return AWS_APP::RSM('', 10004, '上传失败, 请与开发人员联系');
	           // die("{'error':'上传失败, 请与管理员联系'}");
	        }

	        if ($upload_data['is_image'] == 1)
	        {
	            foreach (AWS_APP::config()->get('image')->specialist_thumbnail AS $key => $val)
	            {
	                $thumb_file[$key] = $upload_data['file_path'] . $key . '_' . basename($upload_data['full_path']);

	                AWS_APP::image()->initialize(array(
	                    'quality' => 90,
	                    'source_image' => $upload_data['full_path'],
	                    'new_image' => $thumb_file[$key],
	                    'width' => $val['w'],
	                    'height' => $val['h']
	                ))->resize();
	            }
	        }

	        $attach_id = $this->model('publish')->add_attach_with_item_id($item_type, $column_id, $upload_data['orig_name'], $_GET['attach_access_key'], time(), basename($upload_data['full_path']), $upload_data['is_image']);

	        $attach_info = $this->model('publish')->get_attach_by_id($attach_id);

	        if(!empty($attach_info['attachment'])) {
	        	$data['column_cover_url']	= str_replace(get_setting('upload_url'), '', $attach_info['attachment']);
	        }
	    }

	    // 上传文件时文字乱码转码
	    if(!empty($_FILES['column_cover']['name'])){
	    	$data = file_upload_iconv($data);
	    }
	    // H::p($data);

		if($data) {
			$data['update_time']	= TIMESTAMP;

			// 当前栏目
			$column_info = $this->model('column')->get_column_by_id($id);
			$parent_column_id = $column_info['parent_id'];
			// 若当前栏目为二级栏目修改成一级栏目时，column_id所属文章的column_id及parent_column_id清零
			if($data['parent_id'] == 0){
				if ($parent_column_id != 0) {
					// 所有在此栏目下的column_id和隶属的parent_column_id清零
					$data_article = ['column_id'=>0,'parent_column_id'=>0];
					$where = "column_id = $id";
					$this->model('article')->update_article_where($data_article,$where);
				}
			}else{
				// 若当前栏目为父栏目并修改成二级栏目时，其下原有的二级栏目全部变为一级栏目
				if ($parent_column_id == 0) {
					$this->model('column')->update_column(['parent_id'=>0], "`parent_id`='{$id}'");
				}
			}

			$this->model('column')->update_column($data, "`id`='{$id}'");

			H::ajax_json_output(AWS_APP::RSM(array(
				'url' => get_js_url('/admin/column/list/' . implode('__', $param))
			), 1, '已更新'));
		}

		H::ajax_json_output(AWS_APP::RSM(array(
				'url' => get_js_url('/admin/column/list/' . implode('__', $param))
			), 1, '更新失败'));
	}

	/**
	 * [column_article_list_action 栏目文章列表]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-12-28
	 */
	public function column_article_list_action(){

		$id = $_GET['id'];
		$url_param = ['id-'.$id];

		$page 	= max((int)$_GET['page'], 1);
		$limit 	= $this->per_page;
		$offset	= ($page-1) * $limit;

		// 查询栏目下的文章
		$where = [
			'column_id ='.$id
		];
		$field = 'aws_article.id as article_id,aws_article.title as article_title,aws_column.title as column_title,special_title';

		$articles_list = $this->model('article')->select_article_column_special(implode(' AND ', $where), $field, $limit, $offset);

		$articles_total = $this->model('article')->count_article(implode(' AND ', $where));

		// 查询专题
		$special_list = $this->model('special')->select_special(['id','special_title']);

		TPL::assign('pagination', AWS_APP::pagination()->initialize(array(
			'base_url' => get_js_url('/admin/column/column_article_list/') . implode('__', $url_param),
			'total_rows' =>	$articles_total,
			'per_page' => $this->per_page
		))->create_links());

		// title
		$this->crumb(AWS_APP::lang()->_t('栏目文章管理'), 'admin/column/column_article_list/');

		TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(310));
		TPL::assign('article_count',$articles_total);
		TPL::assign('special_list',$special_list);
		TPL::assign('list', $articles_list);

		TPL::output('admin/column/column_article_list');
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
		$field = 'aws_article.id as article_id,aws_article.title as article_title,aws_column.title as column_title,special_title';

		$articles_list = $this->model('article')->select_article_column_special('', $field, $limit, $offset, 'aws_article.add_time DESC');

		$articles_total = $this->model('article')->count_article();

		// 查询非一级栏目
		$column_list = $this->model('column')->select_column(['id','title'], 'parent_id != 0 AND is_del = 0');

		TPL::assign('pagination', AWS_APP::pagination()->initialize(array(
			'base_url' => get_js_url('/admin/column/article_list/') . implode('__', $url_param),
			'total_rows' =>	$articles_total,
			'per_page' => $this->per_page
		))->create_links());

		// title
		$this->crumb(AWS_APP::lang()->_t('栏目文章管理'), 'admin/column/article_list/');

		TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(310));
		TPL::assign('article_count',$articles_total);
		TPL::assign('column_list',$column_list);
		TPL::assign('list', $articles_list);

		TPL::output('admin/column/article_list');
	}
}