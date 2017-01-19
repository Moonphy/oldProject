<?php

if (!defined('IN_ANWSION'))
{
	die;
}

class special_class extends AWS_MODEL
{
	/**
	 * [get_special 获取一条]
	 * @param  [type]     $where [description]
	 * @param  [type]     $field [description]
	 * @return [type]            [description]
	 * @author ken
	 * @date   2016-12-29
	 */
	public function get_special($where = null,$field= null){
		$res=$this->fetch_field_row('special',$field,$where);
		return $res;
	}

	/**
	 * [get_special_by_id id获取一条]
	 * @param  [type]     $id       [description]
	 * @param  boolean    $is_cache [是否开启缓存]
	 * @return [type]               [description]
	 * @author ken
	 * @date   2016-12-29
	 */
	public function get_special_by_id($id, $is_cache=false){
		$key = 'special'.$id;

		if($is_cache){
			if(!($result = AWS_APP::cache()->get($key))) {
				$result = $this->get_special("`id`='{$id}'");
				AWS_APP::cache()->set($key, $result, 20);
			}
		}
		
		$result = $this->get_special("`id`='{$id}'");

		return $this->format($result);
	}

	public function select_special($field=null, $where=null, $order=null, $limit=null, $offset=null){
		$res=$this->fetch_field_all('special', $field, $where, $order, $limit, $offset);
		foreach ($res as $key => $value) {
			$res[$key] = $this->format($value);
		}
		return $res;
	}

	/**
	 * [add_special 添加专题]
	 * @param  [type]     $data [description]
	 * @author ken
	 * @date   2016-12-29
	 */
	public function add_special($data){
		$insert_id=$this->insert('special',$data);
		return $insert_id;
	}

	/**
	 * [update_special 更新专题]
	 * @param  [type]     $data  [description]
	 * @param  [type]     $where [description]
	 * @return [type]            [description]
	 * @author ken
	 * @date   2016-12-29
	 */
	public function update_special($data,$where){
		$affect_num=$this->update('special',$data,$where);
		$info = $this->get_special($where);
		$this->del_cache_by_id($info['id']);//更新后删除对应缓存，防止数据不同步
		return $affect_num;
	}

	/**
	 * [update_special_ids 批量删除专题]
	 * @param  [type]     $data [description]
	 * @param  [type]     $ids  [description]
	 * @return [type]           [description]
	 * @author ken
	 * @date   2016-12-29
	 */
	public function update_special_ids($data,$ids){
		if(!empty($ids)){
			$special_ids_str = implode(',', $ids);
			$affect_num=$this->update('special',$data,"id in ($special_ids_str)");
			foreach ($ids as $id) {
				$this->del_cache_by_id($id);//更新后删除对应缓存，防止数据不同步
			}
			return $affect_num;
		}
	}

	public function count_special($where = ''){
		if ($where) {
			$count=$this->count('special',$where);
		}else{
			$count=$this->count('special');
		}
		return $count;
	}

	/**
	 * [update_special_num 增减字段值，如所属的文章总数等]
	 * @param  [str]     $where  [description]
	 * @param  [str]     $column [增减字段]
	 * @param  string     $type   [plus为加，sub为减]
	 * @param  integer    $num    [增减数]
	 * @return [type]             [description]
	 * @author ken
	 * @date   2017-01-04
	 */
	public function update_special_num($where, $column, $type = 'plus' ,$num = 1){
		if ($type == 'plus') {
			$sql="UPDATE aws_special SET $column = $column + $num ";
		}else{
			$sql="UPDATE aws_special SET $column = $column - $num ";
		}
		$sql.="WHERE $where";
		$affect_num=$this->query($sql);
		return $affect_num;
	}

	/**
	 * 删除单条缓存
	 * @param  [type] $order_id [description]
	 * @return [type]              [description]
	 */
	public function del_cache_by_id($special_id) {
		$key = 'special'.$special_id;
		return AWS_APP::cache()->delete($key);
	}

	private function format($row) {		
		$row['special_cover_url_big']		= $this->get_cover_full_path($row['special_cover_url'], 'big');
		$row['special_cover_url_small']	= $this->get_cover_full_path($row['special_cover_url'], 'small');
		$row['special_cover_url']			= $this->get_cover_full_path($row['special_cover_url']);
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