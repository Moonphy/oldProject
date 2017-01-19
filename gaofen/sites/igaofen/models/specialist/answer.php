<?php 

if (!defined('IN_ANWSION'))
{
	die;
}

class specialist_answer_class extends AWS_MODEL
{
	/**
	 * [get_answer 获取一条answer记录]
	 * @param  [type]     $where [description]
	 * @param  [type]     $field [description]
	 * @return [type]            [description]
	 * @author ken
	 * @date   2016-08-24
	 */
	public function get_answer($where = null,$field= null){
		$res=$this->fetch_field_row('specialist_answer',$field,$where);
		return $res;
	}

	public function get_answer_by_id($answer_id) {
		$answer_id = (int)$answer_id;

		$key = 'specialist_answer_'.$answer_id;
		if(!($result = AWS_APP::cache()->get($key))) {
			$result = $this->get_answer("`answer_id`='{$answer_id}'");
			AWS_APP::cache()->set($key, $result, get_setting('cache_level_normal'));
		}

		return $result;
	}

	public function get_answer_question($answer_id){
		$answer=$this->get_answer_by_id($answer_id);
		$question=$this->model('specialist_question')->get_question("question_id='{$answer['question_id']}'");
		
		$answer['answer_url']=empty($answer['answer_url'])?'':get_setting('upload_url').$answer['answer_url'].'.mp3';

		$data=[
			'answer'=>$answer,
			'question'=>$question
		];
		return $data;
	}

	/**
	 * [get_answer_order 获取答案及对应订单信息]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-09-02
	 */
	public function get_answer_order($where = null,$field= null){
		$answer=$this->fetch_field_row('specialist_answer',$field,$where);
		$order=$this->model('specialist_order')->get_order($where = null);
		$data=[
			'answer'=>$answer,
			'order'=>$order
		];
		return $data;
	}

	/**
	 * [get_answer_question_order 获取一条answer_question_order信息]
	 * @param  [type]     $answer_id [回答id]
	 * @return [type]                [description]
	 * @author ken
	 * @date   2016-09-20
	 */
	public function get_answer_question_order($answer_id,$uid){
		$sql="SELECT ";
		$sql.="aws_specialist_question.*,";
		$sql.="aws_specialist_answer.answer_id,answer_url,heat_num,praise_num,aws_specialist_answer.add_time as answer_time,record_time,";
		$sql.="`aws_specialist_order`.`uid` as order_uid,order_type,aws_specialist_order.order_id";
		$sql.=" FROM aws_specialist_answer ";

		$sql.='LEFT JOIN aws_specialist_question ';
		$sql.='ON aws_specialist_question.question_id=aws_specialist_answer.question_id ';

		$sql.='LEFT JOIN aws_specialist_order ';
		$sql.='ON aws_specialist_answer.answer_id=aws_specialist_order.answer_id ';

		$sql.="WHERE aws_specialist_answer.answer_id='{$answer_id}' ";

		$sql.="ORDER BY aws_specialist_order.order_id DESC";

		$res = $this->query_row($sql);

		if(!empty($res)){
			$res['answer_url']=empty($res['answer_url'])?'':get_setting('upload_url').$res['answer_url'].'.mp3';
		}

		return $res;
	}

	public function get_answer_question_order_other($answer_id){
		$answer_info=$this->get_answer("`answer_id`='{$answer_id}'");
		$question_info=$this->model('specialist_question')->get_question("`answer_id`='{$answer_id}'");

		$data['answer_info']=$answer_info;
		$data['question_info']=$question_info;

		return $data;
	}

	public function get_answer_specialist($where){
		$sql="SELECT ";
		$sql.="aws_specialist_answer.answer_id,";
		$sql.="aws_users.uid as specialist_uid,user_name";
		$sql.=" FROM aws_specialist_answer ";

		$sql.='LEFT JOIN aws_users ';
		$sql.='ON aws_specialist_answer.specialist_uid=aws_users.uid ';

		$res = $this->query_row($sql,$where);
		
		$res['specialist_avatar_file']=get_avatar_url($res['specialist_uid'], 'max');

		return $res;
	}

	public function select_answer(){

	}

	/**
	 * [select_answer_ids ids查询answer信息]
	 * @param  [type]     $ids [description]
	 * @return [type]          [description]
	 * @author ken
	 * @date   2016-09-19
	 */
	public function select_answer_ids($ids){
		if(is_array($ids)){
            $ids=implode(',', $ids);
        }
        
        $sql="SELECT ";
        $sql.="* ";
        $sql.="FROM aws_specialist_answer ";
        $sql.="WHERE answer_id in ($ids) ";
        $sql.="ORDER BY field(answer_id,$ids)";
        $res = $this->query_all($sql);

        foreach ($res as $key => $value) {
            $result[$value['answer_id']]=$value;
            $result[$value['answer_id']]['answer_url']=get_setting('upload_url').$value['answer_url'].'.mp3';
        }

        return $result;
	}

	/**
	 * [select_answer_order_ids uids查询answer支付记录]
	 * @param  [type]     $ids [description]
	 * @return [type]          [description]
	 * @author ken
	 * @date   2016-09-23
	 */
	public function select_answer_order_ids($ids,$uid){
		if(is_array($ids)){
            $ids=implode(',', $ids);
        }
        
        $sql="SELECT ";
        $sql.="aws_specialist_answer.*,aws_specialist_order.answer_id as order_answer_id,order_type as answer_order_type,aws_specialist_order.uid as order_uid ";
        $sql.="FROM aws_specialist_answer ";

        $sql.='LEFT JOIN aws_specialist_order ';
		$sql.='ON aws_specialist_answer.answer_id=aws_specialist_order.answer_id ';

        $sql.="WHERE `aws_specialist_answer`.`answer_id` in ( $ids ) AND `order_type`=1 AND `aws_specialist_order`.`uid`='$uid' ";
        if (!empty($ids)) {
        	$sql.="ORDER BY field(aws_specialist_answer.answer_id,$ids)";
        }
        $res = $this->query_all($sql);

        foreach ($res as $key => $value) {
            $result[$value['answer_id']]=$value['answer_id'];
            // $res[$value['order_uid']]['answer_url']='';
        }

        return $result;
	}

	public function add_answer($data){
		$insert_id=$this->insert('specialist_answer',$data);
		return $insert_id;
	}

	/**
	 * [update_answer_heat_num 问题收听数+1]
	 * @param  [type]     $answer_id [description]
	 * @return [type]                [description]
	 * @author ken
	 * @date   2016-09-26
	 */
	public function update_answer_heat_num($answer_id){
		$sql='UPDATE aws_specialist_answer SET heat_num = heat_num + 1 ';
		$sql.="WHERE answer_id = '$answer_id'";
		$affect_num=$this->query($sql);
		return $affect_num;
	}
}