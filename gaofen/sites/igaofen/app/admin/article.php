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

if (! defined('IN_ANWSION'))
{
	die();
}

class article extends AWS_ADMIN_CONTROLLER
{
	public function setup()
	{
		TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(309));
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
				'url' => get_js_url('/admin/article/list/' . implode('__', $param))
			), 1, null));
		}


		$where = array();

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

		if ($_GET['user_name'])
		{
			$user_info = $this->model('account')->get_user_info_by_username($_GET['user_name']);

			$where[] = 'uid = ' . intval($user_info['uid']);
		}

		if ($_GET['comment_count_min'])
		{
			$where[] = 'comments >= ' . intval($_GET['comment_count_min']);
		}

		if ($_GET['answer_count_max'])
		{
			$where[] = 'comments <= ' . intval($_GET['comment_count_max']);
		}

		if ($articles_list = $this->model('article')->fetch_page('article', implode(' AND ', $where), 'sort DESC,id DESC', $_GET['page'], $this->per_page))
		{
			$search_articles_total = $this->model('article')->found_rows();
		}

		if ($articles_list)
		{
			foreach ($articles_list AS $key => $val)
			{
				$articles_list_uids[$val['uid']] = $val['uid'];
			}

			if ($articles_list_uids)
			{
				$articles_list_user_infos = $this->model('account')->get_user_info_by_uids($articles_list_uids);
			}

			foreach ($articles_list AS $key => $val)
			{
				$articles_list[$key]['user_info'] = $articles_list_user_infos[$val['uid']];
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
			'base_url' => get_js_url('/admin/article/list/') . implode('__', $url_param),
			'total_rows' => $search_articles_total,
			'per_page' => $this->per_page
		))->create_links());

		$this->crumb(AWS_APP::lang()->_t('文章管理'), 'admin/article/list/');

		TPL::assign('articles_count', $search_articles_total);
		TPL::assign('list', $articles_list);

		TPL::output('admin/article/list');
	}


	public function edit_action(){
		if($_GET['id']){
			$id = $_GET['id'];
		}else{
			HTTP::redirect('/admin/article/list/');
		}

		$article_info = $this->model('article')->get_article_info_by_id($id);
		$this->crumb(AWS_APP::lang()->_t('文章编辑'), 'admin/article/edit/');

		TPL::assign('article_info', $article_info);
		TPL::output('admin/article/edit_article');
	}


	public function update_article_action(){
		$id = $_POST['id'];

		$data = [];

		

		$item_type = 'article';

		if(!empty($_FILES['article_cover']['name'])) {
			AWS_APP::upload()->initialize(array(
	            'allowed_types' => get_setting('allowed_upload_types'),
	            'upload_path' => get_setting('upload_dir') . '/'.$item_type.'/' . gmdate('Ymd'),
	            'is_image' => FALSE,
	            'max_size' => get_setting('upload_size_limit')
	        ))->do_upload('article_cover');

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

	        $attach_id = $this->model('publish')->add_attach_with_item_id($item_type, $id, $upload_data['orig_name'], $_GET['attach_access_key'], time(), basename($upload_data['full_path']), $upload_data['is_image']);

	        $attach_info = $this->model('publish')->get_attach_by_id($attach_id);

	        if(!empty($attach_info['attachment'])) {
	        	$data['article_cover_url']	= str_replace(get_setting('upload_url'), '', $attach_info['attachment']);
	        }
	    }

	    // 上传文件时文字乱码转码
	    if(!empty($_FILES['article_cover']['name'])){
	    	$data = file_upload_iconv($data);
	    }
	    // H::p($data);

		if($data) {

			$this->model('article')->update_article_id($data, $id);

			H::ajax_json_output(AWS_APP::RSM(array(
				'url' => get_js_url('/admin/article/list/' . implode('__', $param))
			), 1, '已更新'));
		}

		H::ajax_json_output(AWS_APP::RSM(array(
				'url' => get_js_url('/admin/article/list/' . implode('__', $param))
			), 1, '更新失败'));
	}
}