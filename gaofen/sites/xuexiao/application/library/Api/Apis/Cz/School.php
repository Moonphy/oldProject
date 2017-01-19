<?php
namespace Api\Apis\CZ;

use Api\OpenApi;
use Api\Apis as ApiBase;
use Api\Base\Cz\School as SchoolApiBase;

class School extends ApiBase\Base {

	private $_base = NULL;

	function __construct(SchoolApiBase $schoolApiBase) {
		$this->_base = $schoolApiBase;
	}

	public function get($p = array()) {
		$id = OpenApi::param($p, 'id');
		$autoIncView = OpenApi::param($p, '_autoIncView', false); //是否自动增加流览数
		$useFormat = OpenApi::param($p, '_useFormat', true);

		if(empty($id)) return array();

		//随机性更新缓存
		//解决每周排名更新排名号不对问题
		$_autoFresh = false;
		if(5==rand(1,20)) { //1/20机会更新缓存
			$_autoFresh = true;
		}

		$info = $this->_base->get($id, $_autoFresh, $useFormat);

		//浏览数+1
		if($info && $autoIncView) {
			$this->_base->incrUnit('views', $id);
		}

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
		$city = (int)OpenApi::param($p, 'city', 289); //289:广州市
		$useFormat = OpenApi::param($p, '_useFormat', true);

		$p['city'] = $city;
		$p['gz_state'] = 1;

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


	/**
	 * 获取各学段top N 条排行记录
	 * @param  array  $p [description]
	 * @return [type]    [description]
	 */
	public function top($p=array()) {
		$limit = OpenApi::param($p, 'limit', 8);
		$cate  = OpenApi::param($p, 'cate');  //办学性质
		$district  = OpenApi::param($p, 'district'); //所属区域

		$school_types = isset($p['school_type']) ? array($p['school_type']) : [3, 2, 1];

		$result = array();
		foreach($school_types as $school_type) {
			$rankList = $this->listByCond(array('school_type'=>$school_type, 'cate'=>$cate, 'district'=>$district, 'limit'=>2));
			$list1 = array_shift($rankList['list']);
			$list2 = array_shift($rankList['list']);

			$tmpIds = $list2Ids = array();

			if(!empty($list1['ids'])) {
				if(!empty($list2['ids'])) {
					$list2Ids = array_column($list2['ids'], 'id');
				}

				foreach($list1['ids'] as $k=>$item) {
					if($k>=$limit) break; //

					$result[$school_type][$k] = $item;
					if(!empty($list2Ids)){
						if(($offset = array_search($item['id'], $list2Ids))!==FALSE){
							if($offset>$k) {
								$result[$school_type][$k]['rank_flag'] = 'up';
							}elseif($offset<$k){
								$result[$school_type][$k]['rank_flag'] = 'down';
							}else{
								$result[$school_type][$k]['rank_flag'] = 'fair';
							}
						}else{ //当ID不在上列表时肯定为上升
							$result[$school_type][$k]['rank_flag'] = 'up';
						}
					}else{ //没有上周数据时，所有标识为持平
						$result[$school_type][$k]['rank_flag'] = 'fair';
					}

					$url = \F::getSiteHost('xuexiao');
					$result[$school_type][$k]['url'] = $url .= \F::url('/cz/school/view',
					                                          ['school_type' => $school_type, 'cate'=>$cate, 'district'=>$district],
					                                          ['id' => $item['id']]);
				}
			}
		}
		return $result;
	}

///////==============================后台API=================================>

	public function listByCondForAdmin($p=array()) {
		$page = OpenApi::param($p, 'page', 1);
		$limit = OpenApi::param($p, 'limit', 30);

		$rst = $this->_base->listIdsByCond_db($p, $page, $limit);
		$total = $this->_base->countByCond_db($p);

		$list = $this->getBatch(array('ids'=>array_column($rst, 'zMember')));

		return array('list'=>$list, 'total'=>$total);
	}

	/**
	 * 强制更新单元数据
	 * @param  [type] $p [description]
	 * @return [type]    [description]
	 */
	public function saveUnitToDbForAdmin($p) {
		$field = OpenApi::param($p, 'field');
		$city = OpenApi::param($p, 'city');

		if(empty($field)) {
			OpenApi::throwException(10000, '缺少参数');
		}

		$rs = $this->_base->saveUnitToDb($field, $city);

		if($rs) {
			return $rs;
		} else{
			OpenApi::throwException(10000, '没更新到任何数据');
		}
	}
}