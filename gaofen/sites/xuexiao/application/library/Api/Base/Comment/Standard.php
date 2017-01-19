<?php
/**
 * 此standard APi是快捷评价插件API，与Comment互不相通，是一个独立存在
 */
namespace Api\Base\Comment;

use Api\Base as ApiBase;
use Api\OpenApi;
use Api\Base\Traits\TableUnit;

class Standard extends ApiBase\Base {

	use TableUnit;

	static $_LIST_BY_TYPE_CACHE_KEY = 'cmt:std:cond:list';
	static $_GET_CACHE_KEY = 'cmt:std:id';
	static $_TABLE_UNIT_KEY = 'cmt:std:unit:id';//浏览数缓存

	private $_model = NULL;

	static $use_all_list=false;

	function __construct(\Api_Comment_StandardModel $model) {
		$this->_model = $model;
	}

	/**
	 * 保存数据
	 *
	 * @param mixed $data
	 * @param mixed $id
	 * @param mixed autoRefresh 自动更新缓存
	 */
	public function save($data, $id = '', $autoRefresh = true) {

		$fields = array('id'=>'int', 'root_id'=>'int', 'parent_id'=>'int', 'uid'=>'int',
						'project_id'=>'', 'thread_id'=>'', 'message'=>'', 'ip'=>'', 'is_verify'=>'int');

		$_tmp = array();
		$rs = false;

		$_oldData = $values = array();
		if ($id) {
			$_oldData = $this->get($id, false, false);
			if($_oldData) $_oldData = $_oldData->toArray();
		}

		$data = $this->paramsValid($fields, $data, $_oldData);

		if ($id) {
			$rs = $this->_model->save($data, $id);
			if ($rs && $autoRefresh) {
				$this->_setCache('update', $id, $_oldData, static::$use_all_list);
				$rs = $this->get($id);
			}
		} else {
			$rs = $this->_model->save($data);
			$id = isset($rs['id']) ? $rs['id'] : '';
			$this->_setCache('insert', $id, null, static::$use_all_list);
		}
		return $rs;
	}

	/**
	 * 删除指定应用id信息 更新状态，逻辑删除不是物理删除
	 *
	 * @param string $id
	 * @param array $courseInfo app应用的信息
	 *
	 * @return bool
	 */
	public function delete($id) {
		if ($this->_setCache('delete', $id, null, static::$use_all_list)) {
			$this->_model->delete($id);
			return $id;
		}
		return false;
	}

	/**
	 * 条件获取数据列表
	 *
	 * @param mixed $cond kv数组array('k'=>'v‘);
	 * @param mixed $page
	 * @param mixed $limit
	 * @param mixed $reset
	 */
	public function listIdsByCond(array $cond, $reset = false) {

		if (!$cond) {
			openApi::throwException(999994, '参数出错', 'cond必须为kv条件数组');
		}

		$cacheOpt = $this->_getCacheOpt(static::$_LIST_BY_TYPE_CACHE_KEY, $cond, static::$use_all_list);
		$this->setZetWithScore(true);
		$ids = array();
		foreach ($cacheOpt as $o) {
			$_tmp = $this->cacheCall('listIdsByCond_db', array($o['cond']), array('kname' => $o['kname'], 'kvar' => $o['kvar'], 'isSet' => 1), $reset);
			$ids[] = $_tmp;
		}

		//取代循环单个过滤
		if (count($ids) > 1) {
			$aikObj = new \ReflectionFunction('array_intersect_key');
			$ids = $aikObj->invokeArgs($ids);
		} elseif(isset($ids[0])) {
			$ids = $ids[0];
		}

		//asort($ids);
		return array_keys($ids);
	}

	public function listIdsByCond_db($cond, $page = NULL, $limit = NULL) {
		$where = array();

		if (!empty($cond['project_id'])) {
			$where[] = array('project_id', '=', $cond['project_id']);
		}

		if (!empty($cond['thread_id'])) {
			$where[] = array('thread_id', '=', $cond['thread_id']);
		}

		if (!empty($cond['uid'])) {
			$where[] = array('uid', '=', $cond['uid']);
		}

		if (isset($cond['is_verify'])) {
			$where[] = array('is_verify', '=', $cond['is_verify']);
		}

		if (isset($cond['verify_status'])) {
			$where[] = array('verify_status', '=', $cond['verify_status']);
		}

		$result = $this->_model->listIdsByCond($where, $page, $limit)->toArray();
		$ids = array();
		foreach ($result as $row) {
			$ids[] = array('zScore' => strtotime($row['created_at']), 'zMember' => $row['id']);
		}

		return $ids;
	}

	public function countByCond_db($cond) {
		
		return count($this->listIdsByCond($cond));
	}

	/**
	 * 获取指定id的详细信息
	 *
	 * @param string $id
	 * @param bool $reset 是否重置缓存
	 *
	 * @return array|bool
	 */
	public function get($id, $reset = false, $useFormat = 1) {
		if (!is_numeric($id)) {
			OpenApi::throwException(10000, '$id应为数值', '');
		}
		if (empty($id)) {
			return array();
		}
		$rst = array();
		$rst = $this->cacheCall('get_db', array('id' => $id), array('kname' => static::$_GET_CACHE_KEY, 'kvar' => $id), $reset);
		$rst = $this->_rowDataFormat($rst, $useFormat);
		return $rst;
	}

	/**
	 * 提供获取指定id的详细信息的数据源
	 *
	 * @param string $id
	 *
	 * @return array|bool
	 */
	public function get_db($id) {
		$rst = $this->_model->get($id);
		return $rst;
	}

	/**
	 * 批量获取指定id的详细信息
	 *
	 * @param array $ids
	 *
	 * @return bool|array
	 */
	public function getBatch($ids, $reset = false, $useFormat = 1) {
		if (empty($ids)) {
			return array();
		}

		$rst = array();
		$rst = $this->mutiCacheCall('getBatch_db', array('id' => $ids), array('kname' => static::$_GET_CACHE_KEY, 'kvars' => $ids), $reset);
		$rst = $this->_rowDataFormat($rst, $useFormat);
		return $rst;
	}

	/**
	 * 提供批量获取指定id的详细信息数据源
	 *
	 * @param array $ids
	 *
	 * @return bool|array
	 */
	public function getBatch_db($ids) {
		$rst = $this->_model->getBatch($ids);
		return $this->formatKeyRows($rst, 'id');
	}


	//获取table条件字段
	public function _getTableCondition() {
		/**
		 * condition array('field'=>'type') field:字段名 type:类型
		 * type :
		 * 		list 表示多值条件列表，例如一些多选属性字符串列表
		 * 		val	表示单值条件
		 */
		return array(
			'condition' => array('thread_id' => 'val', 'uid'=>'val'), 
			'union' => array('project_id'=>'val'),
			'sub_union' => array('is_verify'=>'val'),
		);
	}

	/**
	 * 数据格式化
	 * @param  [type]  $data      [description]
	 * @param  integer $useFormat [description]
	 * @return [type]             [description]
	 */
	private function _rowDataFormat($data, $useFormat = 1) {

		//格式化数据
		$_formatFunc = function ($row) {
			return $row;
		};

		//展开json数据
		$_expandJsonFunc = function ($row) {
			return $row;
		};

		//替换自增单元数据
		$_replaceUnitValueFunc = function ($row, $field) {
			return $row;
		};

		
		//单条数据格式化
		if (is_object($data)) {
			$data = $_expandJsonFunc($data);

			if ($useFormat) {
				$data = $_formatFunc($data);
				//$data = $_replaceUnitValueFunc($data, 'views');//替换自增单元数据
			}
		} elseif(is_array($data)) { //多条数据格式化
			foreach ($data as $k => $row) {
				$row = $_expandJsonFunc($row);

				if ($useFormat) {
					//特殊数据初始化,例如图片地址补全等等
					//todo
					$row = $_formatFunc($row);
					//$row = $_replaceUnitValueFunc($row, 'views');//替换自增单元数据
				}

				$data[$k] = $row;
			}
		}
		return $data;
	}

	
}
