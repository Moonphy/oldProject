<?php
namespace Api\Base\Auth;

use Api\Base as ApiBase;
use Api\OpenApi;

class PayOrder extends ApiBase\Base {

	static $_LIST_BY_TYPE_CACHE_KEY = 'auth:wxpo:cond:list';
	static $_GET_CACHE_KEY = 'auth:wxpo:id';
	static $_TABLE_UNIT_KEY = 'auth:wxpo:unit:id';//浏览数缓存

	private $_model = NULL;

	function __construct(\Api_Auth_PayOrderModel $model) {
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
		if(!empty($data['catid'])){
			$data['appid'] = \CFG::auth('cat_list', $data['catid'], 'app_id');
			$data['mch_id']	= \CFG::auth('weixin_cfg', $data['appid'], 'mch_id');
		}elseif(empty($id)){
			OpenApi::throwException('999999', '缺少catid');
		}

		$fields = array('catid'=>'int|require', 'pid'=>'int', 'uid'=>'int', 'uname'=>'string',
						'fee'=>'double', 'order_type'=>'int', 'amount'=>'int', 'pay_type'=>'int',
						'pay_status' => 'int', 'total_fee'=>'double', 'order_status'=>'int', 'attach'=>'',
						'refund_fee'=>'', 'refund_status'=>'', 'transaction_id'=>'string', 'detail'=>'',
						'mch_id'=>'', 'pay_fee'=>'double', 'appid'=>'', 'out_trade_no'=>'',
						);

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
				$this->_setCache('update', $id, $_oldData);
				$rs = $this->get($id);
			}
		} else {
			$rs = $this->_model->save($data);
			$id = isset($rs['id']) ? $rs['id'] : '';
			$this->_setCache('insert', $id);
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
		if ($this->_setCache('delete', $id)) {
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

		$cacheOpt = $this->_getCacheOpt(static::$_LIST_BY_TYPE_CACHE_KEY, $cond);
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

		arsort($ids);
		return array_keys($ids);
	}

	public function listIdsByCond_db($cond, $page = NULL, $limit = NULL) {
		$where = array();

		if (!empty($cond['catid'])) {
			$where[] = array('catid', '=', $cond['catid']);
		}

		if (!empty($cond['pid'])) {
			$where[] = array('pid', '=', $cond['pid']);
		}

		if (!empty($cond['uid'])) {
			$where[] = array('uid', '=', $cond['uid']);
		}

		if (!empty($cond['pay_status'])) {
			$where[] = array('pay_status', '=', (int)$cond['pay_status']);
		}

		if (!empty($cond['pay_type'])) {
			$where[] = array('pay_type', '=', (int)$cond['pay_type']);
		}

		if (!empty($cond['order_type'])) {
			$where[] = array('order_type', '=', (int)$cond['order_type']);
		}

		if (!empty($cond['order_status'])) {
			$where[] = array('order_status', '=', (int)$cond['order_status']);
		}

		if (isset($cond['refund_status'])) {
			if($cond['refund_status']==0) {
				$where[] = array('refund_status', 'in', [-1,(int)$cond['refund_status']]);
			}else{
				$where[] = array('refund_status', '=', (int)$cond['refund_status']);
			}
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
		 *
		 * union 参与SQL的联合条件查询，作用于每一个condition的一个条件
		 * format:array('field'=>'type') field:字段名 type:类型
		 * params 
		 * 		type : val 表示单值条件
		 */
		return array(
			'condition' => array('uid'=>'val', 'pay_status'=>'val', 'order_status'=>'val', 'refund_status'=>'val'),
			'union' => array('catid'=>'val'),
			);
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
			if($row->attach){
				$attach = json_decode($row->attach, true);
				$row->attach = $attach ? $attach:$row->attach;
			}
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

	////--------------------表单元数操作--开始-------------------------------------->
	/**
	 * 表单元数据增长操作
	 *
	 * @param mixed $field 表字段名，类型必须为数值，并且初妈为0
	 * @param mixed $id 课程ID
	 * @param bool $immediately 是否即更新数据库数据
	 * @example
	 * 	incrUnit('views', 25); //gf_course表记录ID为25的views字段做+1操作；
	 */
	public function incrUnit($field, $id, $immediately = false) {
		$kvar = $field . ':' . $id;
		$kname = static::$_TABLE_UNIT_KEY;

		if (!$this->cacheObj()->exists($kname, $kvar)) {
			//检测缓存失效
			$this->getUnit($field, $id);
		}

		$total = $this->cacheObj()->inc($kname, $kvar);
		//if(!is_numeric($total)) openApi::throwException(10000, 'incrUnit只能对数值字段有效');

		$n = 10;//每N个浏览数更新一次数据库
		if (($total > 1 && ($total % $n) == 0) || $immediately) {
			$this->save(array($field => $total), $id, false);
		}
		return $total;
	}

	/**
	 * 强制更新单元数据值到DB
	 * @param  [type] $field [description]
	 * @return [type]        [description]
	 */
	public function saveUnitToDb($field, $city='') {
		$kvar = $field . ':*';
		$kname = static::$_TABLE_UNIT_KEY;

		$keyList = $this->cacheObj()->keys($kname, $kvar);

		if ($keyList && is_array($keyList)) {
			$unitIds = array();
			foreach ($keyList as $_k) {
				$unitIds[] = substr(strrchr($_k, ":"), 1);

			}

			$unitList = $this->batchGetUnit($field, $unitIds);
			foreach ($unitList as $id => $val) {
				$id = substr(strrchr($id, ":"), 1);
				$row = $this->get($id, false, false);

				if (!empty($row[$field]) && $row[$field] != $val) {
					if ($id && is_numeric($id) && $val) {
						$this->save(array($field => $val), $id, true);
					}
				}
			}

			return true;
		}

		return false;
	}

	/**
	 * 单元数据减法操作
	 *
	 * @param mixed $field
	 * @param mixed $id
	 * @param bool $immediately
	 */
	public function decrUnit($field, $id) {
		$kvar = $field . ':' . $id;
		$kname = static::$_TABLE_UNIT_KEY;

		if (!$this->cacheObj()->exists($kname, $kvar)) {
			//检测缓存失效
			$this->getUnit($field, $id);
		}

		$total = $this->cacheObj()->dec($kname, $kvar);

		//if(!is_numeric($total)) openApi::throwException(10000, 'incrUnit只能对数值字段有效');

		$this->save(array($field => $total), $id, false);
		return $total;
	}

	/**
	 * 直接设置单元值
	 *
	 * @param mixed $field
	 * @param mixed $id
	 * @param mixed $val
	 * @param bool $immediately
	 */
	public function setUnit($field, $id, $val, $immediately = true) {
		$val = (int) $val;
		$kvar = $field . ':' . $id;
		$kname = static::$_TABLE_UNIT_KEY;

		if (!$this->cacheObj()->exists($kname, $kvar)) {
			//检测缓存失效
			$this->getUnit($field, $id);
		}

		$rs = $this->cacheObj()->inc($kname, $kvar, $val);

		if ($immediately) {
			$this->save(array($field => $val), $id, false);
		}
		return $rs;
	}

	public function getUnit($field, $id, $reset = false) {
		$kvar = $field . ':' . $id;
		$this->useSetInNumber(true);
		$rst = $this->cacheCall('getUnit_db', array('field' => $field, 'id' => $id), array('kname' => static::$_TABLE_UNIT_KEY, 'kvar' => $kvar), $reset);
		$this->useSetInNumber(false);
		return $rst;
	}

	public function getUnit_db($field, $id) {
		$rs = $this->_model->getUnit($field, $id);
		if (isset($rs[$id])) {
			return $rs[$id][$field];
		} else {
			return false;
		}
	}

	/**
	 * 批量获取单元数值
	 *
	 * @param mixed $ids
	 * @param mixed $reset
	 * @return 具体的数据
	 */
	public function batchGetUnit($field, array $ids, $reset = false) {
		foreach ($ids as $k => $id) {
			$kvar = $field . ':' . $id;
			$ids[$k] = $kvar;
		}
		$this->useSetInNumber(true);
		$rst = $this->mutiCacheCall('batchGetUnit_db', array(), array('kname' => static::$_TABLE_UNIT_KEY, 'kvars' => $ids), $reset);
		$this->useSetInNumber(false);
		return $rst;
	}

	public function batchGetUnit_db($vars) {
		$ids = array();
		$field = '';
		foreach ($vars as $v) {
			$v = explode(':', $v);
			if (!$field) {
				$field = $v[0];
			}

			$ids[] = $v['1'];
		}

		$_tmp = $this->_model->getUnit($field, $ids);
		$rs = array();
		foreach ($_tmp as $val) {
			$rs[$val['id']] = $val[$field];
		}
		return $rs;
	}

	//////-------------------------表单元数据操作--结束----------------------》
}
