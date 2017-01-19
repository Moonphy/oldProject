<?php
namespace Api\Apis\CZ;

use Api\OpenApi;
use Api\Apis as ApiBase;
use Api\Base\Cz\Schedule as ScheduleApiBase;

class Schedule extends ApiBase\Base {

	private $_base = NULL;

	function __construct(ScheduleApiBase $ScheduleApiBase) {
		$this->_base = $ScheduleApiBase;
	}

	public function get($p = array()) {
		$id = OpenApi::param($p, 'id');
		$useFormat = OpenApi::param($p, '_useFormat', true);

		if(empty($id)) return array();

		$info = $this->_base->get($id, false, $useFormat);


		return $info;
	}

	public function getBatch($p = array()) {
		$ids = OpenApi::param($p, 'ids');
		$useFormat = OpenApi::param($p, '_useFormat', true);

		if(empty($ids) || !is_array($ids)){
			return array();
		}

		$list = $this->_base->getBatch($ids, false, $useFormat);

		return $list;
	}

	public function create($p = array()) {
		$rs = $this->_base->save($p);

		if(!$rs) {
			OpenApi::throwException(100000, '创建失败');
		}

		return $rs;
	}

	public function update($p = array()) {
		$id = OpenApi::param($p, 'id');

		if(empty($id)) OpenApi::throwException(100000, '缺少参数');

		$rs = $this->_base->save($p, $id);
		if(!$rs) {
			OpenApi::throwException(100000, '更新失败');
		}

		return $rs;
	}

	public function listByCond(array $p = array()) {
		$page = OpenApi::param($p, 'page', 1);
		$limit = OpenApi::param($p, 'limit', 30);
		$useFormat = OpenApi::param($p, '_useFormat', true);

		$ids = $this->_base->listIdsByCond($p);

		if(empty($ids)) {
			return array('list'=>array(), 'total'=>0);
		}

		$total = count($ids);

		$page 	= max($page, 1);
		$offset = ($page-1)*$limit;
		$ids 	= array_slice($ids, $offset, $limit);
		$list 	= array();
		if($ids){
			$list = $this->getBatch(array('ids'=>$ids, '_useFormat'=>$useFormat));
		}
		return array('list'=>array_values($list), 'total'=>$total);
	}

	public function delete(array $p=array()) {
		$id = OpenApi::param($p, 'id');

		$rs = $this->_base->delete($id);
		if(!$rs) {
			OpenApi::throwException(10000, '删除失败');
		}

		return $rs;
	}

}