<?php 

if (!defined('IN_ANWSION'))
{
	die;
}

class specialist_usertospecialist_class extends AWS_MODEL
{
	/**
	 * [get_usertospecialist 获取一条记录]
	 * @param  [type]     $where [description]
	 * @param  [type]     $field [description]
	 * @return [type]            [description]
	 * @author ken
	 * @date   2016-08-24
	 */
	public function get_usertospecialist($where = null,$field= null){
		$res=$this->fetch_field_row('specialist_usertospecialist',$field,$where);
		return $res;
	}

	public function add_usertoanswer(){
		$insert_id=$this->insert('specialist_usertoanswer',$data);
		return $insert_id;
	}
}