<?php 

if (!defined('IN_ANWSION'))
{
	die;
}

class specialist_question_class extends AWS_MODEL
{
	/**
	 * [get_question 获取一条提问记录]
	 * @param  [type]     $where [description]
	 * @param  [type]     $field [description]
	 * @return [type]            [description]
	 * @author ken
	 * @date   2016-08-24
	 */
	public function get_question($where = null,$field= null){
		$res=$this->fetch_field_row('specialist_question',$field,$where);
		return $res;
	}

	public function get_question_by_id($question_id) {
		$question_id = (int)$question_id;

		$key = 'specialist_question_'.$question_id;
		if(!($result = AWS_APP::cache()->get($key))) {
			$result = $this->get_question("`question_id`='{$question_id}'");
			AWS_APP::cache()->set($key, $result, get_setting('cache_level_normal'));
		}

		return $result;
	}

	public function get_question_answer($where){
		$sql="SELECT ";
		$sql.="aws_specialist_question.*,";
		$sql.="topic_name,question_fee,aws_specialist_answer.answer_id,heat_num,praise_num,aws_specialist_answer.add_time as answer_time,aws_specialist_answer.record_time,";
		$sql.="`aws_specialist_order`.`uid` as order_uid,order_type,";
		$sql.="aws_users.user_name,avatar_file";
		$sql.=" FROM aws_specialist_question ";

		$sql.='LEFT JOIN aws_specialist_topic ';
		$sql.='ON aws_specialist_question.topic_id=aws_specialist_topic.topic_id ';

		$sql.='LEFT JOIN aws_specialist_answer ';
		$sql.='ON aws_specialist_question.question_id=aws_specialist_answer.question_id ';

		$sql.='LEFT JOIN aws_specialist_order ';
		$sql.='ON aws_specialist_answer.answer_id=aws_specialist_order.answer_id ';

		$sql.='LEFT JOIN aws_users ';
		$sql.='ON aws_specialist_question.uid=aws_users.uid ';

		$res = $this->query_row($sql,$where);

		$res['avatar_file']=get_avatar_url($res['uid'], 'max');

		return $res;
	}

	/**
	 * 删除单条缓存
	 * @param  [type] $question_id [description]
	 * @return [type]              [description]
	 */
	public function del_cache_by_id($question_id) {
		$key = 'specialist_question_'.$question_id;
		return AWS_APP::cache()->delete($key);
	}

	public function select_question($where = null, $field= null, $order = null, $limit = null, $offset = 0){
		$res = $this->fetch_field_all('specialist_question',$field,$where,$order,$limit,$offset);
		return $res;
	}

	/**
	 * [select_question_answer 查询问题、答案和提问用户的关联数据]
	 * @param  [type]     $where    [description]
	 * @param  [type]     $limit    [description]
	 * @param  [type]     $offset   [description]
	 * @param  [type]     $group_by [description]
	 * @return [type]               [description]
	 * @author ken
	 * @date   2016-08-23
	 */
	public function select_question_answer($where=null, $limit = null, $offset = null, $order_by = 'aws_specialist_question.add_time DESC', $group_by = null){
		$sql="SELECT ";
		$sql.="aws_specialist_question.*,";
		$sql.="aws_specialist_answer.answer_id,answer_url,heat_num,praise_num,aws_specialist_answer.add_time as answer_time,record_time,";
		$sql.="`aws_specialist_order`.`uid` as order_uid,order_type,";
		$sql.="`aws_users`.`user_name`,avatar_file";
		$sql.=" FROM aws_specialist_question ";

		$sql.='LEFT JOIN aws_specialist_answer ';
		$sql.='ON aws_specialist_question.question_id=aws_specialist_answer.question_id ';

		$sql.='LEFT JOIN aws_specialist_order ';
		$sql.='ON aws_specialist_question.order_id=aws_specialist_order.order_id ';

		$sql.='LEFT JOIN aws_users ';
		$sql.='ON aws_specialist_question.uid=aws_users.uid ';

		$res = $this->query_all_other($sql,$limit,$offset,$where,$order_by,$group_by);

		foreach ($res as $key => $value) {
			$res[$key]['answer_url']?$res[$key]['answer_url']=get_setting('upload_url').$res[$key]['answer_url'].'.mp3':$res[$key]['answer_url']='';
		}

		return $res;
	}

	/**
	 * [select_question_topic_answer description]
	 * @param  [type]     $where    [description]
	 * @param  [type]     $limit    [description]
	 * @param  [type]     $offset   [description]
	 * @param  [type]     $order_by [description]
	 * @param  [type]     $group_by [description]
	 * @return [type]               [description]
	 * @author ken
	 * @date   2016-08-29
	 */
	public function select_question_topic_answer($where=null, $limit = null, $offset = null, $order_by = null, $group_by = null){
		$sql="SELECT ";
		$sql.="aws_specialist_question.question_id,question_name,aws_specialist_question.uid,";
		$sql.="answer_url,aws_specialist_answer.add_time as answer_time,";
		$sql.="aws_users.user_name as specialist_name,avatar_file";
		$sql.=" FROM aws_specialist_question ";

		$sql.='LEFT JOIN aws_specialist_answer ';
		$sql.='ON aws_specialist_question.question_id=aws_specialist_answer.question_id ';

		$sql.='LEFT JOIN aws_users ON aws_specialist_question.specialist_uid=aws_users.uid';
		$res = $this->query_all_other($sql,$limit,$offset,$where,$order_by,$group_by);

		return $res;
	}

	/**
	 * [select_question_ids ids查询question信息]
	 * @param  [type]     $ids [description]
	 * @return [type]          [description]
	 * @author ken
	 * @date   2016-09-19
	 */
	public function select_question_ids($ids){
		if(is_array($ids)){
            $ids="'".implode("','", $ids)."'";
        }
        
        $sql="SELECT ";
        $sql.="* ";
        $sql.="FROM aws_specialist_question ";
        $sql.="WHERE question_id in ($ids) ";
        $sql.="ORDER BY field(question_id,$ids)";
        $res = $this->query_all($sql);

        foreach ($res as $key => $value) {
            $result[$value['question_id']]=$value;
            $uids[]=$value['uid'];
        }

        $uids_info=$this->model('account')->fetch_user_uids($uids,'uid,user_name,avatar_file');

        foreach ($res as $key => $value) {
        	foreach ($uids_info as $k => $v) {
        		if($value['question_uid']==$k){
        			$result[$value['question_id']]['user_name']=$v['user_name'];
        			$result[$value['question_id']]['avatar_file']=get_avatar_url($v['uid'], 'max');
        		}
        	}
        }

        return $result;
	}

	public function add_question($data){
		$insert_id=$this->insert('specialist_question',$data);
		return $insert_id;
	}

	public function count_question($where=null){
		$count=$this->count('specialist_question',$where);
		return $count;
	}

	/**
	 * [update_question 更新问题]
	 * @param  [type]     $data  [description]
	 * @param  [type]     $where [description]
	 * @return [type]            [description]
	 * @author ken
	 * @date   2016-08-31
	 */
	public function update_question($data,$where){
		$affect_num=$this->update('specialist_question',$data,$where);
		$info = $this->get_question($where);
		$this->del_cache_by_id($info['question_id']);//更新后删除对应缓存，防止数据不同步
		return $affect_num;
	}
}