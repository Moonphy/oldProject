<?php 

if (!defined('IN_ANWSION'))
{
	die;
}

class specialist_topicTips_class extends AWS_MODEL
{

	/**
	 * [get_tips 获取单个topic_tips信息]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-10-24
	 */
	public function get_tips($field,$where){
		$res = $this->fetch_field_row('specialist_topic_tips',$field,$where);		
		return $res;
	}

	/**
	 * [select_tips 查询多个方法名提示]
	 * @param  [type]     $where [description]
	 * @param  [type]     $field [description]
	 * @return [type]            [description]
	 * @author ken
	 * @date   2016-10-24
	 */
	public function select_tips($field=null, $where=null, $order=null, $limit=null, $offset=null){
		$res = $this->fetch_field_all('specialist_topic_tips', $field, $where, $order, $limit, $offset);
		
		$category_ids = [];
		foreach ($res as $key => $value) {
			$category_ids[] = $value['category_id'];
		}

		if (!empty($category_ids)) {
			$category_ids_str = '"'.implode('","', $category_ids).'"';

			$sql.="SELECT * FROM aws_specialist_topic_category WHERE id IN ($category_ids_str)";
			$rs = $this->query_all_other($sql);

			foreach ($res as $key => $value) {
				foreach ($rs as $k => $v) {
					if($value['category_id'] == $v['id']){
						$res[$key]['category_name'] = $v['category_name'];
					}
				}
			}
		}else{
			foreach ($res as $key => $value) {
				$res[$key]['category_name'] = '';
			}
		}
		
		return $res;
	}

	public function add_tips($data){
		$insert_id = $this->insert('specialist_topic_tips',$data);
		return $insert_id;
	}

	/**
	 * [update_tips 更新topic_tips]
	 * @param  [type]     $data  [description]
	 * @param  [type]     $where [description]
	 * @return [type]            [description]
	 * @author ken
	 * @date   2016-10-24
	 */
	public function update_tips($data,$where){
		$affect_num=$this->update('specialist_topic_tips',$data,$where);
		return $affect_num;
	}

	/**
	 * 删除单条缓存
	 * @param  [type] $question_id [description]
	 * @return [type]              [description]
	 */
	public function del_cache_by_id($id) {
		$key = 'specialist_topic_tips'.$id;
		return AWS_APP::cache()->delete($key);
	}

	public function count_topic_tips($where=null){
		$count=$this->count('specialist_topic_tips',$where);
		return $count;
	}
}