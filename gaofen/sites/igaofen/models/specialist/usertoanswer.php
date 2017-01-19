<?php 

if (!defined('IN_ANWSION'))
{
	die;
}

class specialist_usertoanswer_class extends AWS_MODEL
{
	/**
	 * [get_usertoanswer 获取一条记录]
	 * @param  [type]     $where [description]
	 * @param  [type]     $field [description]
	 * @return [type]            [description]
	 * @author ken
	 * @date   2016-08-24
	 */
	public function get_usertoanswer($where = null,$field= null){
		$res=$this->fetch_field_row('specialist_usertoanswer',$field,$where);
		return $res;
	}

	public function get_usertoanswer_by_id($id) {
		$id = (int)$id;

		$key = 'specialist_usertoanswer_'.$id;
		if(!($result = AWS_APP::cache()->get($key))) {
			$result = $this->get_usertoanswer("`id`='{$id}'");
			AWS_APP::cache()->set($key, $result, get_setting('cache_level_normal'));
		}

		return $result;
	}

	public function add_usertotopic(){
		$insert_id=$this->insert('specialist_usertotopic',$data);
		return $insert_id;
	}
}