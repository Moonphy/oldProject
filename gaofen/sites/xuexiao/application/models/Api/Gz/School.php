<?php
use ORM\GZ\School as ORM;

class Api_Gz_SchoolModel extends Api_BaseModel {
	public function __construct() {
		$this->setORM(new ORM());
		$this->setSelectResultField(['sort']);
	}


	/**
	 * 更新每周浏览数
	 * @return [type] [description]
	 */
	public function updatePreViewAndRangeRank($cate, $city='') {
		//计算并保存当前与上周对比数据
		$city = (int)$city;
		$cate = (int)$cate;
		if($city) {
			$sql = "update xuexiao_cz_school set `range_views` = `views`-`pre_views` where `cate`={$cate} and `city`={$city}";
		}else{
			$sql = "update xuexiao_cz_school set `range_views` = `views`-`pre_views` where `cate`={$cate}";
		}
		$this->ORM()->getConnection()->update($sql, array());

		//更新周排名(旧，不现实)
		/*
		$obj = $this->ORM()->select('id', 'range_views');
		//$obj->where('has_cz', '=', 1);
		//$obj->where('cz_state', '=', 1);
		//$obj->where('cate', '=', $cate);
		if($city){
			$obj->where('city', '=', $city);
		}
		$obj->orderBy('range_views', 'desc');
		$list = $obj->get()->toArray();

		if($cate=='1') {
			$range_rank_field = 'range_rank_yg';
		}else{
			$range_rank_field = 'range_rank_ng';
		}
		foreach($list as $num=>$row){
			$this->ORM()->where('id', $row['id'])->update(array($range_rank_field=>$num+1));
		}
		*/
		//更新周排名(新)
		$wheres = array();
		$wheres[] = "`has_cz`=1";
		$wheres[] = "`cz_state`=1";
		$wheres[] = "`cate`={$cate}";
		if($city){
			$wheres[] = "`city`={$city}";
		}

		if($cate=='1') {
			$range_rank_field = 'range_rank_yg';
		}else{
			$range_rank_field = 'range_rank_ng';
		}

		$wherestr = $wheres?' WHERE '.implode(' AND ', $wheres):'';

		$sql = "UPDATE `xuexiao_cz_school` SET {$range_rank_field}=(@_rankNum:=@_rankNum+1) {$wherestr} ORDER BY range_views DESC;";
		
		$this->ORM()->getConnection()->select('SET @_rankNum=0;');
		$this->ORM()->getConnection()->update($sql, array());

		//保存当周最数据
		if($city) {
			$sql = "update xuexiao_cz_school set `pre_views` = `views` where `cate`={$cate} and `city`={$city}";
		}else{
			$sql = "update xuexiao_cz_school set `pre_views` = `views` where `cate`={$cate}";
		}
		$this->ORM()->getConnection()->update($sql, array());

		return true;
	}
}