<?php 

if (!defined('IN_ANWSION'))
{
	die;
}

class specialist_topicCategory_class extends AWS_MODEL
{
	/**
	 * [select_category 获取一条专题分类记录]
	 * @param  [type]     $where [description]
	 * @param  [type]     $field [description]
	 * @return [type]            [description]
	 * @author ken
	 * @date   2016-08-24
	 */
	public function select_category($where = null,$field= null){
		$res=$this->fetch_field_all('specialist_topic_category',$field,$where);
		return $res;
	}

	public function add_category($data){
		$insert_id=$this->insert('specialist_topic_category',$data);
		return $insert_id;
	}
}