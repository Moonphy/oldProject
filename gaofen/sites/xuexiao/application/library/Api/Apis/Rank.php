<?php
namespace Api\Apis;

use Api\OpenApi;
use Api\Base\Rank as RankApiBase;

class Rank extends Base {

	private $_base = NULL;

	function __construct(RankApiBase $rankApiBase) {
		$this->_base = $rankApiBase;

	}

	public function get($p = array()) {
		$id = OpenApi::param($p, 'id');

		if(empty($id)) return array();

		$info = $this->_base->get($id);


		return $info;
	}

	public function getBatch($p = array()) {
		$ids = OpenApi::param($p, 'ids');

		if(empty($ids) || !is_array($ids)){
			return array();
		}

		$list = $this->_base->getBatch($ids);

		return $list;
	}

	public function create($p = array()) {
		return $this->_base->save($p);
	}

	public function update($p = array()) {
		$id = OpenApi::param($p, 'id');
		if(empty($id)) return false;
		return $this->_base->save($p, $id);
	}

	public function listByCond(array $p = array()) {
		$page = OpenApi::param($p, 'page', 1);
		$limit = OpenApi::param($p, 'limit', 30);

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
			$list = $this->getBatch(array('ids'=>$ids));
		}
		return array('list'=>$list, 'total'=>$total);
	}

	public function delete(array $p=array()) {
		$id = OpenApi::param($p, 'id');

		$rs = $this->getBase('Category')->delete($id);
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
		$limit = OpenApi::param($p, 'limit', 10);

		$school_types = isset($p['school_type']) ? array($p['school_type']) : [3, 2, 1];
		$district = OpenApi::param($p, 'district');
		$cate = OpenApi::param($p, 'cate');

		$result = array();
		foreach($school_types as $school_type) {
			$rankList = $this->listByCond(array('school_type'=>$school_type, 'district'=>$district, 'cate'=>$cate, 'limit'=>2));
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

					$url = \F::getSiteHost('baike');
					$result[$school_type][$k]['url'] = $url .= \F::url('/entry/view',
					                                          ['school_type' => $school_type], ['id' => $item['id']]);
				}
			}
		}
		return $result;
	}
}