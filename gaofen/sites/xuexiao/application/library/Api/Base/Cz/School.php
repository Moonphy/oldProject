<?php
namespace Api\Base\Cz;

use Api\Base as ApiBase;
use Api\OpenApi;

class School extends ApiBase\Base {

	static $_LIST_BY_TYPE_CACHE_KEY = 'czschool:cond:list';
	static $_GET_CACHE_KEY = 'czschool:id';
	static $_TABLE_UNIT_KEY = 'czschool:unit:id';//浏览数缓存

	private $_model = NULL;

	function __construct(\Api_Cz_SchoolModel $model) {
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

		$fields = array('name' => 'string', 'top' => '', 'property' => 'string', 'province' => 'number', 'province_name' => 'string', 'city' => 'number',
			'city_name' => 'string', 'district' => 'number', 'district_name' => 'string', 'tags' => 'string',
			'ext' => '', 'sort' => 'number', 'views' => 'number', 'cz_state' => 'number', 'cover' => '', 'intro' => '',
			'has_cz' => '', 'has_gz' => '', 'school_zone' => 'string', 'sub_name' => 'string', 'cate' => 'number', 'datalink'=>'string',
			'attype'=>'string', 'pstype'=>'string',
		);

		$_tmp = array();
		$rs = false;

		$_oldData = $values = array();
		if ($id) {
			$_oldData = $this->get($id, false, false);
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

		if (!$cond) {
			openApi::throwException(999994, '参数出错', 'cond必须为kv条件数组');
		}

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

		asort($ids);
		return array_keys($ids);
	}

	public function listIdsByCond_db($cond, $page = NULL, $limit = NULL) {
		$where = array();

		if (!empty($cond['name'])) {
			$where[] = array('name', 'like', "%{$cond['name']}%");
			/*if(strpos($cond['name'], '市')!==false){
				$where[] = array('name', 'orlike', "%".str_replace('市', '', $cond['name'])."%");
			}
			if(strpos($cond['name'], '区')!==false){
				$where[] = array('name', 'orlike', "%".str_replace('区', '', $cond['name'])."%");
			}*/
		}elseif(!empty($cond['has_cz'])) { //没关键字搜时才生效，关键字搜索允许跨学段搜索
			$where[] = array('has_cz', '=', '1');
		}

		if (!empty($cond['property'])) {
			$where[] = array('property', 'andWhereInSet', $cond['property']);
		}

		if (isset($cond['cz_state']) && in_array($cond['cz_state'], array('0', '1'))) {
			$where[] = array('cz_state', '=', $cond['cz_state']);
		}

		if (!empty($cond['city'])) {
			$where[] = array('city', '=', $cond['city']);
		}


		if (!empty($cond['district'])) {
			$where[] = array('district', '=', $cond['district']);
		}

		$result = $this->_model->listIdsByCond($where, $page, $limit);
		$ids = array();
		foreach ($result as $row) {
			$ids[] = array('zScore' => strtotime($row['created_at']), 'zMember' => $row['id']);
		}

		return $ids;
	}

	public function countByCond_db($cond) {

		$where = array();

		if (!empty($cond['name'])) {
			$where[] = array('name', 'like', "%{$cond['name']}%");
			/*if(strpos($cond['name'], '市')!==false){
				$where[] = array('name', 'orlike', "%".str_replace('市', '', $cond['name'])."%");
			}
			if(strpos($cond['name'], '区')!==false){
				$where[] = array('name', 'orlike', "%".str_replace('区', '', $cond['name'])."%");
			}*/
		}elseif(!empty($cond['has_cz'])) { //没关键字搜时才生效，关键字搜索允许跨学段搜索
			$where[] = array('has_cz', '=', '1');
		}

		if (!empty($cond['property'])) {
			$where[] = array('property', 'andWhereInSet', $cond['property']);
		}

		if (isset($cond['cz_state']) && in_array($cond['cz_state'], array('0', '1'))) {
			$where[] = array('cz_state', '=', $cond['cz_state']);
		}

		if (!empty($cond['city'])) {
			$where[] = array('city', '=', $cond['city']);
		}

		
		if (!empty($cond['district'])) {
			$where[] = array('district', '=', $cond['district']);
		}

		return $this->_model->countByCond($where);
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
		$rst = $this->_model->get($id)->toArray();
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
		$rst = $this->_model->getBatch($ids)->toArray();
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
		return array('condition' => array('topic' => 'val', 'cz_state' => 'val', 'has_cz' => 'val', 'cate' => 'val', 'city' => 'val'));
	}


	/**
	 * 生成cache kvar
	 *
	 * @param mixed $kname
	 * @param mixed $data
	 */
	public function _getCacheOpt($kname, $data) {
		$cond = $this->_getTableCondition();
		$opt = array();

		foreach ($cond['condition'] as $field => $c) {
			if (!isset($data[$field])) {
				continue;
			}

			switch ($c) {
				case 'list':
					//按属性构建缓存KEY
					if (!is_array($data[$field])) {
						$item = explode(',', (string) $data[$field]);
					} else {
						$item = $data[$field];
					}

					if ($item) {
						foreach ($item as $val) {
							$kvar = $field . ':' . $val;
							$opt[] = array('field' => $field, 'type' => $c, 'kname' => $kname, 'kvar' => $kvar, 'cond' => array($field => $val), 'isList' => true);
						}
					} else {
						$kvar = $field . ':';
						$opt[] = array('field' => $field, 'type' => $c, 'kname' => $kname, 'kvar' => $kvar, 'cond' => array($field => ''), 'isList' => true);
					}
					break;
				case 'val':
					$kvar = $field . ':' . $data[$field];
					$opt[] = array('field' => $field, 'type' => $c, 'kname' => $kname, 'kvar' => $kvar, 'cond' => array($field => $data[$field]), 'isList' => true);
					break;
			}
		}

		$opt[] = array('field' => '', 'kname' => $kname, 'kvar' => '___all___', 'cond' => array(), 'isList' => true);

		return $opt;
	}
	

	/**
	 * 数据格式化
	 * @param  [type]  $data      [description]
	 * @param  integer $useFormat [description]
	 * @return [type]             [description]
	 */
	private function _rowDataFormat($data, $useFormat = 1) {

		if (!is_array($data)) {
			return $data;
		}

		//判断是否多行记录
		$_isMultiRows = true;

		//格式化数据
		$_formatFunc = function ($row) {
			$_schoolZone = $row['school_zone']?'（'.$row['school_zone'].'）':'';
			$row['oname'] = $row['name'];
			$row['name'] = $row['name'].$_schoolZone;
			$row['cover'] = \F::imageUrl($row['cover'], '260_195', '');
			$_tags = $row['tags'];
			foreach($_tags as $_k=>$_v) {
				if(empty($_v)) {
					unset($_tags[$_k]);
				}
			}
			$row['tags'] = array_values($_tags);
			$row['link'] = \F::getSiteHost('xuexiao').\F::URL('/Cz/School/view', array('id'=>$row['id']));
			return $row;
		};

		//展开json数据
		$_expandJsonFunc = function ($row) {
			$json = json_decode($row['ext'], true);
			$row['ext'] = $json ? $json : array();
			$row['property'] = !empty($row['property']) ? explode(',', $row['property']) : array();
			$row['attype'] = !empty($row['attype']) ? explode(',', $row['attype']) : array();
			$row['pstype'] = !empty($row['pstype']) ? explode(',', $row['pstype']) : array();
			$row['tags'] = $row['tags'] ? explode(',', $row['tags']) : array();
			$row['top'] = $row['top'] ? explode(',', $row['top']) : array();
			return $row;
		};

		//替换自增单元数据
		$_replaceUnitValueFunc = function ($row, $field) {
			$row[$field] = $this->getUnit($field, $row['id']) + 10000;
			return $row;
		};

		foreach ($data as $k => $row) {
			if (!is_array($row)) {
				$_isMultiRows = false;
				break;
			}

			$row = $_expandJsonFunc($row);

			if ($useFormat) {
				//特殊数据初始化,例如图片地址补全等等
				//todo
				$row = $_formatFunc($row);
				$row = $_replaceUnitValueFunc($row, 'views');//替换自增单元数据
			}

			$data[$k] = $row;
		}

		if (!$_isMultiRows) {
			$data = $_expandJsonFunc($data);

			if ($useFormat) {
				$data = $_formatFunc($data);
				$data = $_replaceUnitValueFunc($data, 'views');//替换自增单元数据
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
				

				//区分城市
				if(!empty($city) && $row['city']!=$city) {
					continue;
				}

				if (!empty($row[$field]) && $row[$field] != $val) {
					if ($id && is_numeric($id) && $val) {
						$this->save(array($field => $val), $id, true);
					}
				}
			}

			//学校排行榜使用，记录当前的浏览数并更新排行榜
			$this->_model->updatePreViewAndRangeRank(1, $city); //公办学校排名
			$this->_model->updatePreViewAndRangeRank(2); //民办学校排名,民校没有地区排名

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
