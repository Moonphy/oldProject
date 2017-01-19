<?php

class PicController extends AdminCommonController
{

	public function getBySidAction() {

		$params = array();

		$limit = 30;
		$params['sid'] = V('r:sid');
		$params['property'] = V('r:property');
		$params['page'] = max(V('r:page'), 1);
		$params['limit'] = $limit;

		if(empty($params['sid'])) {
			F::ajaxRst(false, 10000, '缺少sid');
		}

		$list = F::api('/Gz/Pic/listByCond', $params);

		F::ajaxRst($list);
		return false;
	}

	public function createAction() {
		//$this->checkAjax();
		$data = array();

		$fields = array('title', 'uid', 'sid', 'sort', 'uri', 'width', 'height',
			);

		foreach($fields as $fieldName) {
			if(($fieldValue = V('r:'.$fieldName))!==NULL) {
				$data[$fieldName] = $fieldValue;
			}
		}

		if(empty($data['sid'])) {
			F::ajaxRst(false, 10000, 'sid不能为空');
		}

		$rs = F::api('/Gz/Pic/create', $data);

		if($rs && !isset($rs['errno'])){
			F::ajaxRst($rs);
		}

		F::ajaxRst(false, 10000, isset($rs['err'])?$rs['err']:'创建失败');
		return false;
	}

	public function updateAction() {
		$data = array();

		$fields = array('id', 'title', 'sort');

		foreach($fields as $fieldName) {
			if(($fieldValue = V('p:'.$fieldName))!==NULL) {
				$data[$fieldName] = $fieldValue;
			}
		}

		$id = V('r:id');

		$info = F::api('/Gz/Pic/get', array('id'=>$id));
		if(empty($info) || isset($info['errno'])) {
			F::ajaxRst(false, 10000, '记录不存在');
		}

		$rs = F::api('/Gz/Pic/update', $data);
		if($rs && !isset($rs['errno'])){
			F::ajaxRst($rs);
		}

		F::ajaxRst(false, 10000, '修改失败');
		return false;
	}


	public function updateSortAction() {
		$ids = V('r:ids', array());

		if(!is_array($ids)) {
			$ids = explode(',', $ids);
		}

		foreach($ids as $k=>$pic_id) {
			F::api('/Gz/Pic/update', array('id'=>$pic_id, 'sort'=>$k));
		}

		F::ajaxRst(true);
	}


	public function deleteAction() {
		$id     = V('r:id');

		$rs = F::api('/Gz/Pic/delete', array('id'=>$id));
		if($rs && !isset($rs['errno'])) {
			F::ajaxRst($rs);
		}else{
			F::ajaxRst(false, 10000, '删除失败');
		}
	}

}
