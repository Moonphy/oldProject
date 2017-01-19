<?php

class SchoolController extends AdminCommonController {

	public function listAction() {

		$params = array();

		$limit = 20;
		$keyword = V('r:keyword');
		$gz_property = V('r:gz_property');
		$gz_state = V('r:gz_state');
		$has_cz = V('r:has_cz', '0');
		$city = V('r:city', 289);
		$district = V('r:district');
		$params['name'] = $keyword;
		$params['gz_property'] = $gz_property;
		$params['gz_state'] = $gz_state;
		$params['page'] 	= max(V('r:page'), 1);
		$params['limit'] 	= $limit;
		$params['has_cz'] 	= $has_cz;
		$params['city']		= $city;
		$params['district']		= $district;

		//if (!empty($params['name'])) {
		$list = F::api('/Gz/School/listByCondForAdmin', $params);
		//} else {
		//	$list = F::api('/Gz/School/listByCond', $params);
		//}

		$pager = new PagerInit();
		$page_html = $pager->pager($list['total'], $limit, '');

		$districtList = CFG::school('location');
		$propertyList = CFG::school('school', 'gz_property');

		$this->getView()->assign(compact(['list', 'page_html', 'districtList', 'propertyList', 'keyword', 'gz_property', 
											'gz_state', 'has_cz', 'city', 'gzAdmitRangeList', 'district']));
	}

	public function indexAction() {
		F::Redirect(F::URL('GzAdmin/School/list'));
	}

	public function createAction() {
		//$this->checkAjax();
		$data = array();

		$fields = array('name', 'top', 'gz_property', 'province', 'city', 'district', 'address', 'tags',
			'phone', 'website', 'sort', 'has_cz'

		);

		foreach ($fields as $fieldName) {
			if (($fieldValue = V('r:' . $fieldName)) !== NULL) {
				$data[$fieldName] = $fieldValue;
			}
		}

		$data['has_cz'] = 1;

		if (empty($data['name'])) {
			F::ajaxRst(false, 10000, '学校名不能为空');
		}

		if (!empty($data['province'])) {
			$_district = explode('_', $data['province']);
			$data['province'] = $_district[0];
			$data['province_name'] = $_district[1];
		}

		if (!empty($data['city'])) {
			$_district = explode('_', $data['city']);
			$data['city'] = $_district[0];
			$data['city_name'] = $_district[1];
		}

		if (!empty($data['district'])) {
			$_district = explode('_', $data['district']);
			$data['district'] = $_district[0];
			$data['district_name'] = $_district[1];
		}

		$rs = F::api('/Gz/School/create', $data);

		if ($rs && !isset($rs['errno'])) {
			F::ajaxRst($rs);
		}

		F::ajaxRst(false, 10000, isset($rs['err']) ? $rs['err'] : '创建失败');
		return false;
	}

	/**
	 * 修改基础信息
	 * @return [type] [description]
	 */
	public function updatePartAAction() {
		$data = array();

		$fields = array('id', 'name', 'sub_name', 'top', 'gz_property', 'province', 'city', 'district', 'tags',
			'ext', 'sort', 'intro', 'cover', 'has_gz', 'has_cz', 'school_zone', 'gz_state', 'cate', 'gz_level', 'gz_admit_range',
			'gz_admit_batch', 'code'
		);

		foreach ($fields as $fieldName) {
			if (($fieldValue = V('p:' . $fieldName)) !== NULL) {
				$data[$fieldName] = $fieldValue;
			}
		}

		$id = $data['id'];

		$info = F::api('/Gz/School/get', array('id' => $id, '_useFormat'=>false));
		if (empty($info) || isset($info['errno'])) {
			F::ajaxRst(false, 10000, '记录不存在');
		}

		if (!empty($data['tags']) && is_array($data['tags'])) {
			$data['tags'] = implode(',', $data['tags']);
		}else{
			$data['tags'] = '';
		}

		if (!empty($data['gz_admit_range']) && is_array($data['gz_admit_range'])) {
			//为避免选择全市值过多，选择全市的只保留一个有效值
			if(isset($data['gz_admit_range'][0]) && $data['gz_admit_range'][0]==1){
				$data['gz_admit_range'] = array(1);
			}
			$data['gz_admit_range'] = implode(',', $data['gz_admit_range']);
		} else {
			$data['gz_admit_range'] = '';
		}

		if (!empty($data['gz_admit_batch']) && is_array($data['gz_admit_batch'])) {
			$data['gz_admit_batch'] = implode(',', $data['gz_admit_batch']);
		} else {
			$data['gz_admit_batch'] = '';
		}

		if (!empty($data['top']) && is_array($data['top'])) {
			$data['top'] = implode(',', $data['top']);
		} else {
			$data['top'] = '';
		}


		if (!empty($data['province'])) {
			$_district = explode('_', $data['province']);
			$data['province'] = $_district[0];
			$data['province_name'] = $_district[1];
		}

		if (!empty($data['city'])) {
			$_district = explode('_', $data['city']);
			$data['city'] = $_district[0];
			$data['city_name'] = $_district[1];
		}

		if (!empty($data['district'])) {
			$_district = explode('_', $data['district']);
			$data['district'] = $_district[0];
			$data['district_name'] = $_district[1];
		}

		$rs = F::api('/Gz/School/update', $data);
		if ($rs && !isset($rs['errno'])) {
			F::ajaxRst($rs);
		}

		F::ajaxRst($rs, 10000, '修改失败');
		return false;
	}

	/**
	 * 修改学校简介
	 * @return [type] [description]
	 */
	public function updatePartBAction() {
		$data = array();

		$fields = array('id', 'intro', 'cover' );

		foreach ($fields as $fieldName) {
			if (($fieldValue = V('p:' . $fieldName)) !== NULL) {
				$data[$fieldName] = $fieldValue;
			}
		}

		$id = $data['id'];

		$info = F::api('/Gz/School/get', array('id' => $id, '_useFormat'=>false));
		if (empty($info) || isset($info['errno'])) {
			F::ajaxRst(false, 10000, '记录不存在');
		}

		
		$rs = F::api('/Gz/School/update', $data);
		if ($rs && !isset($rs['errno'])) {
			F::ajaxRst($rs);
		}

		F::ajaxRst($rs, 10000, '修改失败');
		return false;
	}

	/**
	 * 学校基础信息
	 * @return [type] [description]
	 */
	public function editAction() {
		$id = V('r:id');

		$info = F::api('/Gz/School/get', array('id' => $id, '_useFormat'=>false));

		if (empty($info)) {
			die('学校不存在');
		}

		$picList = F::api('/Gz/Pic/listByCond', array('sid' => $id, 'limit' => 30));

		$districtList = CFG::school('location');
		$propertyList = CFG::school('school', 'gz_property');
		
		$gzLevelList = CFG::school('school', 'gz_level');

		$gzAdmitRangeList = CFG::school('school', 'gz_admit_range');

		$gzAdmitBatchList = CFG::school('school', 'gz_admit_batch');

		$gzTopList = CFG::school('school', 'gz_top');

		$this->getView()->assign(compact('info', 'districtList', 'propertyList', 'picList', 'id', 'gzAdmitRangeList', 'gzAdmitBatchList', 'gzLevelList', 'gzTopList'));
	}

	public function deleteAction() {
		$id = V('r:id');

		$rs = F::api('/Gz/School/delete', array('id' => $id));
		if ($rs && !isset($rs['errno'])) {
			F::ajaxRst($rs);
		} else {
			F::ajaxRst(false, 10000, '删除失败');
		}
	}

//===========info==============================>
	public function editInfoAction() {
		$sid = V('r:id');
		$type = V('r:type');

		if (empty($sid) || empty($type)) {
			die('缺少参数');
		}

		$list = F::api('/Gz/Info/listByCond', array('sid' => $sid, 'type' => $type, '_useFormat'=>false));
		$info = isset($list['list'][0]) ? $list['list'][0] : array();

		$admitForteList = json_encode(CFG::school('admit_forte'));

		$luquTypeList = CFG::school('luqu_type');
		$gzAdmitRangeList = CFG::school('school', 'gz_admit_range');
		$gzAdmitBatchList = CFG::school('school', 'gz_admit_batch');

		$struct = $this->getInfoStruct($type, $sid);
		$this->getView()->assign(compact(['sid', 'type', 'info', 'struct', 'admitForteList', 'luquTypeList', 'gzAdmitRangeList', 'gzAdmitBatchList']));
		$this->getView()->display('school/editinfo.html');
		return false;
	}

	public function updateInfoAction() {
		$id = V('r:id');
		$info = F::api('/Gz/Info/get', array('id' => $id));

		$data = array();
		$fields = array('sid', 'type', 'name', 'data', 'sort');

		foreach ($fields as $fieldName) {
			if (($fieldValue = V('p:' . $fieldName)) !== NULL) {
				$data[$fieldName] = $fieldValue;
			}
		}

		if (empty($data['data'])) {
			$data['data'] = array();
		}

		if (empty($info)) {
			$rs = F::api('/Gz/Info/create', $data);
		} else {
			$data['id'] = $id;//var_dump($data);
			$rs = F::api('/Gz/Info/update', $data);
		}

		if ($rs && !isset($rs['errno'])) {
			F::ajaxRst($rs);
		}

		F::ajaxRst($rs, 10000, '保存失败');
		return false;
	}

	/**
	 * [getInfoStruct description]
	 * @param  [int] $type 与info表的type一一对应,与others.ini中的schoolInfo.type
	 * @return [type]       [description]
	 */
	private function getInfoStruct($type, $sid) {

		$struct[7] = array(
			'modules' => array(
				array('name' => '自定义内容', 'flag' => 'udm_text', 'sys' => 0),
			),
		);

		//跟根据学校信息生成需添加的批次内容块
		if($type==7) {
			$batchTypeList = CFG::school('school', 'gz_admit_batch');
			foreach($batchTypeList as $batch_id=>$batch_name) {
				$struct[7]['modules'][] = array('name' => $batch_name, 'flag' => 'gz_admit_score', 'sys' => 1);
			}
		}

		$struct[8] = array(
			'modules' => array(
				array('name' => '自定义内容', 'flag' => 'udm_text', 'sys' => 0),
				array('name' => '高考成绩', 'flag' => 'gz_score', 'sys' => 1),
			),
		);

		$struct[9] = array(
			'modules' => array(
				array('name' => '自定义内容', 'flag' => 'udm_text', 'sys' => 0),
				array('name' => '招生人数', 'flag' => 'rich_text', 'sys' => 1),
				array('name' => '特长生', 'flag' => 'admit_forte', 'sys' => 1),
				array('name' => '特色班', 'flag' => 'rich_text', 'sys' => 1),
				array('name' => '宿位', 'flag' => 'rich_text', 'sys' => 1),
			),
		);

		$struct[10] = array(
			'modules' => array(
				array('name' => '自定义内容', 'flag' => 'udm_text', 'sys' => 0),
				array('name' => '荣誉奖项', 'flag' => 'rich_text', 'sys' => 1),
				array('name' => '优秀教师', 'flag' => 'rich_text', 'sys' => 1),
				array('name' => '社团活动', 'flag' => 'rich_text', 'sys' => 1),
				array('name' => '交通情况', 'flag' => 'rich_text', 'sys' => 1),
			),
		);

		$struct[$type]['type'] = $type;
		$struct[$type]['name'] = CFG::school('schoolInfo', 'type', $type);

		return $struct[$type];
	}

//======================score本校中考数据====================>
	public function updateScoreAction() {
		$id = V('r:id');
		$info = F::api('/Gz/Score/get', array('id' => $id));

		$data = array();
		$fields = array('sid', 'area_id', 'joins', 'yiben_luqu', 'erben_a_luqu', 'erben_b_luqu', 'year');

		foreach ($fields as $fieldName) {
			if (($fieldValue = V('p:' . $fieldName)) !== NULL) {
				$data[$fieldName] = $fieldValue;
			}
		}

		if (empty($info)) {
			$rs = F::api('/Gz/Score/create', $data);
		} else {
			$data['id'] = $id;
			$rs = F::api('/Gz/Score/update', $data);
		}

		if ($rs && !isset($rs['errno'])) {
			F::ajaxRst($rs);
		}

		F::ajaxRst($rs, 10000, '保存失败');
		return false;
	}

	//获取中考数据列表
	public function getScoreListAction() {
		$sid = V('r:sid');

		$list = F::api('/Gz/Score/listByCond', array('sid' => $sid));

		F::ajaxRst($list);
	}

	public function deleteScoreAction() {
		$id = V('r:id');

		$rs = F::api('/Gz/Score/delete', array('id' => $id));
		if ($rs && !isset($rs['errno'])) {
			F::ajaxRst($rs);
		} else {
			F::ajaxRst(false, 10000, '删除失败');
		}
	}

//=======================admitForte==============>
	public function updateAdmitForteAction() {
		$id = V('r:id');
		$info = F::api('/Gz/Admitforte/get', array('id' => $id));

		$data = array();
		$fields = array('sid', 'type', 'cate', 'year', 'num', 'memo');

		foreach ($fields as $fieldName) {
			if (($fieldValue = V('p:' . $fieldName)) !== NULL) {
				$data[$fieldName] = $fieldValue;
			}
		}

		if (empty($info)) {
			$rs = F::api('/Gz/Admitforte/create', $data);
		} else {
			$data['id'] = $id;
			$rs = F::api('/Gz/Admitforte/update', $data);
		}

		if ($rs && !isset($rs['errno'])) {
			F::ajaxRst($rs);
		}

		F::ajaxRst($rs, 10000, '保存失败');
		return false;
	}

	//获取特长生数据列表
	public function getAdmitForteListAction() {
		$sid = V('r:sid');

		$list = F::api('/Gz/Admitforte/listByCond', array('sid' => $sid));

		F::ajaxRst($list);
	}

	public function deleteAdmitForteAction() {
		$id = V('r:id');

		$rs = F::api('/Gz/Admitforte/delete', array('id' => $id));
		if ($rs && !isset($rs['errno'])) {
			F::ajaxRst($rs);
		} else {
			F::ajaxRst(false, 10000, '删除失败');
		}
	}

//=======================AdmitScore==============>
	public function updateAdmitScoreAction() {
		$id = V('r:id');
		$info = F::api('/Gz/Admitscore/get', array('id' => $id));

		$module_name = V('r:module_name');

		$batchTypeList = array_flip(CFG::school('school', 'gz_admit_batch'));
		
		$batch_id = $batchTypeList[$module_name];

		$data = array();
		$fields = array('sid', 'year', 'admit_range_id', 'luqu_id', 'area_id', 'low_mark', 'low_mark_last', 
			'last_student_wish', 'last_student_mark', 'last_student_num', 'other_low_mark', 'other_low_num', 'max_wish_num');

		foreach ($fields as $fieldName) {
			if (($fieldValue = V('p:' . $fieldName)) !== NULL) {
				$data[$fieldName] = $fieldValue;
			}
		}

		$data['batch_id'] = $batch_id;

		if (empty($info)) {
			$rs = F::api('/Gz/Admitscore/create', $data);
		} else {
			$data['id'] = $id;
			$rs = F::api('/Gz/Admitscore/update', $data);
		}

		if ($rs && !isset($rs['errno'])) {
			F::ajaxRst($rs);
		}

		F::ajaxRst($rs, 10000, '保存失败');
		return false;
	}

	//本校录取分数线列表
	public function getAdmitScoreListAction() {
		$sid = V('r:sid');
		$module_name = V('r:module_name');

		$batchTypeList = array_flip(CFG::school('school', 'gz_admit_batch'));
		$batch_id = @$batchTypeList[$module_name];

		$list = F::api('/Gz/Admitscore/listByCond', array('sid' => $sid, 'batch_id'=>$batch_id));

		F::ajaxRst($list);
	}

	public function deleteAdmitScoreAction() {
		$id = V('r:id');

		$rs = F::api('/Gz/Admitscore/delete', array('id' => $id));
		if ($rs && !isset($rs['errno'])) {
			F::ajaxRst($rs);
		} else {
			F::ajaxRst(false, 10000, '删除失败');
		}
	}

//======================schedule=================>
	public function updateScheduleAction() {
		$id = V('r:id');
		$info = F::api('/Gz/Schedule/get', array('id' => $id));

		$data = array();
		$fields = array('sid', 'data');

		foreach ($fields as $fieldName) {
			if (($fieldValue = V('p:' . $fieldName)) !== NULL) {
				$data[$fieldName] = $fieldValue;
			}
		}

		if (empty($info)) {
			$rs = F::api('/Gz/Schedule/create', $data);
		} else {
			$data['id'] = $id;
			$rs = F::api('/Gz/Schedule/update', $data);
		}

		if ($rs && !isset($rs['errno'])) {
			F::ajaxRst($rs);
		}

		F::ajaxRst($rs, 10000, '保存失败');
		return false;
	}

	//本校录取分数线列表
	public function getScheduleListAction() {
		$sid = V('r:sid');

		$rs = F::api('/Gz/Schedule/listByCond', array('sid' => $sid, 'limit' => 1));

		$list = array_shift($rs['list']);
		F::ajaxRst(array('list' => $list));
	}

	public function deleteScheduleAction() {
		$id = V('r:id');

		$rs = F::api('/Gz/Schedule/delete', array('id' => $id));
		if ($rs && !isset($rs['errno'])) {
			F::ajaxRst($rs);
		} else {
			F::ajaxRst(false, 10000, '删除失败');
		}
	}

}
