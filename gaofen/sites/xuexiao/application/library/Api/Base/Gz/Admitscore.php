<?php
namespace Api\Base\Gz;

use Api\OpenApi;
use Api\Base as ApiBase; 

class Admitscore extends ApiBase\Base {

	static $_LIST_BY_TYPE_CACHE_KEY= 'gzAdmitscore:cond:list';
	static $_GET_CACHE_KEY 		= 'gzAdmitscore:id';
	static $_TABLE_UNIT_KEY		= 'gzAdmitscore:unit:id'; //浏览数缓存

	private $_model = NULL;

	function __construct(\Api_Gz_AdmitscoreModel $model)
	{
		$this->_model = $model;
	}


	/**
	* 保存数据
	*
	* @param mixed $data
	* @param mixed $id
	* @param mixed autoRefresh 自动更新缓存
	*/
	public function save($data, $id='', $autoRefresh=true) {

		$fields = array('sid'=>'number', 'year'=>'number', 'admit_range_id'=>'string', 'luqu_id'=>'number', 'batch_id'=>'number',
			'area_id'=>'number', 'low_mark'=>'number', 'low_mark_last'=>'number', 'last_student_wish'=>'number', 
			'last_student_mark'=>'number', 'last_student_num'=>'number', 'other_low_mark'=>'number', 
			'other_low_num'=>'number', 'max_wish_num'=>'number'
		);

		$_tmp = array();
		$rs =  false;

		$_oldData = $values = array();
        if($id){
            $_oldData = $this->get($id, false, false);
			if(is_object($_oldData)) $_oldData = $_oldData->toArray();
        }

        $data = $this->paramsValid($fields, $data, $_oldData);

		if($id) {
			$rs = $this->_model->save($data, $id);
			if($rs && $autoRefresh){
				$this->_setCache('update', $id, $_oldData);
				$rs = $this->get($id);
			}
		}else{
			$rs = $this->_model->save($data);
			$id = isset($rs['id'])?$rs['id']:'';
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
	public function delete($id)
	{
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
	public function listIdsByCond(array $cond, $reset=false) {

		if(!$cond){
			openApi::throwException(999994, '参数出错', 'cond必须为kv条件数组');
		}

		$cacheOpt = $this->_getCacheOpt(static::$_LIST_BY_TYPE_CACHE_KEY, $cond);
		$this->setZetWithScore(true);
		$ids = array();
		foreach($cacheOpt as $o){
			$_tmp = $this->cacheCall('listIdsByCond_db', array($o['cond']), array('kname'=>$o['kname'], 'kvar'=>$o['kvar'], 'isSet'=>1), $reset);
			$ids[] = $_tmp;
		}
//var_dump($ids);
		//取代循环单个过滤
		if(count($ids)>1) {
			$aikObj = new \ReflectionFunction('array_intersect_key');
			$ids = $aikObj->invokeArgs($ids);
		} elseif(isset($ids[0])) {
			$ids = $ids[0];
		}

		arsort($ids);
		return array_keys($ids);
	}

	public function listIdsByCond_db($cond){
		$where = array();

		if(isset($cond['sid'])) {
			$where[] = array('sid', '=', $cond['sid']);
		}
		
		if(isset($cond['year'])) {
			if(is_array($cond['year'])) {
				$where[] = array('year', 'in', $cond['year']);
			}else{
				$where[] = array('year', '=', $cond['year']);
			}			
		}

		if(!empty($cond['batch_id'])) {
			$where[] = array('batch_id', '=', $cond['batch_id']);
		}

		$result = $this->_model->listIdsByCond($where);
		$ids = array();
		foreach($result as $row){
			$ids[] = array('zScore'=>$row['year'], 'zMember'=>$row['id']);
		}

		return $ids;
	}


	/**
	 * 获取指定id的详细信息
	 *
	 * @param string $id
	 * @param bool $reset 是否重置缓存
	 *
	 * @return array|bool
	 */
	public function get($id, $reset = false, $useFormat=1)
	{
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
	public function get_db($id)
	{
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
	public function getBatch($ids, $reset=false, $useFormat=1)
	{
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
	public function getBatch_db($ids)
	{
		$rst = $this->_model->getBatch($ids)->toArray();

		return $this->formatKeyRows($rst, 'id');
	}

	/**
    * 更新缓存
    *
    * @param mixed $opt update|add|delete
    * @param mixed $id
    * @param mixed $oldData
    */
    public function _setCache($opt, $id, $oldData = array()) {
        $opt = strtolower($opt);
        if (!in_array($opt, array('update', 'insert', 'delete'))) {
            openApi::throwException(1, '缓存更新失败', '没相关操作标识');
        }

        //更新时，先删除旧数据
        if ($opt == 'update' && $oldData) {
            $cacheOpt = $this->_getCacheOpt(static::$_LIST_BY_TYPE_CACHE_KEY, $oldData);

            foreach ($cacheOpt as $o) {
                if(!$this->cacheObj()->exists($o['kname'], $o['kvar'])) continue;//list缓存不存在,就不需要往下更新缓存
                $this->cacheObj()->zSetDel($o['kname'], $o['kvar'], $id);
            }
        }

        if($opt === 'delete') {
            $data = $this->get($id);
        } else {
            $data = $this->get($id, true);
        }
        
        $cacheOpt = $this->_getCacheOpt(static::$_LIST_BY_TYPE_CACHE_KEY, $data);
        //缓存更新
        foreach ($cacheOpt as $o) {

            if(!$this->cacheObj()->exists($o['kname'], $o['kvar'])) continue;//list缓存不存在,就不需要往下更新缓存

            if ($opt == 'delete') {
                $this->cacheObj()->zSetDel($o['kname'], $o['kvar'], $id);
                continue;
            }

            if ($opt == 'insert' || $opt == 'update') {
                $val = array('zMember' => $id, 'zScore' => $data['year']);
                $this->cacheObj()->zSetPush($o['kname'], $o['kvar'], $val);
                continue;
            }
        }

        return true;
    }


	//获取table条件字段
	public function _getTableCondition() {
		/**
		* condition array('field'=>'type') field:字段名 type:类型
		* type :
		* 		list 表示多值条件列表，例如一些多选属性字符串列表
		* 		val	表示单值条件
		*/
		return array('condition'=>array('sid'=>'val', 'year'=>'val', 'batch_id'=>'val'));
	}


	/**
	 * 数据格式化
	 * @param  [type]  $data      [description]
	 * @param  integer $useFormat [description]
	 * @return [type]             [description]
	 */
	private function _rowDataFormat($data, $useFormat=1){

		if(!is_array($data)) return $data;

		//判断是否多行记录
		$_isMultiRows = true;

		//格式化数据
		$_formatFunc = function($row) {
			return $row;
		};

		//展开json数据
		$_expandJsonFunc = function($row) {
			//$json = json_decode($row['data'], true);
			//$row['data'] = $json?$json:array();
			return $row;
		};

		foreach($data as $k=>$row) {
			if(!is_array($row)) {
				$_isMultiRows = false;
				break;
			}

			$row = $_expandJsonFunc($row);

			if($useFormat) { //特殊数据初始化,例如图片地址补全等等
				//todo
				$row = $_formatFunc($row);
			}

			$data[$k] = $row;
		}

		if(!$_isMultiRows) {
			$data = $_expandJsonFunc($data);

			if($useFormat) {
				$data = $_formatFunc($data);
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
	public function incrUnit($field, $id, $immediately=false){
		$kvar = $field.':'.$id;
		$kname = static::$_TABLE_UNIT_KEY;

		if(!$this->cacheObj()->exists($kname, $kvar)) {//检测缓存失效
			$this->getUnit($field, $id);
		}

		$total = $this->cacheObj()->inc($kname, $kvar);

		//if(!is_numeric($total)) openApi::throwException(10000, 'incrUnit只能对数值字段有效');

		$n = 10; //每N个浏览数更新一次数据库
		if(($total > 1 && ($total%$n)==0) || $immediately){
			$this->save(array($field=>$total), $id, false);
		}
		return $total;
	}

	/**
	 * 强制更新单元数据值到DB
	 * @param  [type] $field [description]
	 * @return [type]        [description]
	 */
	public function saveUnitToDb($field) {
		$kvar = $field.':*';
		$kname = static::$_TABLE_UNIT_KEY;
		$key = $this->cacheObj()->_key($kname, $kvar);

		$keyList = $this->cacheObj()->key($key);

		if($keyList && is_array($keyList)) {
			$unitIds = array();
			foreach($keyList as $_k) {
				$unitIds[] = substr(strrchr($_k, ":"), 1);				
			}

			$unitList = $this->batchGetUnit($field, $unitIds);
			foreach($unitList as $id=>$val) {
				if($id && is_numeric($id) && $val){
					$this->save(array($field=>$val), $id, false);
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
	public function decrUnit($field, $id){
		$kvar = $field.':'.$id;
		$kname = static::$_TABLE_UNIT_KEY;

		if(!$this->cacheObj()->exists($kname, $kvar)) {//检测缓存失效
			$this->getUnit($field, $id);
		}

		$total = $this->cacheObj()->dec($kname, $kvar);

		//if(!is_numeric($total)) openApi::throwException(10000, 'incrUnit只能对数值字段有效');

		$this->save(array($field=>$total), $id, false);
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
	public function setUnit($field, $id, $val, $immediately=true){
		$kvar = $field.':'.$id;
		$kname = static::$_TABLE_UNIT_KEY;

		if(!$this->cacheObj()->exists($kname, $kvar)) {//检测缓存失效
			$this->getUnit($field, $id);
		}

		$rs = $this->cacheObj()->inc($kname, $kvar, $val);

		if($immediately){
			$this->save(array($field=>$val), $id, false);
		}
		return $rs;
	}

	public function getUnit($field, $id, $reset=false) {
		$kvar = $field.':'.$id;
		$this->useSetInNumber(true);
		$rst = $this->cacheCall('getUnit_db', array('field'=>$field, 'id'=>$id), array('kname'=>static::$_TABLE_UNIT_KEY, 'kvar'=>$kvar), $reset);
		$this->useSetInNumber(false);
		return $rst;
	}

	public function getUnit_db($field, $id) {
		$rs = $this->_model->getUnit($field, $id);
		if(isset($rs[$id])) {
			return $rs[$id][$field];
		}else{
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
	public function batchGetUnit( $field, array $ids, $reset=false) {
		foreach($ids as $k=>$id){
			$kvar = $field.':'.$id;
			$ids[$k] = $kvar;
		}
		$this->useSetInNumber(true);
		$rst = $this->mutiCacheCall('batchGetUnit_db', array(), array('kname'=>static::$_TABLE_UNIT_KEY, 'kvars'=>$ids), $reset);
		$this->useSetInNumber(false);
		return $rst;
	}

	public function batchGetUnit_db($vars) {
		$ids = array();
		$field = '';
		foreach($vars as $v){
			$v = explode(':', $v);
			if(!$field)	$field = $v[0];
			$ids[] = $v['1'];
		}

		$_tmp = $this->_model->getUnit($field, $ids);
		$rs = array();
		foreach($_tmp as $val){
			$rs[$val['id']] = $val[$field];
		}
		return $rs;
	}

	//////-------------------------表单元数据操作--结束----------------------》
}
