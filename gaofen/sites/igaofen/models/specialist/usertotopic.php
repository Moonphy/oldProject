<?php 

if (!defined('IN_ANWSION'))
{
	die;
}

class specialist_usertotopic_class extends AWS_MODEL
{
	/**
	 * [get_usertotopic 获取一条usertotopic数据]
	 * @param  [type]     $where [description]
	 * @param  [type]     $field [description]
	 * @return [type]            [description]
	 * @author ken
	 * @date   2016-08-24
	 */
	public function get_usertotopic($where = null,$field= null){
		$res=$this->fetch_field_row('specialist_usertotopic',$field,$where);
		return $res;
	}
}