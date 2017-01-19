<?php
namespace Api\Apis;

use Api\OpenApi;


/**
 * 项目名称:  高分CMS
 * 建立日期:  2013年03月14日
 * 
 * 【分类】推荐词管理
 * 
 * @作者 xietaozhi <xietaozhi@gaofen.com>
 * @版本 $Id:
 **/


class BaikeBlock extends Base {

	function __construct()
	{
		$this->tblock = $this->getBase('Tblock');
		
		//注册区块类型
		$this->tblock->reg('bk_block');
	}

	function get($p = array()) {
		$id = openApi::param($p, 'id');
		
		if(empty($id)) {
			openApi::throwException(10000, '缺少参数', '缺少参数');
		}
		
		$blockInfo = $this->_exData($this->tblock->get($id));
		
		$ids = array();
		if(!empty($blockInfo['data']) && is_array($blockInfo['data'])){
			foreach($blockInfo['data'] as $k=>$row){
				$ids[] = $row['id'];
			}
		}
		
		$list = $this->getBase('Entry')->getBatch($ids);
		
		if(!empty($blockInfo['data'])){
			$relData = array();
			foreach($blockInfo['data'] as $k=>$row){
				$relData[$k] = $list[$row['id']];
			}

			$blockInfo['data'] = $relData;
		}

		return $blockInfo;
	}
	
	/**
	* 使用别名获取榜单内容
	* 
	* @param mixed $p['flag'] 榜单字段flag
	*/
	function getByFlag($p = array()) {
		$flag = openApi::param($p, 'flag');
		if(empty($flag)) {
			openApi::throwException(10000, '缺少参数', '缺少参数');
		}
		
		return $this->get($this->tblock->getByFlag($flag));
	}
	
	/**
	* 批量获取榜单
	* 
	* @param mixed $p['ids']  榜单的ID列表，','分隔; 例: 1,2,3
	*/
	function getBatch($p){
		$ids = openApi::param($p, 'ids', array());
		
		if(!is_array($ids)){
			$ids = explode(',', $ids);
		}
		
		$list = $this->tblock->getBatch($ids);
		if(is_array($list) && !isset($list['errno'])) {
			foreach($list as $i=>$blockInfo){
				$list[$i] = $this->_exData($blockInfo);

				$ids = array();
				if(!empty($blockInfo['data']) && is_array($blockInfo['data'])){
					foreach($blockInfo['data'] as $k=>$row){
						$ids[] = $row['id'];
					}
				}
				
				$entrylist = $this->getBase('Entry')->getBatch($ids);

				//存放提取词条的关联词ID
				$relIds = array();
				if(!empty($entrylist) && is_array($entrylist)) {
					foreach($entrylist as $k=>$row){
						if(!empty($row['relate_entries'])) {
							$entrylist[$k]['relate_entries'] = explode(',', $entrylist[$k]['relate_entries']);
							$relIds = array_merge($relIds, $entrylist[$k]['relate_entries']);
						}else{
							$entrylist[$k]['relate_entries'] = array();
						}					
					}


					//减少entry api调用次数，做优化处理；
					$relList = $this->getBase('Entry')
									->getBatch($relIds);

					foreach($blockInfo['data'] as $k=>$row){
						if(isset($entrylist[$row['id']])) {
							$relData = array();
							foreach($entrylist[$row['id']]['relate_entries'] as $rid) {
								if(isset($relList[$rid])) {
									$relData[] = array('id'=>$relList[$rid]['id'], 'name'=>$relList[$rid]['name'], 'school_type'=>$relList[$rid]['school_type']);
								} 
							}
							$entrylist[$row['id']]['relate_entries'] = $relData;
						}						
					}

					$list[$i]['data'] = $entrylist;
				}
		
			}
		}
		
		return $list;
	}
	
	
	/**
	* 按条件按条件
	* 
	* @param mixed $p['school_type'] 学段值
	* @param mixed $p['type'] 位置分类
	* @param mixed $p['page']
	* @param mixed $p['limit']
	*/
	function listByCond($p) {
		$cond  = $this->_exParams($p);
		$page  = openApi::param($p, 'page', 1);
		$limit = openApi::param($p, 'limit', 20);
		
		$ids    = $this->tblock->listIdsByCond($cond);		
		$total  = count($ids);
		$offset = ($page-1) * $limit;
		$ids    = array_slice($ids, $offset, $limit);
		$list   = $this->getBatch(array('ids'=>$ids));

		foreach($list as $k=>$row){
			$list[$k] = $this->_exData($row);
			$list[$k]['data'] = array_values($row['data']);
		}
		
		return array('list'=>$list, 'total'=>$total);
	}
	
	function create($p){
		$p = $this->_exParams($p, 'create');
		$rs= $this->tblock->save($p);
        
        if($rs){
            return array('result'=>$rs['id']);
        }else{
            openApi::throwException(10000, '创建失败');
        }
	}
	
	function update($p) {
		$p = $this->_exParams($p, 'update');
		$id = openApi::param($p, 'id');
		
        return $this->tblock->save($p, $id);
	}
	
	function delete($p){
		$id = openApi::param($p, 'id');
		if(empty($id)) openApi::throwException(10000, 'id不正确');
		
		$rs = $this->tblock->delete($id);
		return $rs;
	}
	
	private function _getExField(){
		return array('school_type'=>'cond1', 'flag'=>'flag', 'category_id'=>'cond2');
	}
	
	private function _exParams($cond, $type='cond'){
		$ex = $this->_getExField();
		$return = array();
		if($type=='cond'){
			foreach($ex as $org=>$val) {
				if(isset($cond[$org])) $return[$ex[$org]] = openApi::param($cond, $org);
			}
		}else{
			foreach($cond as $org=>$val) {
				if(isset($ex[$org])){
					$return[$ex[$org]] = openApi::param($cond, $org);
				}else{
					$return[$org] = openApi::param($cond, $org);
				}
			}
		}
		
		return $return;
	}
	
	private function _exData($row){
		$ex = array_flip($this->_getExField());
		if($row && is_array($row)) {
			foreach($ex as $org=>$val) {
				if(isset($row[$org])){
					$row[$ex[$org]] = $row[$org];
					unset($row[$org]);
				}
			}
		}
		return $row;
	}
}
