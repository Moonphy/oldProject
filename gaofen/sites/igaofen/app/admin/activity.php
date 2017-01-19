<?php

if (! defined('IN_ANWSION'))
{
	die();
}

class activity extends AWS_ADMIN_CONTROLLER
{
	public function setup()
	{
		TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(315));
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
				'url' => get_js_url('/admin/activity/list/' . implode('__', $param))
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

		if ($activity_list = $this->model('activity')->fetch_page('activity', implode(' AND ', $where), 'id DESC', $_GET['page'], $this->per_page, false))
		{
			$search_activity_total = $this->model('activity')->found_rows();
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
			'base_url' => get_js_url('/admin/activity/list/') . implode('__', $url_param),
			'total_rows' => $search_activity_total,
			'per_page' => $this->per_page
		))->create_links());

		$this->crumb(AWS_APP::lang()->_t('年龄段管理'), 'admin/activity/list/');

		TPL::assign('activity_count', $search_activity_total);
		TPL::assign('list', $activity_list);

		TPL::output('admin/activity/list');
	}

	/**
	 * [add_activity_action 添加年龄段]
	 * @author ken
	 * @date   2016-12-27
	 */
	public function add_activity_action(){
		// 获取当前年龄段信息
		$field = ['id', 'title'];
		$parent_activity_info = $this->model('activity')->select_activity($field, 'is_del != 1');

		TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(315));

		TPL::output('admin/activity/add');
	}

	/**
	 * [activity_add_action 保存添加年龄段数据]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-12-27
	 */
	public function activity_add_action(){
		$id = $_POST['id'];

		$data = [];

		$filter_arr = [
			'title',
			'link',
			'is_show'
		];

		foreach ($filter_arr as $val) {
			if($_POST[$val] != ''){
				$data[$val] = $_POST[$val];
			}else{
				H::ajax_json_output(AWS_APP::RSM(array(
					'url' => get_js_url('/admin/activity/add_activity/' . implode('__', $param))), 11001, '请填写完整信息'
				));
			}
		}

		$item_type = 'activity';

		if(!empty($_FILES['activity_cover']['name'])) {
			AWS_APP::upload()->initialize(array(
	            'allowed_types' => get_setting('allowed_upload_types'),
	            'upload_path' => get_setting('upload_dir') . '/'.$item_type.'/' . gmdate('Ymd'),
	            'is_image' => FALSE,
	            'max_size' => get_setting('upload_size_limit')
	        ))->do_upload('activity_cover');

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
	        	$data['activity_cover_url']	= str_replace(get_setting('upload_url'), '', $attach_info['attachment']);
	        }
	    }

	    // 上传文件时文字乱码转码
	    if(!empty($_FILES['activity_cover']['name'])){
	    	$data = file_upload_iconv($data);
	    }

		if($data) {
			$data['add_time']	= TIMESTAMP;

			$this->model('activity')->add_activity($data);

			H::ajax_json_output(AWS_APP::RSM(array(
				'url' => get_js_url('/admin/activity/list/' . implode('__', $param))
			), 1, '已添加'));
		}

		H::ajax_json_output(AWS_APP::RSM(array(
				'url' => get_js_url('/admin/activity/list/' . implode('__', $param))
			), 1, '添加失败'));
	}

	/**
	 * [edit_activity_action 年龄段编辑]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-12-26
	 */
	public function edit_activity_action() {
		$activity_id = $_GET['id'];

		// 获取当前年龄段信息
		$activity_info = $this->model('activity')->get_activity_by_id($activity_id);

		TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(315));
		TPL::assign('activity_info', $activity_info);
		TPL::assign('parent_activity_info', $parent_activity_info);

		TPL::output('admin/activity/edit');
	}

	/**
	 * [update_activity_action 更新年龄段数据]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-12-27
	 */
	public function update_activity_action() {

		$id = $_POST['id'];

		$data = [];

		$filter_arr = [
			'title',
			'link',
			'is_show'
		];

		foreach ($filter_arr as $val) {
			if($_POST[$val] != ''){
				$data[$val] = $_POST[$val];
			}else{
				H::ajax_json_output(AWS_APP::RSM(array(
					'url' => get_js_url('/admin/activity/edit_activity/' . implode('__', ["id=$activity_id"]))), 11001, '请填写完整信息'
				));
			}
		}

		$item_type = 'activity';

		if(!empty($_FILES['activity_cover']['name'])) {
			AWS_APP::upload()->initialize(array(
	            'allowed_types' => get_setting('allowed_upload_types'),
	            'upload_path' => get_setting('upload_dir') . '/'.$item_type.'/' . gmdate('Ymd'),
	            'is_image' => FALSE,
	            'max_size' => get_setting('upload_size_limit')
	        ))->do_upload('activity_cover');

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
	        	$data['activity_cover_url']	= str_replace(get_setting('upload_url'), '', $attach_info['attachment']);
	        }
	    }

	    // 上传文件时文字乱码转码
	    if(!empty($_FILES['activity_cover']['name'])){
	    	$data = file_upload_iconv($data);
	    }

		if($data) {

			$data['update_time']	= TIMESTAMP;

			$this->model('activity')->update_activity($data, "`id`='{$id}'");

			H::ajax_json_output(AWS_APP::RSM(array(
				'url' => get_js_url('/admin/activity/list/' . implode('__', $param))
			), 1, '已更新'));
		}

		H::ajax_json_output(AWS_APP::RSM(array(
				'url' => get_js_url('/admin/activity/list/' . implode('__', $param))
			), 1, '更新失败'));
	}
}