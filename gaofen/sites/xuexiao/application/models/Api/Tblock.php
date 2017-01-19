<?php
use ORM\Tblock;

class Api_TblockModel extends Api_BaseModel {
	public function save($data, $id='', $field='id') {
		if($id) {
			return Tblock::where($field, $id)->update($data);
		} else {
			return Tblock::create($data)->toArray();
		}		
	}
	
	public function get($id, $field='id') {	
		$rs = Tblock::where($field, $id)->get()->toArray();
		return array_shift($rs);
	}
	
	public function getBatch(array $ids, $field='id') {
		return Tblock::whereIn($field, $ids)->get()->toArray();
	}

	public function delete($id, $field='id') {
		if(is_array($id)) {
			return Tblock::whereIn($field, $id)->delete();
		} else {
			return Tblock::where($field, $id)->delete();
		}
	}

	public function listIdsByCond($cond) {
		$obj = Tblock::select('id', 'created_at', 'sort');
		
		if(is_array($cond)) {
			foreach($cond as $oneCond) {
				if(count($oneCond)>2){
					$obj->where($oneCond[0], $oneCond[1], $oneCond[2]);
				}else{
					$obj->where($oneCond[0], $oneCond[1]);
				}
				
			}
		}
		return $obj->get()->toArray();
	}

	public function getByFlag($flag) {
		if($flag){
			return Tblock::where('flag', $flag)->first()->toArray();
		}

		return array();
	}


	public function getUnit($field, $id) {
		$obj = Tblock::select('id', $field);
		if(is_array($id)) {
			$obj->whereIn($field, $id);
		} else {
			$obj->where($field, $id);
		}

		return $obj->get()->toArray();
	}
}