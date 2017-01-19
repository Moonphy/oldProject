<?php


class autopublisher {

	public function __construct() {
		$this->sender = AWS_APP::model('publish');
		$this->source = AWS_APP::model('plugin_publisher_model');
	}

	public static function getInstance() {
		return new static();
	}

	public function run() {
		$list = $this->get_source_list();
		foreach($list as $data) {
			$this->send($data);
		}
	}

	public function send($data) {

		switch($data['type']) {
			case 1:
				$this->send_question($data);
			break;
			case 2:
				$this->send_article($data);
			break;
		}
	}


	/**
	 * 是否可以发送
	 * @param  [type] $time 目标发送时间
	 * @return [type]       [description]
	 */
	private function check_send_time($time) {
		if(!is_numeric($time)) {
			$time = strtotime($time);
		}

		if($time && time()>$time) {
			return true;
		}
		return false;
	}


	/**
	 * 发问题
	 * @param  [type] $data [description]
	 * @return [type]       [description]
	 */
	public function send_question($data) {
		if(!$this->check_send_time($data['publish_time'])) return false;

		$data['data'] = json_decode($data['data'], true);

		$reflection = new ReflectionObject($this->sender);

		$question_id = $reflection->getMethod('publish_question')->invokeArgs($this->sender, $data['data']);
		return $this->update_source_record(['publish_id'=>$question_id, 'is_publish'=>1], $data['id']);
	}

	/**
	 * 发文章
	 * @param  [type] $data [description]
	 * @return [type]       [description]
	 */
	public function send_article($data) {
		if(!$this->check_send_time($data['publish_time'])) return false;


		$data['data'] = json_decode($data['data'], true);

		$reflection = new ReflectionObject($this->sender);

		$article_id = $reflection->getMethod('publish_article')->invokeArgs($this->sender, $data['data']);

		return $this->update_source_record(['publish_id'=>$article_id, 'is_publish'=>1], $data['id']);
	}

	/**
	 * 获取任务列表
	 * @param  [type]  $type  [description]
	 * @param  integer $limit [description]
	 * @return [type]         [description]
	 */
	public function get_source_list($type=0, $limit=1){
		return $this->source->get_publsher_list($type, $is_publish=false, $imit);
	}

	public function update_source_record(array $data, $id) {
		return $this->source->save_data($data, $id);
	}
}


autopublisher::getInstance()->run();