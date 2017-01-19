<?php
namespace Api\Base\Traits;

Trait TableUnit {
	////--------------------表单元数操作--开始-------------------------------------->
	/**
	* 表单元数据增长操作
	*
	* @param mixed $field 表字段名，类型必须为数值，并且初妈为0
	* @param mixed $id 课程ID
	* @param bool $immediately 是否即更新数据库数据,或满足多少个后更新
	* @example
	* 	incrUnit('views', 25); //gf_course表记录ID为25的views字段做+1操作；
	*/
	public function incrUnit($field, $id, $immediately=false, $incr=1){
		$kvar = $field.':'.$id;
		$kname = static::$_TABLE_UNIT_KEY;

		if(!$this->cacheObj()->exists($kname, $kvar)) {//检测缓存失效
			$this->getUnit($field, $id);
		}

		$total = $this->cacheObj()->inc($kname, $kvar, $incr);

		//if(!is_numeric($total)) openApi::throwException(10000, 'incrUnit只能对数值字段有效');

		$n = (is_numeric($immediately) && $immediately > 0 ? $immediately:10); //每N个浏览数更新一次数据库
		if(($total > 0 && ($total%$n)==0) || $immediately===true){
			$this->save(array($field=>$total), $id, true);
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
	public function decrUnit($field, $id, $immediately=false, $incr=1){
		$kvar = $field.':'.$id;
		$kname = static::$_TABLE_UNIT_KEY;

		if(!$this->cacheObj()->exists($kname, $kvar)) {//检测缓存失效
			$this->getUnit($field, $id);
		}

		$total = $this->cacheObj()->dec($kname, $kvar, $incr);

		//if(!is_numeric($total)) openApi::throwException(10000, 'incrUnit只能对数值字段有效');

		$n = (is_numeric($immediately) && $immediately > 0 ? $immediately:10); //每N个浏览数更新一次数据库
		if(($total > 0 && ($total%$n)==0) || $immediately===true){
			$this->save(array($field=>$total), $id, true);
		}
		
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

		if($this->cacheObj()->exists($kname, $kvar)) {//检测缓存失效
			$this->cacheObj()->del($kname, $kvar);
		}

		$rs = $this->cacheObj()->inc($kname, $kvar, $val);

		if($immediately){
			$this->save(array($field=>$rs), $id, true);
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