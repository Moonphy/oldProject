<?php 

if (!defined('IN_ANWSION'))
{
	die;
}

class specialist_topic_class extends AWS_MODEL
{
	/**
	 * [get_topic 查询一条专题记录]
	 * @param  [string]     $where [查询条件]
	 * @param  [array]     $field [可选字段]
	 * @return [array]            [查询结果]
	 * @author ken
	 * @date   2016-08-22
	 */
	public function get_topic($where = null,$field= null){
		$res = $this->fetch_field_row('specialist_topic',$field,$where);		
		return $this->format($res);
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
			$url = G_STATIC_URL.'/specialist/img/audio-current-img.png';
		}

		return $url;
	}


	public function get_topic_by_id($topic_id) {
		$topic_id = (int)$topic_id;
		$result = $this->get_topic("`topic_id`='{$topic_id}'");
		return $result;
	}

	/**
	 * [select_topic 查询多条专题记录]
	 * @param  [type]     $field  [description]
	 * @param  [type]     $where  [description]
	 * @param  [type]     $order  [description]
	 * @param  [type]     $limit  [description]
	 * @param  [type]     $offset [description]
	 * @return [type]             [description]
	 * @author ken
	 * @date   2016-09-13
	 */
	public function select_topic($field=null, $where=null, $order=null, $limit=null, $offset=null){
		$res=$this->fetch_field_all('specialist_topic', $field, $where, $order, $limit, $offset);
		foreach ($res as $key => $value) {
			$res[$key] = $this->format($value);
		}
		return $res;
	}

	private function format($row) {		
		$row['topic_cover_url_big']		= $this->get_cover_full_path($row['topic_cover_url'], 'big');
		$row['topic_cover_url_small']	= $this->get_cover_full_path($row['topic_cover_url'], 'small');
		$row['topic_cover_url']			= $this->get_cover_full_path($row['topic_cover_url']);
		$row['topic_voice_url']			= empty($row['topic_voice_url'])?'':get_setting('upload_url').$row['topic_voice_url'].'.mp3';
		return $row;

	}

	/**
	 * [select_topic_with_specialist 查询专题和教师信息]
	 * @param  integer    $limit  [description]
	 * @param  integer    $offset [description]
	 * @return [type]             [description]
	 * @author ken
	 * @date   2016-09-11
	 */
	public function select_topic_with_specialist($limit=2,$offset=0,$order_by='update_time DESC',$where=''){

		if($where!=''){
			$where=$where;
		}else{
			$where=1;
		}

		$sql="SELECT ";
		$sql.="user_name,topic_id,topic_name,topic_description,topic_cover_url,topic_voice_url,add_time,update_time,specialist_uid,question_num,fans_count,friend_count,topic_category_id,special_id,listen_num,is_show ";
		$sql.="FROM aws_specialist_topic ";

		$sql.="LEFT JOIN aws_users ON aws_specialist_topic.specialist_uid=aws_users.uid ";

		$sql.="WHERE $where ";
		$sql.="ORDER BY $order_by ";
		$sql.="LIMIT ".$offset.','.$limit;
		$res = $this->query_all_other($sql);

		foreach ($res as $key => $value) {
			$res[$key] = $this->format($value);
		}

		return $res;
	}

	public function count_topic_with_specialist($where=''){
		if($where!=''){
			$where=$where;
		}else{
			$where=1;
		}

		$sql="SELECT ";
		$sql.="topic_id ";
		$sql.="FROM aws_specialist_topic ";

		$sql.="LEFT JOIN aws_users ON aws_specialist_topic.specialist_uid=aws_users.uid ";

		$sql.="WHERE $where ";
		$res = count($this->query_all_other($sql));

		return $res;
	}

	/**
	 * [select_topic_specialist 查询发布过方法的专家信息]
	 * @param  integer    $limit    [description]
	 * @param  integer    $offset   [description]
	 * @param  string     $order_by [description]
	 * @return [type]               [description]
	 * @author ken
	 * @date   2016-09-12
	 */
	public function select_topic_specialist($limit=2,$offset=0,$order_by='update_time DESC',$where=''){
		
		if($where!=''){
			$where=$where;
		}else{
			$where=1;
		}

		$sql="SELECT ";
		$sql.="topic_name,topic_category_id,user_name,signature,topic_num,introduction,specialist_uid,aws_users_gaofen.fans_count,aws_users_gaofen.friend_count,avatar_file,topic_id ";
		$sql.="FROM aws_specialist_topic ";

		$sql.="LEFT JOIN aws_users_gaofen ON aws_specialist_topic.specialist_uid=aws_users_gaofen.uid ";

		$sql.="LEFT JOIN aws_users ON aws_specialist_topic.specialist_uid=aws_users.uid ";

		$sql.="LEFT JOIN aws_users_attrib ON aws_specialist_topic.specialist_uid=aws_users_attrib.uid ";

		$sql.="WHERE $where ";
		$sql.="GROUP BY specialist_uid ";
		$sql.="ORDER BY $order_by ";
		$sql.="LIMIT ".$offset.','.$limit;
		$res = $this->query_all_other($sql);

		return $res;
	}

	/**
	 * [add_topic 添加专题]
	 * @param  [type]     $data [description]
	 * @author ken
	 * @date   2016-08-24
	 */
	public function add_topic($data){
		$insert_id=$this->insert('specialist_topic',$data);
		return $insert_id;
	}

	/**
	 * [select_topic_user 查询发布专题的专家(由多到少排序)]
	 * @return [type]     [description]
	 * @author ken
	 * @date   2016-08-29
	 */
	public function select_topic_user(){
		$sql="SELECT ";
		$sql.="specialist_uid,COUNT(specialist_uid) as uid_sum,topic_id ";
		$sql.="FROM aws_specialist_topic ";
		$sql.='GROUP BY specialist_uid ';
		$sql.='ORDER BY uid_sum DESC ';
		$sql.='LIMIT 5';
		$res = $this->query_all_other($sql);

		foreach ($res as $value) {
			$ids[]=$value['specialist_uid'];
		}

		$uids="'".implode("','", $ids)."'";

		$sql_u="SELECT ";
		$sql_u.="* ";
		$sql_u.="FROM aws_users ";

		$sql_u.="LEFT JOIN aws_users_attrib ON aws_users.uid=aws_users_attrib.uid ";

		$sql_u.="LEFT JOIN aws_users_gaofen ON aws_users.uid=aws_users_gaofen.uid ";

		$sql_u.="WHERE aws_users.uid IN ($uids) ";
		$sql_u.="ORDER BY field(aws_users.uid,$uids)";
		$result = $this->query_all_other($sql_u);
		return $result;
	}

	/**
	 * [select_topic_user_another 查询发布专题最多的专家数据]
	 * @param  integer    $limit  [description]
	 * @param  integer    $offset [description]
	 * @return [type]             [description]
	 * @author ken
	 * @date   2016-09-21
	 */
	public function select_topic_user_another($limit=5,$offset=0,$order_by='topic_num DESC'){
		$sql="SELECT ";
		$sql.="topic_num,uid ";
		$sql.="FROM aws_users_gaofen ";
		$sql.="WHERE topic_num > 0 ";
		if($order_by!=''){
			$sql.="ORDER BY $order_by ";
		}
		$sql.="LIMIT $offset,$limit";
		$res = $this->query_all_other($sql);

		foreach ($res as $value) {
			$ids[]=$value['uid'];
		}

		$uids="'".implode("','", $ids)."'";

		$sql_u="SELECT ";
		$sql_u.="user_name,signature,introduction,aws_users_gaofen.fans_count,aws_users_gaofen.friend_count,specialist_uid,topic_id,aws_specialist_topic.topic_id,topic_num ";
		$sql_u.="FROM aws_users ";

		$sql_u.="LEFT JOIN aws_users_attrib ON aws_users.uid=aws_users_attrib.uid ";

		$sql_u.="LEFT JOIN aws_users_gaofen ON aws_users.uid=aws_users_gaofen.uid ";

		$sql_u.="LEFT JOIN aws_specialist_topic ON aws_users.uid=aws_specialist_topic.specialist_uid ";

		$sql_u.="WHERE aws_users.uid IN ($uids) AND group_id=100 ";
		$sql_u.="GROUP BY aws_users.uid ";
		$sql_u.="ORDER BY field(aws_users.uid,$uids),topic_id DESC";
		$result = $this->query_all_other($sql_u);
		return $result;
	}

	/**
	 * [select_topic_user_other 根据搜索添加查询专题信息和专家]
	 * @param  [type]     $where [description]
	 * @return [type]            [description]
	 * @author ken
	 * @date   2016-08-29
	 */
	public function select_topic_user_other($where=1){
		$sql="SELECT ";
		$sql.="aws_specialist_topic.*,";
		$sql.="aws_users.user_name,aws_users.uid ";

		$sql.="FROM aws_specialist_topic ";

		$sql.="LEFT JOIN aws_users ON aws_specialist_topic.specialist_uid=aws_users.uid ";
		$sql.="WHERE $where ";
		$sql.="LIMIT 10";
		$result = $this->query_all_other($sql);

		return $result;
	}

	/**
	 * [select_topic_ids description]
	 * @param  [type]     $ids [description]
	 * @return [type]           [description]
	 * @author ken
	 * @date   2016-09-19
	 */
	public function select_topic_ids($ids){
		if(is_array($ids)){
            $ids="'".implode("','", $ids)."'";
        }
        
        $sql="SELECT ";
        $sql.="* ";
        $sql.="FROM aws_specialist_topic ";
        $sql.="WHERE topic_id in ($ids) ";
        $sql.="ORDER BY field(topic_id,$ids)";
        $res = $this->query_all($sql);

        foreach ($res as $key => $value) {
            $result[$value['topic_id']]=$value;
            $result[$value['topic_id']]['topic_cover_url']=$this->get_cover_full_path($value['topic_cover_url']);
            $result[$value['topic_id']]['topic_cover_url_big'] = $this->get_cover_full_path($value['topic_cover_url'],'big');
            $result[$value['topic_id']]['topic_cover_url_small'] = $this->get_cover_full_path($value['topic_cover_url'],'small');
        }

        return $result;
	}

	/**
	 * [select_topic_uids uids获取最新topic信息]
	 * @param  [type]     $uids [uids数组或字符串]
	 * @return [type]           [description]
	 * @author ken
	 * @date   2016-09-20
	 */
	public function select_topic_uids($uids){
		if(is_array($uids)){
            $uids="'".implode("','", $uids)."'";
        }
        
        $sql="SELECT ";
        $sql.="* ";
        $sql.="FROM aws_specialist_topic ";

        $sql.="WHERE specialist_uid in ($uids) ";
        $sql.="GROUP BY specialist_uid ";
        $sql.="ORDER BY add_time DESC";
        $res = $this->query_all($sql);

        foreach ($res as $key => $value) {
            $result[$value['specialist_uid']]=$value;
            $result[$value['specialist_uid']]['topic_cover_url']=get_setting('upload_url').$value['topic_cover_url'];
        }

        return $result;
	}

	/**
	 * [count_topic description]
	 * @param  [type]     $where [description]
	 * @return [type]            [description]
	 * @author ken
	 * @date   2016-08-30
	 */
	public function count_topic($where=null){
		$count=$this->count('specialist_topic',$where);
		return $count;
	}

	/**
	 * [update 更新专题记录]
	 * @param  [type]     $data [description]
	 * @return [type]           [description]
	 * @author ken
	 * @date   2016-08-30
	 */
	public function update_topic($data,$where){
		$affect_num=$this->update('specialist_topic',$data,$where);
		$info = $this->get_topic($where);
		$this->del_cache_by_id($info['topic_id']);//更新后删除对应缓存，防止数据不同步
		return $affect_num;
	}

	/**
	 * 删除单条缓存
	 * @param  [type] $question_id [description]
	 * @return [type]              [description]
	 */
	public function del_cache_by_id($question_id) {
		$key = 'specialist_topic_'.$question_id;
		return AWS_APP::cache()->delete($key);
	}

	/**
	 * [update_topic_question 问题总数+1]
	 * @param  [type]     $where [description]
	 * @return [type]            [description]
	 * @author ken
	 * @date   2016-09-13
	 */
	public function update_topic_question($where){
		$sql='UPDATE aws_specialist_topic SET question_num = question_num + 1 ';
		$sql.="WHERE $where";
		$affect_num=$this->query($sql);
		return $affect_num;
	}
}