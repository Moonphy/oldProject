<?php

if (!defined('IN_ANWSION'))
{
	die;
}

class age_class extends AWS_MODEL
{
	/**
	 * [get_age 获取一条年龄段]
	 * @param  [type]     $where [description]
	 * @param  [type]     $field [description]
	 * @return [type]            [description]
	 * @author ken
	 * @date   2016-12-26
	 */
	public function get_age($where = null,$field= null){
		$res=$this->fetch_field_row('age',$field,$where);
		return $res;
	}

	/**
	 * [get_age_by_id id获取一条年龄段]
	 * @param  [type]     $id [description]
	 * @param  boolean    $withAttr  [description]
	 * @return [type]                [description]
	 * @author ken
	 * @date   2016-12-26
	 */
	public function get_age_by_id($id, $is_cache=false){
		$key = 'age'.$id;

		if($is_cache){
			if(!($result = AWS_APP::cache()->get($key))) {
				$result = $this->get_age("`id`='{$id}'");
				AWS_APP::cache()->set($key, $result, 20);
			}
		}
		
		$result = $this->get_age("`id`='{$id}'");

		return $result;
	}

	/**
	 * [select_age 查询多条年龄段数据]
	 * @param  [type]     $field  [description]
	 * @param  [type]     $where  [description]
	 * @param  [type]     $order  [description]
	 * @param  [type]     $limit  [description]
	 * @param  [type]     $offset [description]
	 * @return [type]             [description]
	 * @author ken
	 * @date   2016-12-27
	 */
	public function select_age($field=null, $where=null, $order=null, $limit=null, $offset=null){
		$res=$this->fetch_field_all('age', $field, $where, $order, $limit, $offset);

		return $res;
	}

	/**
	 * [add_age 添加年龄段]
	 * @param  [type]     $data [description]
	 * @author ken
	 * @date   2016-12-27
	 */
	public function add_age($data){
		$insert_id=$this->insert('age',$data);
		return $insert_id;
	}

	/**
	 * [update_age 更新年龄段信息]
	 * @param  [type]     $data  [description]
	 * @param  [type]     $where [description]
	 * @return [type]            [description]
	 * @author ken
	 * @date   2016-12-26
	 */
	public function update_age($data,$where){
		$affect_num=$this->update('age',$data,$where);
		$info = $this->get_age($where);
		$this->del_cache_by_id($info['id']);//更新后删除对应缓存，防止数据不同步
		return $affect_num;
	}

	public function update_age_ids($data,$ids){
		if(!empty($ids)){
			$age_ids_str = implode(',', $ids);
			$affect_num=$this->update('age',$data,"id in ($age_ids_str)");
			foreach ($ids as $id) {
				$this->del_cache_by_id($id);//更新后删除对应缓存，防止数据不同步
			}
			return $affect_num;
		}
	}

	/**
	 * 删除单条缓存
	 * @param  [type] $order_id [description]
	 * @return [type]              [description]
	 */
	public function del_cache_by_id($age_id) {
		$key = 'age'.$age_id;
		return AWS_APP::cache()->delete($key);
	}
}