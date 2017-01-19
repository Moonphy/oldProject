<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * 项目名称:  高分CMS
 * 建立日期:  2013年02月25日
 *
 * 后台的公共model
 *
 * @作者 heli <heli@gaofen.com>
 * @版本 $Id:
 **/

class Admin_CommonModel {

	public $lastQuery;

	public function getCount($table = '',$field = FALSE,$where = FALSE,$limit = FALSE)
	{
		if($where) $where = " AND ".$where;
		if($field){
			$sql = "SELECT SUM(".$field.") AS c FROM $table WHERE 1=1 $where";
		}else{
			$sql = "SELECT COUNT(*) AS c FROM $table WHERE 1=1 $where";
		}
		$row = $this->_db->fetchOne($sql);
		if(!$row) $row = 0;
		return $row;

	}


	/**
	 * 获取图片集
	 *
	 * @param $table 数据表
	 * @param $id 关联id
	 * @param $type 类型
	 *
	 * @return array
	 */
	public function getPicsList($table, $id, $type)
	{
		$db = $this->getAdapter();
		$select = $db->select();
		if ('lectures' == $table) {
			$select->from('gf_lectures_pic')
						->where('tid = ?', $id)
						->where('type = ?', $type);
		}
		if ('course' == $table) {
			$select->from('gf_course_pic')
						->where('tid = ?', $id)
						->where('type = ?', $type);
		}
		if ('school' == $table) {
			$select->from('gf_school_pic')
						->where('tid = ?', $id)
						->where('type = ?', $type);
		}

		$sql = $select->__toString();
		$result = $db->fetchAll($sql);
		return $result;
	}

	/**
	 * 操作讲座、讲座报告相关图片表
	 *
	 * @param $pics array 图片数据
	 * @param $type 类型
	 * @param $id 关联的id
	 *
	 * @return bool
	 */
	public function saveMapLecPicInfo($pics = array(), $id, $type)
	{
		if (empty($pics)) {
			return false;
		}

		$db = $this->getAdapter();
		//操作表名
		$table = 'gf_lectures_pic';

		//先删除之前的数据
		$where = '`tid` = "'.$id.'" AND `type` = "'.$type.'"';
		// 删除数据并得到影响的行数
		$rows_affected = $db->delete($table, $where);

		foreach ($pics['name'] as $key => $val) {
			$data = array();
			$data['title'] = $pics['info'][$key];
			$data['tid'] = $id;
			$data['src'] = $pics['uri'][$key];
			$data['order'] = $pics['order'][$key];
			$data['type'] = $type;
			$data['dateline'] = APP_LOCAL_TIMESTAMP;
			$db->insert($table, $data);
		}
		return true;
	}

	public function getRecords()
	{
		$reg = '#from\s+([^\s]+)(?=\s*(?:where(.+)|order|limit|group)?)#i';
		$m = array();
		preg_match($reg, $this->lastQuery, $m);
		if (isset($m[1])) {
			$db = $this->getAdapter();
			$sql = 'SELECT COUNT(1) AS `total` FROM '.$m[1];
			$where_str = '';
			if (isset($m[2])) {
				preg_match('#(.+?)(?:order|limit|group)#i', $m[2], $ms);
				if (isset($ms[1])) {
					$where_str = 'WHERE ' . $ms[1];
				}
			}
			$sql .= $where_str;
			$row = $db->fetchRow($sql);
			return $row['total'];
		}else{
			$sql = 'SELECT COUNT(1) AS `total` FROM '.$this->_table;
			$db = $this->getAdapter();
			$row = $db->fetchRow($sql);
			return $row['total'];
		}
		return false;
	}

	/**
	 * 记录用户操作
	 *
	 * @param string $what
	 * @param string $why 操作原因
	 * @return bool
	 */
	function admin_log($what, $why = null)
	{
		//获取操作模块地址
		/*
		$RTR =& load_class('Router');
		$class  = $RTR->fetch_class();
		$method = $RTR->fetch_method();
		$dir = $RTR->fetch_directory();
		 */

		$getRequest = Yaf_Dispatcher::getInstance()->getRequest();
		$moduleName = $getRequest->getModuleName();
		$controllerName = $getRequest->getControllerName();
		$actionName = $getRequest->getActionName();

		/*
		if ($method == 'add_save') {
			$method = 'add';
		} else if ($method == 'edit_save') {
			$method = 'edit';
		}
		 */
		//$url = empty($dir) ? '/'.$class.'/'.$method : '/'.$dir.$class.'/'.$method;
		$url = '/'.$moduleName.'/'.$controllerName.'/'.$actionName;

		$params['user_id'] = Users::uid();
		$params['user_name'] = Users::username();
		$params['real_name'] = Users::username();
		$params['what'] = $what;
		$params['where'] = $url;
		if (!empty($why)) {
			$params['why'] = $why;
		}
		$params['log_time'] = time();

		$db = $this->getAdapter();
		//操作表名
		$table = 'gf_admin_log';
		return $db->insert($table, $params);
	}

	/**
	 *获取一天sql语句信息
	 */
	public function getSql($sql){
		$db = $this->getAdapter();
		return $db->fetchAll($sql);
	}

}

