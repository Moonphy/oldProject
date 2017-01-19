<?php

class specialist extends AWS_ADMIN_CONTROLLER {

	public function setup()
	{
		
	}

	const APPLY_RECEIVE = 1; //收到回复
    const QUESTION_RECEIVE = 2; //收到提问
    const TOPIC_PUBLISH = 3; //关注专家发布了方法
    const ANSWER_LISTEN = 4; //答案被偷听
    const WITHDRAW = 5; //发起提现
    const WITHDRAW_SUCCESS = 6; //提现成功
    const LEVEL_CHANGE = 7; //等级变化

    private function get_access_token(){
		$weixin_app_id = get_setting('weixin_app_id');
		$weixin_app_secret = get_setting('weixin_app_secret');
		return $this->model('openid_weixin_weixin')->get_access_token($weixin_app_id, $weixin_app_secret);
	}

	// 获取模板消息设置
	private function get_tmp_settings($uid){
		// 获取用户信息
		$gaofen_uinfo=$this->model('gaofen_account')->get_gaofen_user_by_uid($uid);
		// 获取当前模板配置
		return $tmp_settings = $gaofen_uinfo['tmp_settings'];
	}

	private function get_openid($uid){
		$weixin_user_info = $user_info=$this->model('openid_weixin_weixin')->get_user_info_by_uid($uid);
		if(empty($weixin_user_info)){
			return '';
		}
		return $weixin_user_info['openid'];
	}

	/**
	 * 方法列表
	 * @return [type] [description]
	 */
	public function topic_list_action() {
		$page 	= max((int)$_GET['page'], 1);
		$limit 	= 30;
		$offset	= ($page-1) * $limit;

		$category_list 	= $this->model('specialist_topicCategory')->select_category();
		$special_list	= $this->model('specialist_special')->select_special();
		$topic_list 	= $this->model('specialist_topic')->select_topic_with_specialist($limit, $offset, 'add_time DESC');
		$topic_count	= $this->model('specialist_topic')->count_topic();

		
		foreach ($topic_list as $key => $value) {
			$topic_list[$key]['topic_category_id'] = explode(',', $value['topic_category_id']);
		}

		// 拼装分类信息
		foreach ($topic_list as $key => $value) {
			$topic_list[$key]['category_name'] = '';
			foreach ($value['topic_category_id'] as $k => $v) {
				foreach ($category_list as $row) {
					if( $v == $row['id'] ){
						$topic_list[$key]['category_name'] .= $row['category_name'].',';
					}
				}
			}
		}

		// 去除拼装分类后的逗号
		foreach ($topic_list as $key => $value) {
			$topic_list[$key]['category_name'] = rtrim($value['category_name'], ',');
		}

		// H::p($topic_list);

		TPL::assign('topic_list', $topic_list);
		TPL::assign('category_list', array_column($category_list, 'category_name', 'id'));
		TPL::assign('special_list', array_column($special_list, 'special_name', 'id'));

		TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(1100));

		TPL::assign('pagination', AWS_APP::pagination()->initialize(array(
			'base_url' => get_js_url('/admin/specialist/topic_list/') . implode('__', $url_param),
			'total_rows' => $topic_count,
			'per_page' => $limit,
		))->create_links());

		TPL::output('admin/specialist/topic_list');

	}

	/**
	 * 方法编辑
	 * @return [type] [description]
	 */
	public function edit_topic_action() {
		$topic_id = $_GET['id'];

		$topic_info 	= $this->model('specialist_topic')->get_topic_by_id($topic_id);
		$category_list 	= $this->model('specialist_topicCategory')->select_category();
		$special_list	= $this->model('specialist_special')->select_special();

		$topic_info['topic_category_id'] = explode(',', $topic_info['topic_category_id']);
		// H::p($topic_info);

		TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(1100));
		TPL::assign('topic_info', $topic_info);
		TPL::assign('category_list', $category_list);
		// TPL::assign('category_list', array_column($category_list, 'category_name', 'id'));
		TPL::assign('special_list', array_column($special_list, 'special_name', 'id'));

		TPL::output('admin/specialist/topic_edit');
	}

	/**
	 * 更新方法
	 * @return [type] [description]
	 */
	public function update_topic_action() {
		$topic_id 			= $_POST['topic_id'];
		$topic_category_id	= $_POST['topic_category_id'];
		// $special_id			= $_POST['special_id'];
		$topic_cover_url 	= $_POST['topic_cover_url'];
		$topic_name			= $_POST['topic_name'];
		$topic_description	= $_POST['topic_description'];

		$data = [];

		// H::p($_POST);

		if(!empty($topic_category_id)){
			$data['topic_category_id'] = implode(',', $topic_category_id);
		}else{
			$data['topic_category_id'] = 0;
		}
		
		// if(is_numeric($special_id)) {
		// 	$data['special_id']			= $special_id;
		// }

		if($topic_name) {
			$data['topic_name']			= $topic_name;
		}

		if($topic_description) {
			$data['topic_description']	= $topic_description;
		}

		$item_type = 'specialist/cover';

		$topic_info = $this->model('specialist_topic')->get_topic_by_id($topic_id);

		if(!empty($_FILES['topic_cover']['name'])) {
			AWS_APP::upload()->initialize(array(
	            'allowed_types' => get_setting('allowed_upload_types'),
	            'upload_path' => get_setting('upload_dir') . '/'.$item_type.'/' . gmdate('Ymd'),
	            'is_image' => FALSE,
	            'max_size' => get_setting('upload_size_limit')
	        ))->do_upload('topic_cover');

	        if (AWS_APP::upload()->get_error())
	        {
	            switch (AWS_APP::upload()->get_error())
	            {
	                default:
	                	return AWS_APP::RSM('',10003, '错误代码:'.AWS_APP::upload()->get_error());
	                    //die("{'error':'错误代码: " . AWS_APP::upload()->get_error() . "'}");
	                break;

	                case 'upload_invalid_filetype':
	                	return AWS_APP::RSM('',10003, '文件类型无效');
	                    //die("{'error':'文件类型无效'}");
	                break;

	                case 'upload_invalid_filesize':
	                	return AWS_APP::RSM('',10003, '文件尺寸过大, 最大允许尺寸为 ' . get_setting('upload_size_limit') .  ' KB');
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

	        $attach_id = $this->model('publish')->add_attach($item_type, $upload_data['orig_name'], $_GET['attach_access_key'], time(), basename($upload_data['full_path']), $upload_data['is_image']);

	        $attach_info = $this->model('publish')->get_attach_by_id($attach_id);

	        if(!empty($attach_info['attachment'])) {
	        	$data['topic_cover_url']	= str_replace(get_setting('upload_url'), '', $attach_info['attachment']);
	        }
	    }

		if($data) {
			$data['update_time']	= TIMESTAMP;
			$this->model('specialist_topic')->update_topic($data, "`topic_id`='{$topic_id}'");

			if(!empty($topic_info['special_id'])) {
				$special_info = $this->model('specialist_special')->get_special_by_id($topic_info['special_id'], false);

				if($special_info['topic_num']>0) {
					//专辑统计数-1
					$this->model('specialist_special')->calc_by_id_by_field($topic_info['special_id'], 'topic_num', 1, 'decr');
				}
			}

			//专辑统计数+1
			if($special_id) {
				$this->model('specialist_special')->calc_by_id_by_field($special_id, 'topic_num');
			}

			H::ajax_json_output(AWS_APP::RSM(array(
				'url' => get_js_url('/admin/specialist/topic_list/' . implode('__', $param))
			), 1, ''));
		}

		H::ajax_json_output(AWS_APP::RSM(array(
				'url' => get_js_url('/admin/specialist/topic_list/' . implode('__', $param))
			), 1, '更新失败'));
	}


	/**
	 * 提问列表
	 * @return [type] [description]
	 */
	public function question_list_action() {
		$page 	= max((int)$_GET['page'], 1);
		$limit 	= 30;
		$offset	= ($page-1) * $limit;


		$question_list = $this->model('specialist_question')->select_question_answer('', $limit, $offset);
		$specialist_users = $this->model('account')->get_user_info_by_uids(array_column($question_list, 'specialist_uid'));

		TPL::assign('question_list', $question_list);
		TPL::assign('specialist_users', $specialist_users);
		TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(1101));

		TPL::output('admin/specialist/question_list');
	}

	/**
	 * 更新问题
	 * @return [type] [description]
	 */
	public function update_question_action() {
		$question_id 	= $_GET['id'];
		$is_timeout 	= (bool)$_POST['is_timeout'];

		$data['is_timeout'] = $is_timeout;

		$this->model('specialist_question')->update_question($data, "`question_id`='{$question_id}'");

		H::ajax_json_output(AWS_APP::RSM(array(
				'url' => get_js_url('/admin/specialist/question_list/' . implode('__', $param))
			), 1, ''));
	}

	/**
	 * 提现申请列表
	 * @return [type] [description]
	 */
	public function draw_list_action() {

		$type   = (int)$_GET['type'];
		$page 	= max((int)$_GET['page'], 1);
		$uid 	= $_GET['uid'];
		$limit 	= 30;

		if(empty($type) || !in_array($type, [1, 3, 4])) {
			$type = 3;
		}

		$history_draw_list = $this->model('gaofen_reward')->draw_histroy($type, $uid, $page, $limit);
		$uids = [];

		foreach($history_draw_list['list'] as $item) {
			if($item['uid'] && !in_array($item['uid'], $uids)) {
				$uids[] = $item['uid'];
			}

			if($item['op_uid'] && !in_array($item['op_uid'], $uids)) {
				$uids[] = $item['op_uid'];
			}

			if(!empty($item['data']['payer_uid']) && !in_array($item['data']['payer_uid'], $uids)) {
				$uids[] = $item['data']['payer_uid'];
			}
			
		}

		$users =[];
		if(!empty($uids)) {
			$users = $this->model('account')->get_user_info_by_uids($uids);
		}

		$url_param = ["type=$type"];

		TPL::assign('history_draw_list', $history_draw_list['list']);
		TPL::assign('users', $users);
		TPL::assign('pagination', AWS_APP::pagination()->initialize(array(
			'base_url' => get_js_url('/admin/specialist/draw_list/') . implode('__', $url_param),
			'total_rows' => $history_draw_list['total'],
			'per_page' => $limit,
		))->create_links());
		TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(1102));
		TPL::assign('type', $type);
		TPL::assign('page', $page);
		TPL::output('admin/specialist/draw_list');
	}

	/**
	 * 提现处理
	 * @return [type] [description]
	 */
	public function do_draw_action() {
		$id = (int)$_GET['id'];
		$type = $_POST['type'];
		$page = $_POST['page'];

		$model= $this->model('gaofen_reward');

		$param = ["type={$type}", "page={$page}"];

		$info = $model->get_reward_by_id($id);
		if($info && $info['type']==$model::RW_TYPE_DRAW && empty($info['data']['pay_id'])) {

			$info_user = $this->model('openid_weixin_weixin')->get_user_info_by_uid($info['uid']);
			//支付参数
			$params = [
				'catid'	=> AWS_APP::config()->get('gaofen')->catid,
				'trade_no'	=>$info['id'],
				'openid'	=>$info_user['openid'],
				'amount'	=>$info['money'],
				'desc'		=>'高分专家提现',
				'sign'		=>'specailist',
			];

			//即时企业付款
			$transfers_result = $this->model('gaofen_api')->request('pay:/Auth/WeixinTransfers/transfers', $params);
			if(isset($transfers_result['return_code']) && $transfers_result['return_code']=='SUCCESS') {
				//支付成功todo

				$rs = $model->pay_money($info['uid'], $this->user_id, $info['money']);
				if($rs) {
					$data = is_array($info['data'])?$info['data']:[];
					$data['pay_id'] = $rs;
					$data['trade_no']=$transfers_result['partner_trade_no' ];

					$data2 = ['reward_id'=>$info['id'], 'trade_no'=>$transfers_result['partner_trade_no' ]];

					$model->save(['data'=>$data, 'op_uid'=>$this->user_id], $id);
					$model->save(['data'=>$data2], $rs);

					// 储存及推送模板消息
					$gaofen_user = $this->model('gaofen_account')->get_gaofen_user_by_uid($info['uid']);
					$template_setttings = json_decode($gaofen_user['tmp_settings']);
					$money = $info['money'];
					if($template_setttings->withdraw_success){
						$data = [
							'first' => '提现成功',
							'keyword1' => "提现金额".$money."元已转入微信钱包",
							'keyword2' => '',
							'remark' => '点击查看',
							'url' => get_js_url('/m/specialist/#!/cash'),
						];
						$save_data = [
							'uid' => $info['uid'],
							'message' => json_encode($data),
							'message_type' => self::WITHDRAW_SUCCESS,
							'add_time' => time(),
						];
						$this->model('specialist_template')->add_template($save_data);
						$this->model('openid_weixin_weixin')->temp_send($info_user['openid'], $access_token = $this->get_access_token(), $data, $tmp_type = 'common');
					}

					H::ajax_json_output(AWS_APP::RSM(array('url' => get_js_url('/admin/specialist/draw_list/' . implode('__', $param))), 1, ''));
				}
			}
		}

		H::ajax_json_output(AWS_APP::RSM(array(
				'url' => get_js_url('/admin/specialist/draw_list/' . implode('__', $param))
			), 1, '提现失败，请确认处理状态是否正常！'));
	}

	/**
	 * [topic_tips_list_action 方法提示列表]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-10-24
	 */
	public function topic_tips_list_action(){

		$page 	= max((int)$_GET['page'], 1);
		$limit 	= 30;
		$offset	= ($page-1) * $limit;

		$order = 'update_time DESC';

		$topic_tips_list = $this->model('specialist_topicTips')->select_tips(null, null, $order, $limit, $offset);
		$topic_tips_count	= $this->model('specialist_topicTips')->count_topic_tips();

		TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(1103));
		TPL::assign('topic_tips_list', $topic_tips_list);
		TPL::assign('pagination', AWS_APP::pagination()->initialize(array(
			'base_url' => get_js_url('/admin/specialist/topic_tips_list/') . implode('__', $url_param),
			'total_rows' => $topic_tips_count,
			'per_page' => $limit,
		))->create_links());

		TPL::output('admin/specialist/topic_tips_list');
	}

	/**
	 * [topic_tips_edit_action 编辑方法提示]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-10-24
	 */
	public function topic_tips_edit_action(){
		$topic_tips_id = $_GET['id'];

		$topic_tips_info = $this->model('specialist_topicTips')->get_tips(null, 'id='.$topic_tips_id);
		$category_list = $this->model('specialist_topicCategory')->select_category();

		TPL::assign('category_list', $category_list);
		TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(1103));
		TPL::assign('topic_tips_info', $topic_tips_info);

		// H::p($topic_tips_info);
		TPL::output('admin/specialist/topic_tips_edit');
	}

	/**
	 * [topic_tips_update_action 更新方法提示]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-10-24
	 */
	public function topic_tips_update_action(){
		$topic_tips_id 	= $_POST['topic_tips_id'];
		$topic_tips_name = $_POST['topic_tips_name'];
		$category_id = $_POST['category_id'];

		$update_data = [
			'tips_name' => $topic_tips_name,
			'category_id' =>$category_id,
			'update_time' => time()
		];
		
		$affect = $this->model('specialist_topicTips')->update_tips($update_data, 'id='.$topic_tips_id);

		if($affect){
			H::ajax_json_output(AWS_APP::RSM(array(
				'url' => get_js_url('/admin/specialist/topic_tips_list/' . implode('__', $param))
			), 1, ''));
		}

		H::ajax_json_output(AWS_APP::RSM(array(
				'url' => get_js_url('/admin/specialist/topic_tips_list/' . implode('__', $param))
			), 1, '更新失败'));
	}

	/**
	 * [topic_tips_add_action description]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-10-24
	 */
	public function topic_tips_add_action(){
		$category_list = $this->model('specialist_topicCategory')->select_category();

		TPL::assign('category_list', $category_list);
		TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(1103));
		TPL::output('admin/specialist/topic_tips_add');
	}

	public function topic_tips_create_action(){
		$topic_tips_name = $_POST['topic_tips_name'];
		$category_id = $_POST['category_id'];

		if(!empty($topic_tips_name)){
			$data = [
				'tips_name' => $topic_tips_name,
				'category_id' => $category_id,
				'add_time' => time(),
				'update_time' => time(),
			];

			$insert_id = $this->model('specialist_topicTips')->add_tips($data);
			if($insert_id){
				H::ajax_json_output(AWS_APP::RSM(array(
					'url' => get_js_url('/admin/specialist/topic_tips_list/' . implode('__', $param))
				), 1, ''));
			}

			H::ajax_json_output(AWS_APP::RSM(array(
					'url' => get_js_url('/admin/specialist/topic_tips_list/' . implode('__', $param))
				), 1, '添加失败'));
		}else{
			H::ajax_json_output(AWS_APP::RSM(array(
					'url' => get_js_url('/admin/specialist/topic_tips_list/' . implode('__', $param))
				), 2, '添加失败'));
		}
	}

	/**
	 * [terrace_order_list_action 平台订单列表]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-10-27
	 */
	public function terrace_order_list_action(){

		$page 	= max((int)$_GET['page'], 1);
		$limit 	= 30;
		$offset	= ($page-1) * $limit;

		$where = 'order_type = 1 ';

		if ($_GET['date_start'] && $_GET['date_end']) {
			$date_start = strtotime($_GET['date_start']);
			$date_end = strtotime($_GET['date_end']) + 86399;
			$where .= "AND aws_specialist_order.add_time > $date_start AND aws_specialist_order.add_time < $date_end ";
		
			$url_param = [
				"date_start-".$_GET['date_start'],
				"date_end-".$_GET['date_end']
			];
		}else{
			$sum = $this->model('specialist_order')->sum_order('price','order_type=1');
			$terrace_income = $sum['sum'];
		}

		// if($_GET['user_name']){
		// 	$user_name = $_GET['user_name'];
		// 	$where .= "AND user_name like '%{$user_name}%' ";

		// 	$url_param = [
		// 		"user_name-".$_GET['user_name'],
		// 	];
		// }

		// if($_GET['uid']){
		// 	$uid = $_GET['uid'];
		// 	$where .= "AND aws_specialist_order.uid = $uid ";

		// 	$url_param = [
		// 		"uid-".$_GET['uid'],
		// 	];
		// }

		$field = [
			'aws_specialist_order.*',
			'aws_specialist_order.question_id',
			'aws_specialist_question.question_name,aws_specialist_question.specialist_uid as question_specialist_uid',
			'aws_specialist_answer.specialist_uid as answer_specialist_uid',
			'aws_users.user_name',
		];

		$order_by = 'add_time DESC';

		// 平台收入列表
		// 
		$order_list = $this->model('specialist_order')->select_order_user_gaofen($field, $where, $order_by);
		$order_list_page = $this->model('specialist_order')->select_order_user_gaofen($field, $where, $order_by, $limit, $offset);
		$order_count = $this->model('specialist_order')->count_order($where);

		if(!$terrace_income){
			$terrace_income = 0;
			foreach ($order_list as $key => $value) {
				$terrace_income += $value['price'];
			}
		}
		
		// H::p($order_list_page);

		TPL::assign('terrace_income', $terrace_income);
		TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(1104));
		TPL::assign('order_list', $order_list_page);
		TPL::assign('pagination', AWS_APP::pagination()->initialize(array(
			'base_url' => get_js_url('/admin/specialist/terrace_order_list/') . implode('__', $url_param),
			'total_rows' => $order_count,
			'per_page' => $limit,
		))->create_links());

		TPL::output('admin/specialist/terrace_order_list');
	}

	/**
	 * [terrace_income_list_action 平台收入列表]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-10-25
	 */
	public function terrace_income_list_action(){
		$page 	= max((int)$_GET['page'], 1);
		$limit 	= 30;
		$offset	= ($page-1) * $limit;

		$where = null;

		if ($_GET['date_start'] && $_GET['date_end']) {
			$date_start = strtotime($_GET['date_start']);
			$date_end = strtotime($_GET['date_end']) + 86399;
			$where = "aws_specialist_prorate.add_time > $date_start AND aws_specialist_prorate.add_time < $date_end";
		
			$url_param = [
				"date_start-".$_GET['date_start'],
				"date_end-".$_GET['date_end']
			];
		}else{
			$sum = $this->model('specialist_prorate')->sum_order('gaofen_prize');
			$terrace_income = $sum['sum'];
		}

		$field = [
			'aws_specialist_prorate.*',
			'aws_specialist_order.question_id,aws_specialist_order.answer_id',
			'aws_specialist_question.question_name',
			'aws_users.user_name',
		];

		$order_by = 'add_time DESC';

		// 平台收入列表
		$prorate_list = $this->model('specialist_prorate')->select_prorate_order_question_user($field, $where);
		$prorate_list_page = $this->model('specialist_prorate')->select_prorate_order_question_user($field, $where, $order_by, $limit, $offset);
		$prorate_count = $this->model('specialist_prorate')->count_prorate($where);

		if(!$terrace_income){
			$terrace_income = 0;
			foreach ($prorate_list as $key => $value) {
				$terrace_income += $value['gaofen_prize'];
			}
		}

		TPL::assign('terrace_income', $terrace_income);
		TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(1104));
		TPL::assign('prorate_list', $prorate_list_page);
		TPL::assign('pagination', AWS_APP::pagination()->initialize(array(
			'base_url' => get_js_url('/admin/specialist/terrace_income_list/') . implode('__', $url_param),
			'total_rows' => $prorate_count,
			'per_page' => $limit,
		))->create_links());

		TPL::output('admin/specialist/terrace_income_list');
	}

	/**
	 * [user_income_list_action 用户收入列表]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-10-27
	 */
	public function user_income_list_action(){

		$page 	= max((int)$_GET['page'], 1);
		$limit 	= 30;
		$offset	= ($page-1) * $limit;

		$where = '';

		if ($_GET['date_start'] && $_GET['date_end']) {
			$date_start = strtotime($_GET['date_start']);
			$date_end = strtotime($_GET['date_end']) + 86399;
			$where .= "aws_specialist_prorate.add_time > $date_start AND aws_specialist_prorate.add_time < $date_end ";
		
			$url_param = [
				"date_start-".$_GET['date_start'],
				"date_end-".$_GET['date_end']
			];
		}

		if($_GET['user_name']){
			// 通过user_name查询user_id
			$user_info = $this->model('account')->get_user_info_by_username($_GET['user_name']);
			$uid = $user_info['uid'];

			if($where != ''){
				$where .= "AND aws_specialist_prorate.question_uid = $uid OR aws_specialist_prorate.specialist_uid = $uid";
			}else{
				$where .= "aws_specialist_prorate.question_uid = $uid OR aws_specialist_prorate.specialist_uid = $uid";
			}

			$url_param[] = "user_name-".$_GET['user_name'];
		}

		if($_GET['uid']){
			// 通过uid查询user_id
			$uid = (int)$_GET['uid'];
			$user_info = $this->model('account')->get_user_info_by_uid($uid);

			if($where != ''){
				$where .= "AND aws_specialist_prorate.question_uid = $uid OR aws_specialist_prorate.specialist_uid = $uid";
			}else{
				$where .= "aws_specialist_prorate.question_uid = $uid OR aws_specialist_prorate.specialist_uid = $uid";
			}

			$url_param[] = "user_name-".$_GET['user_name'];
		}

		$field = [
			'aws_specialist_prorate.*',
			'aws_specialist_order.question_id,aws_specialist_order.answer_id',
			'aws_specialist_question.question_name',
			'aws_users.user_name',
		];

		$order_by = 'add_time DESC';


		if ($uid) {
			// 用户收入列表
			// 不分页
			$prorate_list = $this->model('specialist_prorate')->select_prorate_order_question_user($field, $where, $order_by);
			// 分页
			$prorate_list_page = $this->model('specialist_prorate')->select_prorate_order_question_user($field, $where, $order_by, $limit, $offset);
			$prorate_count = $this->model('specialist_prorate')->count_prorate($where);

			// 不分页的数据获取专家或用户对应的收入
			foreach ($prorate_list as $key => $value) {
				if($uid == $value['question_uid']){
					$prorate_list[$key]['user_income'] = $value['questioner_prize'];
				}
				if($uid == $value['specialist_uid']){
					$prorate_list[$key]['user_income'] = $value['specialist_prize'];
				}
			}

			// 分页的数据获取专家或用户对应的收入
			foreach ($prorate_list_page as $key => $value) {
				if($uid == $value['question_uid']){
					$prorate_list_page[$key]['user_income'] = $value['questioner_prize'];
				}
				if($uid == $value['specialist_uid']){
					$prorate_list_page[$key]['user_income'] = $value['specialist_prize'];
				}
			}

			// 计算时间段内总收入
			$user_total_income = 0;
			foreach ($prorate_list as $key => $value) {
				$user_total_income += $value['user_income'];
			}

			TPL::assign('uid', $uid);
			TPL::assign('user_total_income', $user_total_income);
			TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(1105));
			TPL::assign('prorate_list_page', $prorate_list_page);
			TPL::assign('pagination', AWS_APP::pagination()->initialize(array(
				'base_url' => get_js_url('/admin/specialist/user_income_list/') . implode('__', $url_param),
				'total_rows' => $prorate_count,
				'per_page' => $limit,
			))->create_links());
		}else{
			TPL::assign('uid', 0);
			TPL::assign('user_total_income', 0);
			TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(1105));
			TPL::assign('prorate_list_page', []);
			TPL::assign('pagination', AWS_APP::pagination()->initialize(array(
				'base_url' => get_js_url('/admin/specialist/user_income_list/') . implode('__', $url_param),
				'total_rows' => 0,
				'per_page' => $limit,
			))->create_links());
		}
		
		// H::p($prorate_list);
		TPL::output('admin/specialist/user_income_list');
	}

	/**
	 * [user_expend_list_action 用户支出列表]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-10-26
	 */
	public function user_expend_list_action(){
		$page 	= max((int)$_GET['page'], 1);
		$limit 	= 30;
		$offset	= ($page-1) * $limit;

		$where = 'order_type = 1 ';

		if ($_GET['date_start'] && $_GET['date_end']) {
			$date_start = strtotime($_GET['date_start']);
			$date_end = strtotime($_GET['date_end']) + 86399;
			$where .= "AND aws_specialist_order.add_time > $date_start AND aws_specialist_order.add_time < $date_end ";
		
			$url_param = [
				"date_start-".$_GET['date_start'],
				"date_end-".$_GET['date_end']
			];
		}

		if($_GET['user_name']){
			$user_name = $_GET['user_name'];
			$where .= "AND user_name = '{$user_name}' ";

			$url_param = [
				"user_name-".$_GET['user_name'],
			];
		}

		if($_GET['uid']){
			$uid = $_GET['uid'];
			$where .= "AND aws_specialist_order.uid = $uid ";

			$url_param = [
				"uid-".$_GET['uid'],
			];
		}

		$field = [
			'aws_specialist_order.*',
			'aws_specialist_order.question_id',
			'aws_specialist_question.question_name,aws_specialist_question.specialist_uid as question_specialist_uid',
			'aws_specialist_answer.specialist_uid as answer_specialist_uid',
			'aws_users.user_name',
		];

		$order_by = 'add_time DESC';

		if (!empty($user_name) || !empty($uid)) {
			// 平台收入列表
			$order_list = $this->model('specialist_order')->select_order_user_gaofen($field, $where, $order_by, $limit, $offset);
			$order_count = $this->model('specialist_order')->count_order($where);

			// H::p($prorate_count);
			$user_total_expend = 0;
			foreach ($order_list as $key => $value) {
				$user_total_expend += $value['price'];
			}

			TPL::assign('user_total_expend', $user_total_expend);
			TPL::assign('user_type', 1);
			TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(1105));
			TPL::assign('expend_list', $order_list);
			TPL::assign('pagination', AWS_APP::pagination()->initialize(array(
				'base_url' => get_js_url('/admin/specialist/user_expend_list/') . implode('__', $url_param),
				'total_rows' => $order_count,
				'per_page' => $limit,
			))->create_links());
		}else{
			TPL::assign('user_total_expend', 0);
			TPL::assign('user_type', 0);
			TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(1105));
			TPL::assign('expend_list', []);
			TPL::assign('pagination', AWS_APP::pagination()->initialize(array(
				'base_url' => get_js_url('/admin/specialist/user_expend_list/') . implode('__', $url_param),
				'total_rows' => 0,
				'per_page' => $limit,
			))->create_links());
		}

		TPL::output('admin/specialist/user_expend_list');
	}

	/**
	 * [special_list_action 专辑列表]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-11-04
	 */
	public function special_list_action(){
		$page 	= max((int)$_GET['page'], 1);
		$limit 	= 30;
		$offset	= ($page-1) * $limit;

		$order = 'sort DESC';

		$special_list = $this->model('specialist_special')->select_special(null, null, $order, $limit, $offset);
		$special_count	= $this->model('specialist_special')->count_special();

		TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(1106));
		TPL::assign('special_list', $special_list);
		TPL::assign('pagination', AWS_APP::pagination()->initialize(array(
			'base_url' => get_js_url('/admin/specialist/special_list/') . implode('__', $url_param),
			'total_rows' => $special_count,
			'per_page' => $limit,
		))->create_links());

		TPL::output('admin/specialist/special_list');
	}

	/**
	 * [special_add_action 添加专辑]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-11-07
	 */
	public function special_add_action(){
		// 查询分类信息
		$category_list 	= $this->model('specialist_topicCategory')->select_category();
		// H::p($topic_list);

		TPL::assign('category_list', $category_list);
		TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(1106));
		TPL::output('admin/specialist/special_add');
	}

	public function create_special_action(){

		if(empty($_FILES['special_cover']['name'])){
			$special_name			= $_POST['special_name'];
			$special_description	= $_POST['special_description'];
		}else{
			$special_name			= iconv("UTF-8", "ISO-8859-1//TRANSLIT", $_POST['special_name']);
			$special_description	= iconv("UTF-8", "ISO-8859-1//TRANSLIT", $_POST['special_description']);
		}

		$data = [];

		if($special_name) {
			$data['special_name']			= $special_name;
		}

		if($special_description) {
			$data['special_description']	= $special_description;
		}

		$item_type = 'specialist/cover';

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
	                	return AWS_APP::RSM('',10003, '错误代码:'.AWS_APP::upload()->get_error());
	                    //die("{'error':'错误代码: " . AWS_APP::upload()->get_error() . "'}");
	                break;

	                case 'upload_invalid_filetype':
	                	return AWS_APP::RSM('',10003, '文件类型无效');
	                    //die("{'error':'文件类型无效'}");
	                break;

	                case 'upload_invalid_filesize':
	                	return AWS_APP::RSM('',10003, '文件尺寸过大, 最大允许尺寸为 ' . get_setting('upload_size_limit') .  ' KB');
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

	        $attach_id = $this->model('publish')->add_attach($item_type, $upload_data['orig_name'], $_GET['attach_access_key'], time(), basename($upload_data['full_path']), $upload_data['is_image']);

	        $attach_info = $this->model('publish')->get_attach_by_id($attach_id);

	        if(!empty($attach_info['attachment'])) {
	        	$data['special_cover_url']	= str_replace(get_setting('upload_url'), '', $attach_info['attachment']);
	        }
	    }

		if($data) {
			$data['add_time']	= TIMESTAMP;
			$data['update_time']	= TIMESTAMP;
			$this->model('specialist_special')->add_special($data);

			H::ajax_json_output(AWS_APP::RSM(array(
				'url' => get_js_url('/admin/specialist/special_list/' . implode('__', $param))
			), 1, ''));
		}

		H::ajax_json_output(AWS_APP::RSM(array(
				'url' => get_js_url('/admin/specialist/special_list/' . implode('__', $param))
			), 2, '添加失败'));
	}

	/**
	 * [special_edit_action 专辑编辑]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-11-04
	 */
	public function special_edit_action(){

		$page 	= max((int)$_GET['page'], 1);
		$limit 	= 10;
		$offset	= ($page-1) * $limit;

		if (!$_GET['id'])
        {  
        	H::ajax_json_output(AWS_APP::RSM(array(
				'url' => get_js_url('/admin/specialist/special_list/' . implode('__', $param))
			), 2, '专辑不存在'));
        }
        $special_id = $_GET['id'];
		$url_param = ["id-".$_GET['id']];

		// 专辑信息
		$special_info = $this->model('specialist_special')->get_special("id = $special_id",$field= null);

		// 专辑包含的方法信息
		$where_topic="special_id = $special_id";
		$topic_list = $this->model('specialist_topic')->select_topic_with_specialist($limit, $offset, 'add_time DESC',$where_topic);
		foreach ($topic_list as $key => $value) {
			$topic_list[$key]['topic_category_id'] = explode(',', $value['topic_category_id']);
		}
		// 方法数
		$topic_list_count = $this->model('specialist_topic')->count_topic_with_specialist($where_topic);

		// 查询分类信息
		$category_list 	= $this->model('specialist_topicCategory')->select_category();

		// 拼装分类信息
		foreach ($topic_list as $key => $value) {
			$topic_list[$key]['category_name'] = '';
			foreach ($value['topic_category_id'] as $k => $v) {
				foreach ($category_list as $row) {
					if( $v == $row['id'] ){
						$topic_list[$key]['category_name'] .= $row['category_name'].',';
					}
				}
			}
		}

		// 去除拼装分类后的逗号
		foreach ($topic_list as $key => $value) {
			$topic_list[$key]['category_name'] = rtrim($value['category_name'], ',');
		}

		// H::p($topic_list);

		TPL::assign('special_info', $special_info);
		TPL::assign('topic_list', $topic_list);
		TPL::assign('category_list', $category_list);
		TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(1106));
		TPL::assign('pagination', AWS_APP::pagination()->initialize(array(
			'base_url' => get_js_url('/admin/specialist/special_edit/') . implode('__', $url_param),
			'total_rows' => $topic_list_count,
			'per_page' => $limit,
		))->create_links());

		TPL::output('admin/specialist/special_edit');
	}

	public function update_special_action(){
		$special_id 			= $_POST['special_id'];
		
		if(empty($_FILES['special_cover']['name'])){
			$special_name			= $_POST['special_name'];
			$special_description	= $_POST['special_description'];
		}else{
			$special_name			= iconv("UTF-8", "ISO-8859-1//TRANSLIT", $_POST['special_name']);
			$special_description	= iconv("UTF-8", "ISO-8859-1//TRANSLIT", $_POST['special_description']);
		}

		$data = [];

		if(is_numeric($special_id)) {
			$data['id']			= $special_id;
		}

		if($special_name) {
			$data['special_name']			= $special_name;
		}

		if($special_description) {
			$data['special_description']	= $special_description;
		}

		$item_type = 'specialist/cover';

		$special_info = $this->model('specialist_special')->get_special("id = $special_id");

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
	                	return AWS_APP::RSM('',10003, '错误代码:'.AWS_APP::upload()->get_error());
	                    //die("{'error':'错误代码: " . AWS_APP::upload()->get_error() . "'}");
	                break;

	                case 'upload_invalid_filetype':
	                	return AWS_APP::RSM('',10003, '文件类型无效');
	                    //die("{'error':'文件类型无效'}");
	                break;

	                case 'upload_invalid_filesize':
	                	return AWS_APP::RSM('',10003, '文件尺寸过大, 最大允许尺寸为 ' . get_setting('upload_size_limit') .  ' KB');
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

	        $attach_id = $this->model('publish')->add_attach($item_type, $upload_data['orig_name'], $_GET['attach_access_key'], time(), basename($upload_data['full_path']), $upload_data['is_image']);

	        $attach_info = $this->model('publish')->get_attach_by_id($attach_id);

	        if(!empty($attach_info['attachment'])) {
	        	$data['special_cover_url']	= str_replace(get_setting('upload_url'), '', $attach_info['attachment']);
	        }
	    }

		if($data) {
			$data['update_time']	= TIMESTAMP;
			$this->model('specialist_special')->update_special($data, "`id`='{$special_id}'");

			H::ajax_json_output(AWS_APP::RSM(array(
				'url' => get_js_url('/admin/specialist/special_list/' . implode('__', $param))
			), 1, ''));
		}

		H::ajax_json_output(AWS_APP::RSM(array(
				'url' => get_js_url('/admin/specialist/special_list/' . implode('__', $param))
			), 1, '更新失败'));
	}

	/**
	 * [special_topic_list_action 没有分类的方法列表]
	 * @author ken
	 * @date   2016-11-07
	 */
	public function special_topic_list_action(){
		$page 	= max((int)$_GET['page'], 1);
		$limit 	= 10;
		$offset	= ($page-1) * $limit;

		if (!$_GET['id'])
        {  
        	H::ajax_json_output(AWS_APP::RSM(array(
				'url' => get_js_url('/admin/specialist/special_edit/' . implode('__', $param))
			), 2, '专辑不存在'));
        }

		$special_id = $_GET['id'];
		$url_param = ["id-".$_GET['id']];

		$category_list 	= $this->model('specialist_topicCategory')->select_category();
		$special_list	= $this->model('specialist_special')->select_special();
		// 查询没有专辑的方法
		$where_topic = 'special_id = 0';
		$topic_list 	= $this->model('specialist_topic')->select_topic_with_specialist($limit, $offset, 'add_time DESC', $where_topic);
		$topic_count	= $this->model('specialist_topic')->count_topic_with_specialist($where_topic);

		TPL::assign('topic_list', $topic_list);
		TPL::assign('category_list', array_column($category_list, 'category_name', 'id'));
		TPL::assign('special_list', array_column($special_list, 'special_name', 'id'));

		TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(1106));

		TPL::assign('pagination', AWS_APP::pagination()->initialize(array(
			'base_url' => get_js_url('/admin/specialist/special_topic_list/') . implode('__', $url_param),
			'total_rows' => $topic_count,
			'per_page' => $limit,
		))->create_links());

		TPL::output('admin/specialist/special_topic_list');
	}

	/**
     * [update_special_topic_action 插入方法到专辑]
     * @return [type]     [description]
     * @author ken
     * @date   2016-11-08
     */
    public function update_special_topic_action()
    {
        if (!$_POST['special_id'])
        {  
        	H::ajax_json_output(AWS_APP::RSM(array(
				'url' => get_js_url('/admin/specialist/special_edit/' . implode('__', $param))
			), 2, '专辑不存在'));
        }

        if (!$_POST['topic_ids'])
        {
        	H::ajax_json_output(AWS_APP::RSM(array(
				'url' => get_js_url('/admin/specialist/special_edit/' . implode('__', $param))
			), 2, '请选择方法'));
        }

        $special_id = $_POST['special_id'];
        $param = ["id-".$special_id];

        $topic_ids = $_POST['topic_ids'];

        $topic_ids_str = implode(',', $topic_ids);

        $update_data = [
            'special_id' => $special_id
        ];

        $where = "topic_id IN ($topic_ids_str)";

        // 插入方法到专辑
        $affect = $this->model('specialist_topic')->update_topic($update_data, $where);

        if($affect){
        	// 增加专辑的方法数量
        	$this->model('specialist_special')->calc_by_id_by_field($special_id, 'topic_num', $value=$affect);

        	H::ajax_json_output(AWS_APP::RSM(array(
				'url' => get_js_url('/admin/specialist/special_edit/' . implode('__', $param))
			), 1, '添加成功'));
        }

		H::ajax_json_output(AWS_APP::RSM(array(
			'url' => get_js_url('/admin/specialist/special_edit/' . implode('__', $param))
		), 2, '添加失败'));
    }
}