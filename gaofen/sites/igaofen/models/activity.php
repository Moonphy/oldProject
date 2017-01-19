<?php

if (!defined('IN_ANWSION'))
{
	die;
}

class activity_class extends AWS_MODEL
{
	/**
	 * [get_activity 获取一条活动]
	 * @param  [type]     $where [description]
	 * @param  [type]     $field [description]
	 * @return [type]            [description]
	 * @author ken
	 * @date   2016-12-26
	 */
	public function get_activity($where = null,$field= null){
		$res=$this->fetch_field_row('activity',$field,$where);
		return $res;
	}

	/**
	 * [get_activity_by_id id获取一条活动]
	 * @param  [type]     $id [description]
	 * @param  boolean    $withAttr  [description]
	 * @return [type]                [description]
	 * @author ken
	 * @date   2016-12-26
	 */
	public function get_activity_by_id($id, $is_cache=false){
		$key = 'activity'.$id;

		if($is_cache){
			if(!($result = AWS_APP::cache()->get($key))) {
				$result = $this->get_activity("`id`='{$id}'");
				AWS_APP::cache()->set($key, $result, 20);
			}
		}
		
		$result = $this->get_activity("`id`='{$id}'");

		$res = $this->format($result);

		return $res;
	}

	private function format($row) {		
		$row['activity_cover_url_big']		= $this->get_cover_full_path($row['activity_cover_url'], 'big');
		$row['activity_cover_url_small']	= $this->get_cover_full_path($row['activity_cover_url'], 'small');
		$row['activity_cover_url']			= $this->get_cover_full_path($row['activity_cover_url']);
		return $row;
	}

	/**
	 * 获取图片绝对地址
	 * @var string
	 */
	public function get_cover_full_path($url, $size='normal') {
		if ($url) {
			switch($size) {
				case 'big':
				case 'small':
					$url = get_setting('upload_url').dirname($url).'/'.$size.'_'.basename($url);
				break;

				default:
					$url = get_setting('upload_url').dirname($url).'/'.basename($url);
				break;
			}
		} else {
			$url = G_STATIC_URL.'/img/gaofen_new/article-default-img.jpg';
		}

		return $url;
	}

	/**
	 * [select_activity 查询多条活动数据]
	 * @param  [type]     $field  [description]
	 * @param  [type]     $where  [description]
	 * @param  [type]     $order  [description]
	 * @param  [type]     $limit  [description]
	 * @param  [type]     $offset [description]
	 * @return [type]             [description]
	 * @author ken
	 * @date   2016-12-27
	 */
	public function select_activity($field=null, $where=null, $order=null, $limit=null, $offset=null){
		$res=$this->fetch_field_all('activity', $field, $where, $order, $limit, $offset);
		foreach ($res as $key => $value) {
			$res[$key] = $this->format($value);
		}
		return $res;
	}

	/**
	 * [add_activity 添加活动]
	 * @param  [type]     $data [description]
	 * @author ken
	 * @date   2016-12-27
	 */
	public function add_activity($data){
		$insert_id=$this->insert('activity',$data);
		return $insert_id;
	}

	/**
	 * [update_activity 更新活动信息]
	 * @param  [type]     $data  [description]
	 * @param  [type]     $where [description]
	 * @return [type]            [description]
	 * @author ken
	 * @date   2016-12-26
	 */
	public function update_activity($data,$where){
		$affect_num=$this->update('activity',$data,$where);
		$info = $this->get_activity($where);
		$this->del_cache_by_id($info['id']);//更新后删除对应缓存，防止数据不同步
		return $affect_num;
	}

	public function update_activity_ids($data,$ids){
		if(!empty($ids)){
			$activity_ids_str = implode(',', $ids);
			$affect_num=$this->update('activity',$data,"id in ($activity_ids_str)");
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
	public function del_cache_by_id($activity_id) {
		$key = 'activity'.$activity_id;
		return AWS_APP::cache()->delete($key);
	}
}