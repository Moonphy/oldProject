<?php
namespace Api\Base\Huodong\Bestvoice;

use Api\Base as ApiBase;
use Api\OpenApi;
use Api\Base\Traits\TableUnit;

class Redpack extends ApiBase\Base {

	use TableUnit;

	static $_LIST_BY_TYPE_CACHE_KEY = 'event:redpack:list';
	static $_GET_CACHE_KEY = 'event:redpack:id';
	static $_TABLE_UNIT_KEY = 'event:redpack:unit:id';//浏览数缓存

	static $use_all_list = false;

	private $_model = NULL;

	function __construct(\Api_Huodong_Bestvoice_RedpackModel $model) {
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

		$fields = array('mch_billno'=>'string', 'type' => 'int', 'status'=>'int', 'sender_id' => 'int', 'amount' => 'int', 'receiver_id' => 'int', 'order_id'=>'int', 'prize_id'=>'int');

		$_tmp = array();
		$rs = false;

		$_oldData = $values = array();
		if ($id) {
			$_oldData = $this->get($id, false, false)->toArray();
		}

		$data = $this->paramsValid($fields, $data, $_oldData);

		if ($_oldData) {
			$rs = $this->_model->save($data, $id);
			if ($rs && $autoRefresh) {
				$this->_setCache('update', $id, $_oldData, static::$use_all_list);
				$rs = $this->get($id);
			}
		} else {
			$rs = $this->_model->save($data);
			$id = isset($rs->id) ? $rs->id : '';
			$this->_setCache('insert', $id, [], static::$use_all_list);
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
		if ($this->_setCache('delete', $id, [], static::$use_all_list)) {
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
	public function listIdsByCond(array $cond, $sortByField='created_at', $reset = false) {

		if (!$cond) {
			openApi::throwException(999994, '参数出错', 'cond必须为kv条件数组');
		}

		$cacheOpt = $this->_getCacheOpt(static::$_LIST_BY_TYPE_CACHE_KEY, $cond);
		$this->setZetWithScore(true);
		$ids = array();
		foreach ($cacheOpt as $o) {
			$_tmp = $this->cacheCall('listIdsByCond_db', array($o['cond'], $sortByField), array('kname' => $o['kname'], 'kvar' => $o['kvar'], 'isSet' => 1), $reset);
			$ids[] = $_tmp;
		}

		//取代循环单个过滤
		if (count($ids) > 1) {
			$aikObj = new \ReflectionFunction('array_intersect_key');
			$ids = $aikObj->invokeArgs($ids);
		} elseif(isset($ids[0])) {
			$ids = $ids[0];
		}

		arsort($ids);
		return array_keys($ids);
	}

	public function listIdsByCond_db($cond, $sortByField='created_at', $page = NULL, $limit = NULL) {
		$where = array();

        foreach (['prize_id', 'order_id', 'type', 
            'mch_billno', 'sender_id', 'receiver_id', 'status'] as $k) {
            if (isset($cond[$k])) {
                if (is_array($cond[$k])) {
                    $where[] = array($k, 'in', $cond[$k]);
                } else {
                    $where[] = array($k, '=', $cond[$k]);
                }
            }
        }

		$result = $this->_model->listIdsByCond($where, $page, $limit)->toArray();
		$ids = array();
		foreach ($result as $row) {
			$ids[] = array('zScore' => strtotime($row[$sortByField]), 'zMember' => $row['id']);
		}

		return $ids;
	}

	public function countByCond_db($cond) {

		$count = count($this->listIdsByCond_db($cond));

		return $count;
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

	/**
     * 直接SQL查询
     * @param  [type] $sql [description]
     * @param  string $op  
     *                  statement : 只返回true false;
     *                  select    : 返回结果集
     *                  update/delete/insert : 返回 int 
     * @return [type]      [description]
     */
    public function query($sql, $op='statement') {
        $orm = $this->_model->ORM()->getConnection();
        return $orm->$op($sql);
    }


	//获取table条件字段
	public function _getTableCondition() {
		/**
		 * condition array('field'=>'type') field:字段名 type:类型 允许生成cachekey的字段
		 * union array('field'=>'type') field:字段名 type:类型 联合condition使用
		 * type :
		 * 		list 表示多值条件列表，例如一些多选属性字符串列表
		 * 		val	表示单值条件
		 */
		return array('condition' => array('sender_id' => 'val', 'receiver_id' => 'val', 'mch_billno' => 'val', 'status' => 'val'),
			'union' => ['type'=>'val'],
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
			$row[$field] = $this->getUnit($field, $row->id);
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
