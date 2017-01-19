<?php

/**
 * Class Api_BaseModel
 */
class Api_BaseModel{
	protected $_pk 	= 'id'; //table primary key
	protected $_orm	= NULL;
	protected $_selectFields = [];

	protected function setORM($ORM) {
		$this->_orm = $ORM;
	}

	/**
	 * 设置表主键
	 * @param [type] $field [description]
	 */
	protected function setPKField($field) {
		return $this->_pk = $field;
	}

	/**
	 * 获得表主键
	 * @return [type] [description]
	 */
	protected function getPKField() {
		return $this->_pk;
	}

	/**
	 * 保存数据
	 * @param  [type] $data [description]
	 * @param  string $id   [description]
	 * @return [type]       [description]
	 */
	public function save($data, $id='') {
		$field = $this->getPKField();
		if($id) {
			return $this->_orm->where($field, $id)->update($data);
		} else {
			return $this->_orm->create($data);
		}		
	}
	
	/**
	 * 获取数据
	 * @param  [type] $id [description]
	 * @return [type]     [description]
	 */
	public function get($id) {
		$field = $this->getPKField();
		if(method_exists($this, 'withTrashed')) {
			$rs = $this->_orm->where($field, $id)->withTrashed()->get();
		} else {
			$rs = $this->_orm->where($field, $id)->get();
		}
		return $rs->shift();
	}

	/**
	 * 批量获取数据
	 * @param  array  $ids [description]
	 * @return [type]      [description]
	 */
	public function getBatch(array $ids) {
		$field = $this->getPKField();
		if(method_exists($this, 'withTrashed')) {
			$rs = $this->_orm->whereIn($field, $ids)->withTrashed()->get();
		} else {
			$rs = $this->_orm->whereIn($field, $ids)->get();
		}
		
		return $rs;		

	}

	/**
	 * 删除数据
	 * @param  [type] $id [description]
	 * @return [type]     [description]
	 */
	public function delete($id) {
		$field = $this->getPKField();
		if(is_array($id)) {
			return $this->_orm->whereIn($field, $id)->delete();
		} else {
			return $this->_orm->where($field, $id)->delete();
		}
	}


	/**
	 * select fields
	 * @param array $fields [description]
	 */
	public function  setSelectResultField(array $fields) {
		$this->_selectFields = $fields;
		return $this;
	}

	/**
	 * select
	 * @param  [type] $cond  [description]
	 * @param  [type] $page  [description]
	 * @param  [type] $limit [description]
	 * @param  string $sort  [description]
	 * @return [type]        [description]
	 */
	public function listIdsByCond($cond, $page=NULL, $limit=NULL, $sort='desc') {
		$field = $this->getPKField();
		$listFields = array_merge([$field, 'created_at', 'updated_at'], $this->_selectFields);
		$obj = $this->_orm->select($listFields);
		
		if(is_array($cond)) {
			foreach($cond as $oneCond) {
				if(count($oneCond)>2){
					switch(strtolower($oneCond[1])) {
						case 'in':
							$obj->whereIn($oneCond[0], $oneCond[2]);
						break;

						case 'notin':
							$obj->whereNotIn($oneCond[0], $oneCond[2]);
						break;

						case 'andwhereinset':
							if(is_array($oneCond[2])) {
								$obj->where(function($query)use($oneCond){
									foreach($oneCond[2] as $_k=>$_v){
										$query->orWhereRaw("find_in_set('{$_v}', $oneCond[0])");
									}
								});
							} else {
								$obj->whereRaw("find_in_set('{$oneCond[2]}', $oneCond[0])");
							}
							
						break;

						case 'orlike':
							$obj->orWhere($oneCond[0], str_replace('or', '', $oneCond[1]), $oneCond[2]);
						break;

						default:
							$obj->where($oneCond[0], $oneCond[1], $oneCond[2]);
						break;
					}
				}else{
					$obj->where($oneCond[0], $oneCond[1]);
				}
				
			}
		}

		if($page && $limit) {
			$offset = (max($page, 1)-1)*$limit;
			$obj->skip($offset)->take($limit);
		}
		return $obj->orderby($field, $sort)->get();
	}

	/**
	 * count
	 * @param  [type] $cond [description]
	 * @return [type]       [description]
	 */
	public function countByCond($cond) {
		$field = $this->getPKField();
		$obj = $this->_orm->select($field);
		
		if(is_array($cond)) {
			foreach($cond as $oneCond) {
				if(count($oneCond)>2){
					switch(strtolower($oneCond[1])) {
						case 'in':
							$obj->whereIn($oneCond[0], $oneCond[2]);
						break;

						case 'notin':
							$obj->whereNotIn($oneCond[0], $oneCond[2]);
						break;

						case 'andwhereinset':
							if(is_array($oneCond[2])) {
								$obj->where(function($query)use($oneCond){
									foreach($oneCond[2] as $_k=>$_v){
										$query->orWhereRaw("find_in_set('{$_v}', $oneCond[0])");
									}
								});
							} else {
								$obj->whereRaw("find_in_set('{$oneCond[2]}', $oneCond[0])");
							}
						break;

						case 'orlike':
							$obj->orWhere($oneCond[0], str_replace('or', '', $oneCond[1]), $oneCond[2]);
						break;

						default:
							$obj->where($oneCond[0], $oneCond[1], $oneCond[2]);
						break;
					}
				}else{
					$obj->where($oneCond[0], $oneCond[1]);
				}
			}
		}
		return $obj->count();
	}

	/**
	 * 取得单列值
	 * @param  [type] $field [description]
	 * @param  [type] $id    [description]
	 * @return [type]        [description]
	 */
	public function getUnit($field, $id) {
		$pkField = $this->getPKField();
		$obj = $this->_orm->select($pkField, $field);
		if(is_array($id)) {
			$obj->whereIn($pkField, $id);
		} else {
			$obj->where($pkField, $id);
		}

		$list = $obj->get()->toArray();
		$rs = array();
		if(is_array($id)) {
			foreach($list as $item) {
				$item[$field] = (int)$item[$field];
				$rs["{$item[$pkField]}"] = $item;
			}
		}else{
			$list[0][$field] = (int)$list[0][$field];
			$rs["{$id}"] = $list[0];
		}

		return $rs;
	}

	/**
	 * 反回本实例
	 */
	public function ORM() {
		return $this->_orm;
	}

}
