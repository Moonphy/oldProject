<?php 

if (!defined('IN_ANWSION'))
{
	die;
}

class specialist_template_class extends AWS_MODEL
{

	public function get_template($where = null,$field= null){
		$res=$this->fetch_field_row('specialist_template',$field,$where);
		return $res;
	}

	public function select_template($field=null, $where=null, $order=null, $limit=null, $offset=null){
		$res=$this->fetch_field_all('specialist_template', $field, $where, $order, $limit, $offset);
		foreach ($res as $key => $value) {
			$res[$key]['message'] = json_decode($value['message']);
		}
		return $res;
	}

	public function add_template($data){
		$insert_id=$this->insert('specialist_template',$data);
		return $insert_id;
	}
}