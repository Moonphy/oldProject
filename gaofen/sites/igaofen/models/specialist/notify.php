<?php 

if (!defined('IN_ANWSION'))
{
	die;
}

class specialist_notify_class extends AWS_MODEL
{

	const CATEGORY_SPECIALIST = 180; //专家
	
	const TYPE_SPECIALIST_TOPIC		= 900; //发布方法
	const TYPE_SPECIALIST_ANSWER 	= 901; //高分专家回复
	const TYPE_SPECIALIST_QUESTION 	= 902; //会员提问
	const TYPE_SPECIALIST_TAP		= 903; //偷听


	function __construct() {
		$this->notify = $this->model('notify');
		$this->notify->set_only_specialist(true);
	}

	/**
	 * 获取通知列表
	 * @param  [type]  $recipient_uid [description]
	 * @param  integer $read_status   [description]
	 * @param  [type]  $limit         [description]
	 * @return [type]                 [description]
	 */
	public function list_notification($recipient_uid, $read_status = 0, $limit = null) {

		$notify_list = [];

		if (!$notify_ids = $this->notify->get_notification_list($recipient_uid, $read_status, $limit))
		{
			return $notify_list;
		}

		if ( $notify_ids )
		{
			$notify_list = $this->notify->get_notification_by_ids($notify_ids);
		}

		foreach($notify_list as $key=>$row) {
			switch($row['action_type']) {
				case static::TYPE_SPECIALIST_TOPIC: //发布方法
					$notify_list[$key]['data'] = $this->topic_notify_format($row);
				break;

				case static::TYPE_SPECIALIST_ANSWER: //回复
					$notify_list[$key]['data']	= $this->answer_notify_format($row);
				break;

				case static::TYPE_SPECIALIST_QUESTION: //提问
					$notify_list[$key]['data']	= $this->question_notify_format($row);
				break;

				case static::TYPE_SPECIALIST_TAP: //偷听
					$notify_list[$key]['data'] = $this->tap_notify_format($row);
				break;
			}
		}
		return $notify_list;
	}

	/**
	 * 用户提问题通知
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-08-29
	 */
	private function question_notify_format($data) {
		static $list = [];

		$question_id = '';
		if(isset($data['data']['question_id'])) {
			$question_id = $data['data']['question_id'];
		}

		if(!empty($question_id) && !isset($list[$question_id])) {
			$list[$question_id] = $this->model('specialist_question')->get_question_by_id($question_id);
			$list[$question_id]['user'] = $this->get_user_info_by_uid($list[$question_id]['uid']);
			if(isset($list[$question_id]['user']['uid'])) {
				$list[$question_id]['user']['avatar_file'] = get_avatar_url($list[$question_id]['user']['uid'], 'max');
			}
			$list[$question_id]['topic'] = $this->format($this->model('specialist_topic')->get_topic_by_id($list[$question_id]['topic_id']), 'topic');
		}

		return isset($list[$question_id]) ? $list[$question_id]:[];
	}

	/**
	 * 专家回复通知
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-08-29
	 */
	private function answer_notify_format($data) {
		static $list = [];

		$answer_id = '';
		if(isset($data['data']['answer_id'])) {
			$answer_id = $data['data']['answer_id'];
		}

		if(!empty($answer_id) && !isset($list[$answer_id])) {
			$list[$answer_id] = $this->model('specialist_answer')->get_answer_by_id($answer_id);
			$list[$answer_id]['user'] = $this->get_user_info_by_uid($list[$answer_id]['specialist_uid']);
			if(isset($list[$answer_id]['user']['uid'])) {
				$list[$answer_id]['user']['avatar_file'] = get_avatar_url($list[$answer_id]['user']['uid'], 'max');
			}
			$list[$answer_id]['question'] = $this->question_notify_format(['data'=>['question_id'=>$list[$answer_id]['question_id']]]);
		}

		return isset($list[$answer_id]) ? $list[$answer_id]:[];
	}

	/**
	 * 发布方法通知
	 * @return [type] [description]
	 */
	private function topic_notify_format($data) {
		static $list = [];

		$topic = '';
		if(isset($data['data']['topic_id'])) {
			$topic_id = $data['data']['topic_id'];
		}

		if(!empty($topic_id) && !isset($list[$topic_id])) {
			$list[$topic_id] = $this->model('specialist_topic')->get_topic_by_id($topic_id);
			$list[$topic_id]['user'] = $this->get_user_info_by_uid($list[$topic_id]['specialist_uid']);
		}

		return isset($list[$topic_id]) ? $list[$topic]:[];
	}

	/**
	 * 偷听录音
	 * @param  [type] $data [description]
	 * @return [type]       [description]
	 */
	private function tap_notify_format($data) {
		static $list = [];

		$topic = '';
		if(isset($data['data']['topic_id'])) {
			$topic_id = $data['data']['topic_id'];
		}

		if(!empty($topic_id) && !isset($list[$topic_id])) {
			$list[$topic_id] = $this->format($this->model('specialist_topic')->get_topic_by_id($topic_id), 'topic');
		}

		return isset($list[$topic_id]) ? $list[$topic]:[];
	}

	/**
	 * 发送通知
	 * @param  [type]  $sender_uid    [description]
	 * @param  [type]  $recipient_uid [description]
	 * @param  [type]  $action_type   [description]
	 * @param  integer $model_type    [description]
	 * @param  integer $source_id     [description]
	 * @param  array   $data          [description]
	 * @return [type]                 [description]
	 */
	public function send($sender_uid, $recipient_uid, $action_type, $model_type = 0, $source_id = 0, $data = array()) {
		return $this->notify->send($sender_uid, $recipient_uid, $action_type, $model_type, $source_id, $data);
	}

	/**
	 * 获取用户信息
	 * @param  [type] $uid [description]
	 * @return [type]      [description]
	 */
	private function get_user_info_by_uid($uid) {
		static $users = [];
		if(!isset($users[$uid])) {
			$users[$uid] = $this->format($this->model('account')->get_user_info_by_uid($uid));
		}

		return $users[$uid];
	}

	private function format($data, $type='user') {
		$format = [
			'user'	=> ['uid', 'user_name', 'avatar_file', 'url_token'],
			'question' => ['question_id', 'question_name', 'add_time'],
			'topic'	=> ['topic_id', 'topic_name', 'add_time'],
		];

		return isset($format[$type]) ? array_intersect_key($data, array_fill_keys($format[$type], '')):$data;
	}

}