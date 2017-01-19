<?php 

if (!defined('IN_ANWSION'))
{
	die;
}

class specialist_userListen_class extends AWS_MODEL
{
	public $table='specialist_user_listen';

	/**
	 * [get_user_listen 获取一条'我的收听'信息]
	 * @param  [type]     $uid     [用户uid]
	 * @param  [type]     $type    [录音类型]
	 * @param  [type]     $type_id [录音id]
	 * @return [type]              [description]
	 * @author ken
	 * @date   2016-09-18
	 */
	public function get_user_listen($uid,$type,$type_id){
		$where='uid='.$uid.' AND type='.$type.' AND type_id='.$type_id;

		$key = 'specialist_userListen_'.$uid.'_'.$type.'_'.$type_id;
		if(!($result = AWS_APP::cache()->get($key))) {
			$result = $this->fetch_row($this->table,$where);
			AWS_APP::cache()->set($key, $result, 10);
		}

		return $result;
	}

	/**
	 * [select_user_listen description]
	 * @param  [type]     $field  [自选查询字段]
	 * @param  [type]     $where  [条件]
	 * @param  string     $order  [排序]
	 * @param  integer    $limit  [限制]
	 * @param  [type]     $offset [description]
	 * @return [type]             [description]
	 * @author ken
	 * @date   2016-09-14
	 */
	public function select_user_listen($field=null, $where=null, $order='add_time DESC', $limit=5, $offset=null){
		$res=$this->fetch_field_all($this->table, $field, $where, $order, $limit, $offset);
		foreach ($res as $key => $value) {
			$res[$key]['data']=unserialize($value['data']);
		}
		return $res;
	}

	/**
	 * [insert_user_listen 插入用户收听记录]
	 * @param  [type]     $uid     [用户uid]
	 * @param  [type]     $type    [收听录音类型]
	 * @param  [type]     $type_id [收听录音类型id]
	 * @param  [type]     $data    [收听录音数据]
	 * @return [type]              [description]
	 * @author ken
	 * @date   2016-09-14
	 */
	public function insert_user_listen($uid,$type,$type_id,$data){
		
		$data=[
			'uid'=>$uid,
			'type'=>$type,
			'type_id'=>$type_id,
			'data'=>serialize($data),
			'add_time'=>time()
		];
		$listen_id=$this->insert($this->table,$data);

		if($listen_id) {
			$key = 'specialist_userListen_'.$data['uid'].'_'.$data['type'].'_'.$data['type_id'];
			AWS_APP::cache()->delete($key);
		}
		return $listen_id;
	}

	/**
	 * [list_user_listen 收听列表]
	 * @param  [type]     $uid    [用户uid]
	 * @param  integer    $limit  [description]
	 * @param  [type]     $offset [description]
	 * @return [type]             [description]
	 * @author ken
	 * @date   2016-09-18
	 */
	public function list_user_listen($uid,$limit=5,$offset=null){
		
		$listen_list=$this->select_user_listen($field=['type','type_id','add_time','data'], $where="uid='{$uid}'", $order='add_time DESC', $limit, $offset);
		if(!empty($listen_list)){
			foreach ($listen_list as $key => $value) {
				if($value['data']['topic_id']){
					$topic_ids[$key]=$value['data']['topic_id'];
				}

				if($value['data']['specialist_uid']){
					$specialist_uids[$key]=$value['data']['specialist_uid'];
				}

				if($value['data']['question_id']){
					$question_ids[$key]=$value['data']['question_id'];
				}

				if($value['data']['question_uid']){
					$question_uids[$key]=$value['data']['question_uid'];
				}

				if($value['data']['answer_id']){
					$answer_ids[$key]=$value['data']['answer_id'];
				}
			}

			if(!empty($topic_ids)){
				$topics=$this->model('specialist_topic')->select_topic_ids($topic_ids);
			}else{
				$topics='';
			}
			
			if(!empty($specialist_uids)){
				$specialists=$this->model('account')->get_user_info_by_uids($specialist_uids);
			}else{
				$specialists='';
			}

			if(!empty($question_ids)){
				$questions=$this->model('specialist_question')->select_question_ids($question_ids);
			}else{
				$questions='';
			}

			if(!empty($answer_ids)){
				$answers=$this->model('specialist_answer')->select_answer_ids($answer_ids);
			}else{
				$answers='';
			}

			foreach ($listen_list as $key => $value) {
				if(!empty($topics)){
					foreach ($topics as $k => $v) {
						if($value['data']['topic_id']==$k){
							$listen_list[$key]['topic_data']['topic_id']=$v['topic_id'];
							$listen_list[$key]['topic_data']['topic_name']=$v['topic_name'];
							$listen_list[$key]['topic_data']['topic_description']=$v['topic_description'];
							$listen_list[$key]['topic_data']['topic_cover_url']=$v['topic_cover_url'];
							$listen_list[$key]['topic_data']['topic_cover_url_big']=$v['topic_cover_url_big'];
							$listen_list[$key]['topic_data']['topic_cover_url_small']=$v['topic_cover_url_small'];
						}
					}
				}

				if(!empty($specialists)){
					foreach ($specialists as $k => $v) {
						if($value['data']['specialist_uid']==$k){
							$listen_list[$key]['specialist_data']['uid']=$v['uid'];
							$listen_list[$key]['specialist_data']['user_name']=$v['user_name'];
							// $listen_list[$key]['specialist_data']['avatar_file']=$v['avatar_file'];
							$listen_list[$key]['specialist_data']['avatar_file']=get_avatar_url($k, 'max');
						}
					}
				}

				if(!empty($questions)){
					foreach ($questions as $k => $v) {
						if($value['data']['question_id']==$k){
							$listen_list[$key]['question_data']['question_id']=$v['question_id'];
							$listen_list[$key]['question_data']['question_name']=$v['question_name'];
							$listen_list[$key]['question_data']['uid']=$v['uid'];
							$listen_list[$key]['question_data']['question_user_name']=$v['user_name'];
							$listen_list[$key]['question_data']['question_avatar_file']=$v['avatar_file'];
						}
					}
				}

				if(!empty($answers)){
					foreach ($answers as $k => $v) {
						if($value['data']['answer_id']==$k){
							$listen_list[$key]['answer_data']['answer_id']=$v['answer_id'];
							$listen_list[$key]['answer_data']['answer_url']=$v['answer_url'];
							$listen_list[$key]['answer_data']['record_time']=$v['record_time'];
						}
					}
				}
			}
		}

		return $listen_list;
	}
}