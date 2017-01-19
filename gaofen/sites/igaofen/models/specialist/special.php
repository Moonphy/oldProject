<?php 

if (!defined('IN_ANWSION'))
{
	die;
}

class specialist_special_class extends AWS_MODEL
{
	/**
	 * [get_special 获取一条专辑记录]
	 * @param  [type]     $where [description]
	 * @param  [type]     $field [description]
	 * @return [type]            [description]
	 * @author ken
	 * @date   2016-08-24
	 */
	public function get_special($where = null,$field= null){
		$res=$this->fetch_field_row('specialist_special',$field,$where);
		// $res['special_cover_url'] = get_setting('upload_url').$res['special_cover_url'];
		$special_cover_url = $res['special_cover_url'];
		$res['special_cover_url'] = $this->model('specialist_topic')->get_cover_full_path($res['special_cover_url']);
		$res['special_cover_url_big'] = $this->model('specialist_topic')->get_cover_full_path($special_cover_url,'big');
		$res['special_cover_url_small'] = $this->model('specialist_topic')->get_cover_full_path($special_cover_url,'small');
		return $res;
	}

	/**
	 * 获取单个专辑
	 * @param  [type] $special_id [description]
	 * @return [type]             [description]
	 */
	public function get_special_by_id($special_id, $use_cache=true) {
		$special_id = (int)$special_id;
		
		$key = 'specialist_special_'.$special_id;
		if($use_cache==false || !($result = AWS_APP::cache()->get($key))) {
			$result = $this->get_special("`id`='{$special_id}'");
			AWS_APP::cache()->set($key, $result, get_setting('cache_level_normal'));
		}

		return $result;
	}

	public function select_special($where = null, $field= null, $order = null, $limit = 10, $offset = 0){
		
		// $key = 'specialist_special_select_'.$limit.'_'.$offset;
		// if(!($result = AWS_APP::cache()->get($key))) {
			$result = $this->fetch_field_all('specialist_special',$field,$where,$order,$limit,$offset);
			foreach ($result as $k => $value) {
				$result[$k]['special_cover_url']=get_setting('upload_url').$value['special_cover_url'];
			}
		// 	AWS_APP::cache()->set($key, $result, 5);
		// }

		return $result;
	}

	public function count_special($where=null){
		$count=$this->count('specialist_special',$where);
		return $count;
	}

	public function select_special_topic($where,$limit=2,$offset=0,$order_by='update_time DESC'){
		$sql="SELECT ";
		$sql.="aws_specialist_topic.add_time,topic_id,topic_name,question_num,topic_description,topic_cover_url,topic_voice_url,update_time,special_id,listen_num,user_name ";
		$sql.="FROM aws_specialist_topic ";

		$sql.="LEFT JOIN aws_users ON aws_specialist_topic.specialist_uid=aws_users.uid ";

		$sql.="LEFT JOIN aws_users_attrib ON aws_specialist_topic.specialist_uid=aws_users_attrib.uid ";

		$sql.="WHERE $where ";

		$sql.="ORDER BY $order_by ";
		$sql.="LIMIT ".$offset.','.$limit;
		$res = $this->query_all_other($sql);

		// foreach ($res as $key => $value) {
		// 	$res[$key]['topic_cover_url']=get_setting('upload_url').$value['topic_cover_url'];
		// 	$res[$key]['topic_voice_url']=get_setting('upload_url').$value['topic_voice_url'];
		// }

		foreach ($res as $key => $value) {
			$res[$key] = $this->format($value);
		}

		return $res;
	}

	public function add_special($data){
		$insert_id=$this->insert('specialist_special',$data);
		return $insert_id;
	}

	/**
	 * 获取图片绝对地址
	 * @var string
	 */
	private function get_cover_full_path($url, $size='normal') {
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
			$url = G_STATIC_URL.'/specialist/img/audio-current-img.png';
		}

		return $url;
	}

	private function format($row) {		
		$row['topic_cover_url_big']=$this->get_cover_full_path($row['topic_cover_url'], 'big');
		$row['topic_cover_url_small']=$this->get_cover_full_path($row['topic_cover_url'], 'small');
		$row['topic_cover_url']=$this->get_cover_full_path($row['topic_cover_url']);
		$row['topic_voice_url']=get_setting('upload_url').$row['topic_voice_url'].'.mp3';
		return $row;
	}


	/**
     * 用作数值字段递增或递减
     * @param  [type] $id    [description]
     * @param  [type] $field  [description]
     * @param  [type] $value  [description]
     * @param  string $method [description]
     * @return [type]         [description]
     */
    public function calc_by_id_by_field($id, $field, $value=1, $method='incr') {
        $id = $this->quote($id);
        $field = $this->quote($field);
        $value = $this->quote($value);

        $sign = ($method =='decr') ? '-':'+';

        $sql = 'UPDATE `'.$this->get_table('specialist_special').'` SET `'.$field.'`=`'.$field.'`'.$sign.$value.' WHERE `id`="'.$id.'";';
        return $this->db()->query($sql);
    }

    /**
     * [update_special 更新专辑]
     * @param  [type]     $data  [description]
     * @param  [type]     $where [description]
     * @return [type]            [description]
     * @author ken
     * @date   2016-11-04
     */
    public function update_special($data,$where){
		$affect_num=$this->update('specialist_special',$data,$where);
		// $info = $this->get_special($where);
		// $this->del_cache_by_id($info['id']);//更新后删除对应缓存，防止数据不同步
		return $affect_num;
	}
}