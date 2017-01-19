<?php
use ORM\Rank;

class Api_RankModel extends Api_BaseModel {
	
	public function save($data, $id='', $field='id') {
		if($id) {
			return Rank::where($field, $id)->update($data);
		} else {
			return Rank::create($data)->toArray();
		}		
	}
	
	public function get($id, $field='id') {
		$rs = Rank::where($field, $id)->get()->toArray();
		return array_shift($rs);
	}
	
	public function getBatch(array $ids, $field='id') {
		return Rank::whereIn($field, $ids)->get()->toArray();
	}

	public function delete($id, $field='id') {
		if(is_array($id)) {
			return Rank::whereIn($field, $id)->delete();
		} else {
			return Rank::where($field, $id)->delete();
		}
	}

	public function listIdsByCond($cond) {
		$obj = Rank::select('id', 'created_at', 'dateline');
		
		if(is_array($cond)) {
			foreach($cond as $oneCond) {
				if(count($oneCond)>2){
					$obj->where($oneCond[0], $oneCond[1], $oneCond[2]);
				}else{
					$obj->where($oneCond[0], $oneCond[1]);
				}
				
			}
		}
		return $obj->orderby('id', 'desc')->get()->toArray();
	}


	public function getUnit($field, $id) {
		$obj = Rank::select('id', $field);
		if(is_array($id)) {
			$obj->whereIn($field, $id);
		} else {
			$obj->where($field, $id);
		}

		return $obj->get()->toArray();
	}
}