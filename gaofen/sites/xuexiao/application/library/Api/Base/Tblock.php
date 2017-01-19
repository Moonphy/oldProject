<?php
namespace Api\Base;

use Api\OpenApi;

/**
 * 项目名称:  高分cms
 * 建立日期:  2013年03月15日
 *
 * 资料api Model
 *
 * @作者 xietaozhi <xietaozhi@gaofen.com>
 * @版本 $Id:
 **/


class Tblock extends Base {

	private $db;
	private $_regCfg;

	static $_GET_CACHE_KEY 		= 'tbk:r:dtl';
	const _GETBYFLAG_CACHE_KEY 	= 'tbk:r:fg';
	static $_LIST_BY_TYPE_CACHE_KEY	= 'tbk:t:lst';

	function __construct()
	{

	}

	/**
	* 注册区块类型
	*
	* @param mixed $name 块类型名称， 详细配置在apiCfg.php
	*/
	public function reg($name) {
		$cfg = OpenApi::cfg('tblock');
		if(isset($cfg['reg'][$name])){
			$this->_regCfg = $cfg['reg'][$name];
			return true;
		}
		
		return false;
	}

	public function regCheck() {
		if(empty($this->_regCfg['regType'])) {
			return false;
		}
		return true;
	}

	public function getRegType() {
		if(!empty($this->_regCfg['regType'])) {
			return $this->_regCfg['regType'];
		}

		return;
	}

	/**
	* 获得单条内容
	*
	* @param mixed $id
	* @param mixed $reset
	* @return 具体的数据
	*/
	public function get($id, $reset=false) {
		if(empty($id) || !is_numeric($id)) return array();
		$rs = $this->cacheCall('get_db', array('id'=>$id), array('kname'=>static::$_GET_CACHE_KEY, 'kvar'=>$id), $reset);
		return $rs;
	}

	public function get_db($id) {
		$rs = $this->getModel('Tblock')->get($id);
		if($rs){
			$rs['data'] = $rs['data']?json_decode($rs['data'], true):array();
		}
		return $rs;
	}

	public function getBatch($ids, $reset=false) {
		if(!is_array($ids)) return array();

		$rst = $this->mutiCacheCall('getBatch_db', array(), array('kname'=>static::$_GET_CACHE_KEY, 'kvars'=>$ids), $reset);
		return $rst;
	}

	public function getBatch_db($ids) {
		
		$rst = $this->getModel('Tblock')->getBatch($ids);
		if ($rst) {
			foreach($rst as $key => $val) {
				$rst[$key]['data'] = $rst[$key]['data']?json_decode($rst[$key]['data'], true):array();
			}
		}
		return $this->formatKeyRows($rst , 'id');
	}


	/**
	* 获块标识获取内容
	*
	* @param mixed $flag
	* @param mixed $reset
	* @return 具体的数据
	*/
	public function getByFlag($flag, $reset=false) {
		if(!$this->regCheck()){
			OpenApi::throwException('999995', '未注册块类型', '');
		}
		if(empty($flag)) return array();
		$flag = $this->getRegType().'_'.$flag;
		$rst = $this->cacheCall('getByFlag_db', array('flag'=>$flag), array('kname'=>static::_GETBYFLAG_CACHE_KEY, 'kvar'=>$flag), $reset);

		if(isset($rst['id'])){
			return $rst['id'];
		}
		return '';
	}

	public function getByFlag_db($flag){
		$rst = $this->getModel('Tblock')->getByFlag($flag);
		return $rst;
	}

	/**
	* 条件获取数据列表
	*
	* @param mixed $cond kv数组array('k'=>'v‘);
	* @param mixed $page
	* @param mixed $limit
	* @param mixed $reset
	*/
	public function listIdsByCond($cond, $reset=false) {

		if(!$this->regCheck()){
			OpenApi::throwException('999995', '未注册块类型', '');
		}

		if($cond && !is_array($cond)){
			OpenApi::throwException(999994, '参数出错', 'cond必须为kv条件数组');
		}

		$cacheOpt = $this->_getCacheOpt(static::$_LIST_BY_TYPE_CACHE_KEY, $cond);

		$this->setZetWithScore(true);
		$ids = array();
		foreach($cacheOpt as $o){
			$_tmp = $this->cacheCall('listIdsByCond_db', array($o['cond']), array('kname'=>$o['kname'], 'kvar'=>$o['kvar'], 'isSet'=>1), $reset);
			$ids[] = $_tmp;
		}

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
		$where[] = array('regType', '=', $this->getRegType());

		if(!empty($cond['flag'])){
			$cond['flag'] = $this->db->escape($cond['flag']);
			$wheres[] = "`flag`='{$cond['flag']}'";
			$where[] = array('regType', '=', $this->getRegType());
		}

		if(isset($cond['cond1'])){
			$where[] = array('cond1', '=', $cond['cond1']);
		}

		if(isset($cond['cond2'])){
			$where[] = array('cond2', '=', $cond['cond2']);
		}

		if(!empty($cond['cond3'])){
			$where[] = array('cond3', '=', $cond['cond3']);
		}

		if(!empty($cond['cond4'])){
			$where[] = array('cond4', '=', $cond['cond4']);
		}

		$result = $this->getModel('Tblock')->listIdsByCond($where);
		$ids = array();
		foreach($result as $row){
			$ids[] = array('zScore'=>$row['sort'], 'zMember'=>$row['id']);
		}
		
		return $ids;
	}

	/**
	* 保存数据
	*
	* @param mixed $data
	* @param mixed $id
	*/
	public function save($data, $id='') {

		$fields = array('regType'=>'require|string', 'flag'=>'string', 'name'=>'require|string', 'memo'=>'string',
			'url'=>'string', 'cond1'=>'number', 'cond2'=>'number', 'cond3'=>'string', 'cond4'=>'string', 'pkIds'=>'',
			'data'=>'', 'sort'=>'number', 'color'=>'string', 'desc'=>'string',
		);

		$_tmp = array();
		$rs =  false;

		if(!$this->regCheck()){
			OpenApi::throwException('999995', '未注册块类型', '');
		}

		if(!empty($data['regType'])) {
			if($data['regType'] != $this->getRegType()){
				OpenApi::throwException(999999, '参数出错', 'regType与注册类别不一至');
			}
		}else{
			$data['regType'] = $this->getRegType();
		}


		//块标识唯一性检查
		if(isset($data['flag'])) {
			if($this->getByFlag($data['flag'])){
				OpenApi::throwException(99998, '块标识已存在', '块标识已存在');
			}else{
				$flagPrefix = $data['regType'].'_';
				if(strpos($data['flag'], $flagPrefix)===false && !empty($data['flag'])) {
					$data['flag'] = $flagPrefix.$data['flag'];
				}else{
					$data['flag'] = $data['flag'];
				}
			}
		}

		$_oldData = $values = array();
        if($id){
            $_oldData = $this->get($id);
        }
        unset($data['id']);
        $data = $this->paramsValid($fields, $data, $_oldData);

		if($id) {
			$rs = $this->getModel('Tblock')->save($data, $id);
			if($rs){
				$result = $this->get($id, true); //保存成功强制更新缓存
				if(!empty($result['flag'])){
					$this->getByFlag($result['flag'], true);
				}
				$this->_setCache('update', $id, $_oldData);
			}
		}else{
			$rs = $this->getModel('Tblock')->save($data, '');
			$id = isset($rs['id'])?$rs['id']:'';
			$this->_setCache('insert', $id);
		}
		return $rs;
	}

	public function delete($id){
		$rs = $this->getModel('Tblock')->delete($id);
		if($rs) {
			$this->_setCache('delete', $id);
		}
		return $rs;
	}

	//获取table条件字段
	public function _getTableCondition() {
		/**
		 * condition array('field'=>'type') field:字段名 type:类型
		 * type :
		 * 		list 表示多值条件列表，例如一些多选属性字符串列表
		 * 		val	表示单值条件
		 */
		return array('condition' => array('flag'=>'val', 'cond1'=>'val', 'cond2'=>'val', 'cond3'=>'val', 'cond4'=>'val'));
	}

}
