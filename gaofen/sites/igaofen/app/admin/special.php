<?php

if (! defined('IN_ANWSION'))
{
	die();
}

class special extends AWS_ADMIN_CONTROLLER
{
	public function setup()
	{
		TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(311));
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
				'url' => get_js_url('/admin/special/list/' . implode('__', $param))
			), 1, null));
		}

		// 初始where条件
		$where = array("is_del = 0");

		if ($_GET['keyword'])
		{
			$where[] = "(`special_title` LIKE '%" . $this->model('special')->quote($_GET['keyword']) . "%')";
		}

		if ($_GET['start_date'])
		{
			$where[] = 'add_time >= ' . strtotime(base64_decode($_GET['start_date']));
		}

		if ($_GET['end_date'])
		{
			$where[] = 'add_time <= ' . strtotime('+1 day', strtotime(base64_decode($_GET['end_date'])));
		}

		if ($special_list = $this->model('special')->fetch_page('special', implode(' AND ', $where), 'sort DESC,id DESC', $_GET['page'], $this->per_page, false))
		{
			$search_special_total = $this->model('special')->found_rows();
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
			'base_url' => get_js_url('/admin/special/list/') . implode('__', $url_param),
			'total_rows' => $search_special_total,
			'per_page' => $this->per_page
		))->create_links());

		$this->crumb(AWS_APP::lang()->_t('文章栏目管理'), 'admin/special/list/');

		TPL::assign('special_count', $search_special_total);
		TPL::assign('list', $special_list);

		TPL::output('admin/special/list');
	}


	/**
	 * [add_special_action 添加栏目]
	 * @author ken
	 * @date   2016-12-27
	 */
	public function add_special_action(){

		TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(311));
		TPL::assign('parent_special_info', $parent_special_info);

		TPL::output('admin/special/add');
	}

	/**
	 * [special_add_action 保存添加栏目数据]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-12-27
	 */
	public function special_add_action(){
		$id = $_POST['id'];

		$data = [];

		$filter_arr = [
			'special_title' => '专题名称',
			'special_seo_title' => 'seo标题',
			'special_description' => '专题描述',
			'is_show' => '是否前台显示'
		];

		foreach ($filter_arr as $key => $val) {
			if($_POST[$key] != ''){
				$data[$key] = $_POST[$key];
			}else{
				H::ajax_json_output(AWS_APP::RSM(array(
					'url' => get_js_url('/admin/special/add_special/' . implode('__', $param))), 11001, '请填写'.$val
				));
			}

			$data['special_link'] = $_POST['special_link'];
			$data['is_recommend'] = $_POST['is_recommend'];
		}

		$item_type = 'special';

		if(!empty($_FILES['special_cover']['name'])) {
			AWS_APP::upload()->initialize(array(
	            'allowed_types' => get_setting('allowed_upload_types'),
	            'upload_path' => get_setting('upload_dir') . '/'.$item_type.'/' . gmdate('Ymd'),
	            'is_image' => FALSE,
	            'max_size' => get_setting('upload_size_limit')
	        ))->do_upload('special_cover');

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
	        	$data['special_cover_url']	= str_replace(get_setting('upload_url'), '', $attach_info['attachment']);
	        }
	    }

	    // 上传文件时文字乱码转码
	    if(!empty($_FILES['special_cover']['name'])){
	    	$data = file_upload_iconv($data);
	    }
	    // H::p($data);

		if($data) {
			$data['add_time']	= TIMESTAMP;

			$this->model('special')->add_special($data);

			H::ajax_json_output(AWS_APP::RSM(array(
				'url' => get_js_url('/admin/special/list/' . implode('__', $param))
			), 1, '已添加'));
		}

		H::ajax_json_output(AWS_APP::RSM(array(
				'url' => get_js_url('/admin/special/list/' . implode('__', $param))
			), 1, '添加失败'));
	}

	/**
	 * [edit_special_action 栏目编辑]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-12-26
	 */
	public function edit_special_action() {
		$special_id = $_GET['id'];

		// 获取当前栏目信息
		$special_info = $this->model('special')->get_special_by_id($special_id);

		TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(311));
		TPL::assign('special_info', $special_info);
		TPL::assign('parent_special_info', $parent_special_info);

		TPL::output('admin/special/edit');
	}

	/**
	 * [update_special_action 更新栏目数据]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-12-27
	 */
	public function update_special_action() {

		$id = $_POST['id'];

		$data = [];

		$filter_arr = [
			'special_title' => '专题名称',
			'special_seo_title' => 'seo标题',
			'special_description' => '专题描述',
			'is_show' => '是否前台显示'
		];

		foreach ($filter_arr as $key => $val) {
			if($_POST[$key] != ''){
				$data[$key] = $_POST[$key];
			}else{
				H::ajax_json_output(AWS_APP::RSM(array(
					'url' => get_js_url('/admin/special/add_special/' . implode('__', $param))), 11001, '请填写'.$val
				));
			}

			$data['special_link'] = $_POST['special_link'];
			$data['is_recommend'] = $_POST['is_recommend'];
		}

		$item_type = 'special';

		if(!empty($_FILES['special_cover']['name'])) {
			AWS_APP::upload()->initialize(array(
	            'allowed_types' => get_setting('allowed_upload_types'),
	            'upload_path' => get_setting('upload_dir') . '/'.$item_type.'/' . gmdate('Ymd'),
	            'is_image' => FALSE,
	            'max_size' => get_setting('upload_size_limit')
	        ))->do_upload('special_cover');

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

	        $attach_id = $this->model('publish')->add_attach_with_item_id($item_type, $special_id, $upload_data['orig_name'], $_GET['attach_access_key'], time(), basename($upload_data['full_path']), $upload_data['is_image']);

	        $attach_info = $this->model('publish')->get_attach_by_id($attach_id);

	        if(!empty($attach_info['attachment'])) {
	        	$data['special_cover_url']	= str_replace(get_setting('upload_url'), '', $attach_info['attachment']);
	        }
	    }

	    // 上传文件时文字乱码转码
	    if(!empty($_FILES['special_cover']['name'])){
	    	$data = file_upload_iconv($data);
	    }
	    // H::p($data);

		if($data) {
			$data['update_time']	= TIMESTAMP;

			$this->model('special')->update_special($data, "`id`='{$id}'");

			H::ajax_json_output(AWS_APP::RSM(array(
				'url' => get_js_url('/admin/special/list/' . implode('__', $param))
			), 1, '已更新'));
		}

		H::ajax_json_output(AWS_APP::RSM(array(
				'url' => get_js_url('/admin/special/list/' . implode('__', $param))
			), 1, '更新失败'));
	}

	/**
	 * [special_article_list_action 栏目文章列表]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-12-28
	 */
	public function special_article_list_action(){

		$id = $_GET['id'];
		$url_param = ['id-'.$id];

		$page 	= max((int)$_GET['page'], 1);
		$limit 	= $this->per_page;
		$offset	= ($page-1) * $limit;

		// 查询栏目下的文章
		$where = [
			'special_id ='.$id
		];
		$field = 'aws_article.id as article_id,aws_article.title as article_title,special_title';

		$articles_list = $this->model('article')->select_article_column_special(implode(' AND ', $where), $field, $limit, $offset);

		$articles_total = $this->model('article')->count_article(implode(' AND ', $where));

		TPL::assign('pagination', AWS_APP::pagination()->initialize(array(
			'base_url' => get_js_url('/admin/special/special_article_list/') . implode('__', $url_param),
			'total_rows' =>	$articles_total,
			'per_page' => $this->per_page
		))->create_links());

		// title
		$this->crumb(AWS_APP::lang()->_t('栏目文章管理'), 'admin/special/special_article_list/');

		TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(310));
		TPL::assign('article_count',$articles_total);
		TPL::assign('list', $articles_list);

		TPL::output('admin/special/special_article_list');
	}

	
}