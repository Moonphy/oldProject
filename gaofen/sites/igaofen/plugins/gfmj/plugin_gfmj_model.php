<?php
/**
 * 
 */

if (!defined('IN_ANWSION'))
{
    die;
}


class plugin_gfmj_model_class extends AWS_MODEL {
	static $table_name = 'plugin_gfmj';

	/**
	 * 保存发布任务
	 * @return [type] [description]
	 */
	public function save_data($data, $id='') {
		$available_fields = [
			'id'	=>'',
			'group_id'	=>'',
			'mj_id'	=>'',
			'mj_nickname'	=>'',
			'flag'	=>'',
			'add_time'	=>'',
		];

		$data['add_time']	= time();
		$data = array_intersect_key($data, $available_fields);

		if( $id ) {
			return $this->update(static::$table_name, $data, "`id`='{$id}'");
		} else {
			return $this->insert(static::$table_name, $data);
		}
	}

	/**
	 * 删除记录
	 * @param  [type] $id [description]
	 * @return [type]     [description]
	 */
	public function del($id) {
		return $this->delete(static::$table_name, "`id`='{$id}'");
	}


	/**
	 * 获取条数据
	 * @param  [type] $id [description]
	 * @return [type]     [description]
	 */
	public function get($id) {
		return $this->fetch_row(static::$table_name, "`id`='{$id}'");
	}

	/**
	 * 用分组ID获取相关马甲ID
	 * @param  integer $group_id       马甲分组ID
	 * @return [type]              [description]
	 */
	public function get_list_by_group_id($group_id=0, $limit=20) {
		$wheres = [];

		if($group_id) {
			$wheres[] = "`group_id`='{$group_id}'";
		}else{
			return [];
		}

		return $this->fetch_all(static::$table_name, implode(' AND ', $wheres), 'add_time desc', $limit);
	}

	/**
	 * 获取相关的马甲数据
	 * @param  array  $uids 马甲IDS
	 * @param  int $group_id 分组ID
	 * @return [type]       [description]
	 */
	public function get_list_by_uids(array $uids, $group_id=0) {
		foreach($uids as $k=>$v) {
			if(!is_numeric($v)) {
				unset($uids[$k]);
			}
		}
		
		if(empty($uids)) {
			return [];
		}

		$wheres[] = "`mj_id` in('".implode("','", $uids)."')";

		if($group_id) {
			$wheres[] = "`group_id`='{$group_id}'";
		}

		return $this->fetch_all(static::$table_name, implode(' AND ', $wheres), 'add_time desc');
	}


	/**
	 * 初始化插件数据库
	 * @return [type] [description]
	 */
	public function init_db() {
		return $this->create_table();
	}

	private function create_table() {
		$sql = "
			CREATE TABLE `".$this->get_table(static::$table_name)."` (
			  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
			  `group_id` int(10) unsigned NOT NULL COMMENT '分组ID，为当前用户ID',
			  `mj_id` int(10) unsigned NOT NULL COMMENT '马甲uid',
			  `mj_nickname` varchar(50) DEFAULT NULL COMMENT '马甲昵称',
			  `flag` varchar(20) DEFAULT NULL COMMENT '马甲标识',
			  `add_time` int(10) unsigned NOT NULL COMMENT '添加时间',
			  PRIMARY KEY (`id`),
  			  KEY `group_id` (`group_id`)
			) ENGINE=MyISAM DEFAULT CHARSET=utf8;
		";

			return $this->db()->query($sql);
	}
}