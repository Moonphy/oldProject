<?php 

if (!defined('IN_ANWSION'))
{
	die;
}

class specialist_dynamic_class extends AWS_MODEL
{
	/**
	 * 动态类型
	 */
	const DN_TYPE_ADD_TOPIC 		= 1;	//专家发布主题
	const DN_TYPE_ANSWER_QUESTION 	= 2;	//专家回复提问

	const _TABLE = 'specialist_dynamic'; // 当前model对应的表

	/**
	 * 获取用户所关注人物的动态数据
	 * @param  [type] $uid 当前用户uid
	 * @return [type]      [description]
	 */
	public function get_dynamic_by_uid($uid, $page=1, $limit=5) {

		$page = max($page, 1);
		$follows = $this->model('follow')->get_user_friends_ids($uid);

		$result = $this->translate_dynamic($this->fetch_dynamic_by_publisher($follows, $page, $limit));
		return $result;
	}

	/**
	 * 获取单条动态
	 * @param  [type] $dynamic_id [description]
	 * @return [type]             [description]
	 */
	public function get_dynamic_by_id($dynamic_id) {
		$dynamic_id = (int)$dynamic_id;
		
		$key = 'specialist_dynamic_'.$dynamic_id;
		if(!($result = AWS_APP::cache()->get($key))) {
			$result = $this->fetch_row(static::_TABLE, "`id`='{$dynamic_id}'");
			AWS_APP::cache()->set($key, $result, get_setting('cache_level_normal'));
		}

		return $result;
	}

	/**
	 * 已看
	 * @param  [type] $dynamic_id [description]
	 * @return [type]             [description]
	 */
	public function read($dynamic_id) {
		$dynamic_id = $this->quote($dynamic_id);

		return $this->update(static::_TABLE, ['read_flag'=>2], "`id`='{$dynamic_id}'");
	}

	/**
	 * 未读数
	 * @param  [type] $uid [description]
	 * @return [type]      [description]
	 */
	public function unread_count($uid) {
		return $this->count(static::_TABLE, ['uid'=>$this->quote($uid), 'read_flag'=>0]);
	}

	/**
	 * 获取关注专家的动态数据
	 * @param  array  $uids   [description]
	 * @param  [type] $offset [description]
	 * @param  [type] $limit  [description]
	 * @return [type]         [description]
	 */
	public function fetch_dynamic_by_publisher(array $uids, $page, $limit) {
		$uids = $uids ? $uids:array(0);
		$list = $this->fetch_page(static::_TABLE, '`uid` IN("'.implode('","', $uids).'")', 'add_time desc', $page, $limit);

		return $list;
	}

	/**
	 * 解释动态数据
	 * @param  [type] $data [description]
	 * @return [type]       [description]
	 */
	public function translate_dynamic($data) {
		foreach($data as $key=>$row) {
			$params = json_decode($row['params'], true);
			$row['params'] = $params ? $params:[];

			switch($row['type']) {
				case static::DN_TYPE_ANSWER_QUESTION:
					$data[$key] = $this->translate_dynamic_for_answer_question($row);
				break;

				case static::DN_TYPE_ADD_TOPIC:
					$data[$key] = $this->translate_dynamic_for_add_topic($row);
				break;

				default: //找不到动态类型，不返回该条数据
					unset($data[$key]);
				break;
			}
		}

		return $data;
	}

	/**
	 * 新主题数据解释
	 * @param  [type] $row [description]
	 * @return [type]      [description]
	 */
	public function translate_dynamic_for_add_topic($row) {		
		$row['topic_data'] = $this->model('specialist_topic')->get_topic_by_id($row['params']['topic_id']);
		$row['topic_data']['user'] = $this->format($this->get_user_info_by_uid($row['uid']));
		if(isset($row['topic_data']['user']['uid'])) {
			$row['topic_data']['user']['avatar_file'] = get_avatar_url($row['uid'], 'max');
		}
		
		return $row;
	}


	/**
	 * 回复数据解释
	 * @param  [type] $row [description]
	 * @return [type]      [description]
	 */
	public function translate_dynamic_for_answer_question($row) {
		$user_id = AWS_APP::user()->get_info('uid');
		$row['answer_data'] 	= $this->format($this->model('specialist_answer')->get_answer_by_id($row['params']['answer_id']), 'answer');
		$row['question_data'] 	= $this->model('specialist_question')->get_question_by_id($row['params']['question_id']);

		$row['answer_data']['belong'] = ($user_id==$row['question_data']['uid'] || $this->model('specialist_userListen')->get_user_listen($user_id, 2, $row['params']['answer_id'])) ? 1:0;

		$row['answer_data']['user'] 	= $this->format($this->get_user_info_by_uid($row['uid']));
		if(isset($row['answer_data']['user']['uid'])) {
			$row['answer_data']['user']['avatar_file'] = get_avatar_url($row['uid'], 'max');
		}


		$row['question_data']['user'] 	= $this->format($this->get_user_info_by_uid($row['question_data']['uid']));
		if(isset($row['question_data']['user']['uid'])) {
			$row['question_data']['user']['avatar_file'] = get_avatar_url($row['question_data']['uid'], 'max');
		}

		return $row;
	}

	/**
	 * [format description]
	 * @param  [type] $data [description]
	 * @param  string $type [description]
	 * @return [type]       [description]
	 */
	private function format($data, $type='user') {
		$format = [
			'user'	=> ['uid', 'user_name', 'avatar_file', 'url_token'],
			'answer'	=> ['answer_id', 'specialist_uid', 'record_time', 'add_time'],
		];

		return isset($format[$type]) ? array_intersect_key($data, array_fill_keys($format[$type], '')):$data;
	}


	private function get_user_info_by_uid($uid) {
		static $users = [];
		if(!isset($users[$uid])) {
			$users[$uid] = $this->model('account')->get_user_info_by_uid($uid);
		}

		return $users[$uid];
	}

	/**
	 * 添主题动态
	 * @param [type] $topic_id [description]
	 */
	public function add_topic_dynamic($topic_id) {
		$info = $this->model('specialist_topic')->get_topic_by_id($topic_id);

		$data = ['uid'=>$info['specialist_uid'], 'type'=>static::DN_TYPE_ADD_TOPIC, 'params'=>json_encode(['topic_id'=>$topic_id]), 'add_time'=>time()];
		return $this->add_dynamic($data);
	}

	/**
	 * 添加回复动态
	 * @param [type] $answer_id [description]
	 */
	public function add_answer_dynamic($answer_id) {
		$info = $this->model('specialist_answer')->get_answer_by_id($answer_id);

		$params = ['answer_id'=>$answer_id, 'answerer_uid'=>$info['specialist_uid'], 'question_id'=>$info['question_id'], 'add_time'=>time()];
		$data = ['uid'=>$info['specialist_uid'], 'type'=>static::DN_TYPE_ANSWER_QUESTION, 'params'=>json_encode($params)];
		return $this->add_dynamic($data);
	}

	/**
	 * 添加动态
	 * @param [type] $data [description]
	 */
	public function add_dynamic($data, $id='') {
		$id = (int)$id;
		if($id) {
			return $this->update(static::_TABLE, $data, "`id`='{$id}'");
		}else{
			return $this->insert(static::_TABLE, $data);
		}
	}
}