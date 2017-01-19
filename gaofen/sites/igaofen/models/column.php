<?php

if (!defined('IN_ANWSION'))
{
	die;
}

class column_class extends AWS_MODEL
{
	/**
	 * [get_column 获取一条栏目]
	 * @param  [type]     $where [description]
	 * @param  [type]     $field [description]
	 * @return [type]            [description]
	 * @author ken
	 * @date   2016-12-26
	 */
	public function get_column($where = null,$field= null){
		$res=$this->fetch_field_row('column',$field,$where);
		return $res;
	}

	/**
	 * [get_column_by_id id获取一条栏目]
	 * @param  [type]     $id [description]
	 * @param  boolean    $withAttr  [description]
	 * @return [type]                [description]
	 * @author ken
	 * @date   2016-12-26
	 */
	public function get_column_by_id($id, $is_cache=false){
		$key = 'column'.$id;

		if($is_cache){
			if(!($result = AWS_APP::cache()->get($key))) {
				$result = $this->get_column("`id`='{$id}'");
				AWS_APP::cache()->set($key, $result, 20);
			}
		}
		
		$result = $this->get_column("`id`='{$id}'");

		return $this->format($result);
	}

	/**
	 * [select_column 查询多条栏目数据]
	 * @param  [type]     $field  [description]
	 * @param  [type]     $where  [description]
	 * @param  [type]     $order  [description]
	 * @param  [type]     $limit  [description]
	 * @param  [type]     $offset [description]
	 * @return [type]             [description]
	 * @author ken
	 * @date   2016-12-27
	 */
	public function select_column($field=null, $where=null, $order=null, $limit=null, $offset=null){
		$res=$this->fetch_field_all('column', $field, $where, $order, $limit, $offset);
		foreach ($res as $key => $value) {
			$res[$key] = $this->format($value);
		}
		return $res;
	}

	/**
	 * [add_column 添加栏目]
	 * @param  [type]     $data [description]
	 * @author ken
	 * @date   2016-12-27
	 */
	public function add_column($data){
		$insert_id=$this->insert('column',$data);
		return $insert_id;
	}

	/**
	 * [update_column 更新栏目信息]
	 * @param  [type]     $data  [description]
	 * @param  [type]     $where [description]
	 * @return [type]            [description]
	 * @author ken
	 * @date   2016-12-26
	 */
	public function update_column($data,$where){
		$affect_num=$this->update('column',$data,$where);
		$info = $this->get_column($where);
		$this->del_cache_by_id($info['id']);//更新后删除对应缓存，防止数据不同步
		return $affect_num;
	}

	public function update_column_ids($data,$ids){
		if(!empty($ids)){
			$column_ids_str = implode(',', $ids);
			$affect_num=$this->update('column',$data,"id in ($column_ids_str)");
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
	public function del_cache_by_id($column_id) {
		$key = 'column'.$column_id;
		return AWS_APP::cache()->delete($key);
	}

	private function format($row) {		
		$row['column_cover_url_big']		= $this->get_cover_full_path($row['column_cover_url'], 'big');
		$row['column_cover_url_small']	= $this->get_cover_full_path($row['column_cover_url'], 'small');
		$row['column_cover_url']			= $this->get_cover_full_path($row['column_cover_url']);
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
}