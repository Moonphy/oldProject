<?php
/**
 * 
 */

if (!defined('IN_ANWSION'))
{
    die;
}


class plugin_publisher_model_class extends AWS_MODEL {
	static $table_name = 'plugin_publisher';

	/**
	 * 保存发布任务
	 * @return [type] [description]
	 */
	public function save_data($data, $id='') {
		$available_fields = [
			'id'	=>'',
			'uid'	=>'',
			'mj_id'	=>'',
			'data'	=>'',
			'type'	=>'',
			'is_publish'	=>'',
			'publish_id'	=>'',
			'publish_time'	=>'',
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
	 * 获取发布器任务列表
	 * @param  integer $type       [description]
	 * @param  boolean $is_publish [description]
	 * @return [type]              [description]
	 */
	public function get_publsher_list($type=0, $is_publish=false, $limit=1) {
		$wheres = [];

		if($type) {
			$wheres[] = "`type`='{$type}'";
		}

		if(is_bool($is_publish)) {
			$is_publish = (int)$is_publish;
			$wheres[] = "`is_publish`='{$is_publish}'";
		}

		return $this->fetch_all(static::$table_name, implode(' AND ', $wheres), 'publish_time asc', $limit);
	}


	/**
	 * 初始化插件数据库
	 * @return [type] [description]
	 */
	public function init_db() {
		return $this->create_publisher_table();
	}

	private function create_publisher_table() {
		$sql = "CREATE TABLE `".$this->get_table(static::$table_name)."` (
			  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
			  `uid` int(10) unsigned NOT NULL COMMENT '用户ID',
			  `mj_id` int(11) DEFAULT NULL COMMENT '马甲ID',
			  `data` text,
			  `type` tinyint(3) unsigned NOT NULL COMMENT '1:question 2:article',
			  `is_publish` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否已发布',
			  `publish_time` int(10) unsigned NOT NULL COMMENT '发布时间',
			  `publish_id` int(10) unsigned NOT NULL COMMENT '已发布ID',
			  `add_time` int(10) unsigned NOT NULL COMMENT '添加时间',
			  PRIMARY KEY (`id`),
			  KEY `publish_time` (`publish_time`)
			) ENGINE=MyISAM DEFAULT CHARSET=utf8;";

			return $this->db()->query($sql);
	}
}