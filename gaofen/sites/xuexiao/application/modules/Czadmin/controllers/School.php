<?php

class SchoolController extends AdminCommonController {

	public function listAction() {

		$params = array();

		$limit = 20;
		$keyword = V('r:keyword');
		$property = V('r:property');
		$cz_state = V('r:cz_state');
		$has_cz = V('r:has_cz', '1');
		$city = V('r:city', 289);
		$district = V('r:district');
		$params['name'] = $keyword;
		$params['property'] = $property;
		$params['cz_state'] = $cz_state;
		$params['page'] 	= max(V('r:page'), 1);
		$params['limit'] 	= $limit;
		$params['has_cz'] 	= $has_cz;
		$params['city']		= $city;
		$params['district']		= $district;

		//if (!empty($params['name'])) {
			$list = F::api('/Cz/School/listByCondForAdmin', $params);
		//} else {
		//	$list = F::api('/Cz/School/listByCond', $params);
		//}

		$pager = new PagerInit();
		$page_html = $pager->pager($list['total'], $limit, '');

		$districtList = CFG::school('location');
		$propertyList = CFG::school('school', 'property');

		$this->getView()->assign(compact(['list', 'page_html', 'districtList', 'propertyList', 'keyword', 'property', 'cz_state', 'has_cz', 'city', 'district']));
	}

	public function indexAction() {
		F::Redirect(F::URL('CzAdmin/School/list'));
	}

	public function createAction() {
		//$this->checkAjax();
		$data = array();

		$fields = array('name', 'top', 'property', 'province', 'city', 'district', 'address', 'tags',
			'phone', 'website', 'sort', 'attype', 'pstype', 'has_gz'
		);

		foreach ($fields as $fieldName) {
			if (($fieldValue = V('r:' . $fieldName)) !== NULL) {
				$data[$fieldName] = $fieldValue;
			}
		}

		$data['has_gz'] = 1;

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

		$rs = F::api('/Cz/School/create', $data);

		if ($rs && !isset($rs['errno'])) {
			F::ajaxRst($rs);
		}

		F::ajaxRst(false, 10000, isset($rs['err']) ? $rs['err'] : '创建失败');
		return false;
	}

	public function updatePartAAction() {
		$data = array();

		$fields = array('id', 'name', 'sub_name', 'top', 'property', 'province', 'city', 'district', 'tags',
			'ext', 'sort', 'intro', 'cover', 'has_gz', 'has_cz', 'school_zone', 'cz_state', 'cate', 'attype', 'pstype',
		);

		foreach ($fields as $fieldName) {
			if (($fieldValue = V('p:' . $fieldName)) !== NULL) {
				$data[$fieldName] = $fieldValue;
			}
		}

		$id = $data['id'];

		$info = F::api('/Cz/School/get', array('id' => $id, '_useFormat'=>false));
		if (empty($info) || isset($info['errno'])) {
			F::ajaxRst(false, 10000, '记录不存在');
		}

		if (!empty($data['property']) && is_array($data['property'])) {
			$data['property'] = implode(',', $data['property']);
		}else{
			$data['property'] = '';
		}

		if (!empty($data['attype']) && is_array($data['attype'])) {
			$data['attype'] = implode(',', $data['attype']);
		}else{
			$data['attype'] = '';
		}

		if (!empty($data['pstype']) && is_array($data['pstype'])) {
			$data['pstype'] = implode(',', $data['pstype']);
		}else{
			$data['pstype'] = '';
		}

		if (!empty($data['tags']) && is_array($data['tags'])) {
			$data['tags'] = implode(',', $data['tags']);
		}else{
			$data['tags'] = '';
		}

		if (!empty($data['top']) && is_array($data['top'])) {
			$data['top'] = implode(',', $data['top']);
		}else{
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

		$rs = F::api('/Cz/School/update', $data);
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

		$info = F::api('/Cz/School/get', array('id' => $id, '_useFormat'=>false));
		if (empty($info) || isset($info['errno'])) {
			F::ajaxRst(false, 10000, '记录不存在');
		}

		
		$rs = F::api('/Cz/School/update', $data);
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

		$info = F::api('/Cz/School/get', array('id' => $id, '_useFormat'=>false));

		if (empty($info)) {
			die('学校不存在');
		}

		$picList = F::api('/Cz/Pic/listByCond', array('sid' => $id, 'limit' => 30));

		$districtList = CFG::school('location');
		$propertyList = CFG::school('school', 'property');
		//入学途径列表
        $attypeList = CFG::school('school', 'attype');

        //民校属性
        $pstypeList = CFG::school('school', 'pstype');

        //推荐属性
        $czTopList = CFG::school('school', 'cz_top');

        //标签
        $tags = CFG::tags('tags');

		$this->getView()->assign(compact('info', 'districtList', 'propertyList', 'picList', 'id', 'attypeList', 'pstypeList', 'czTopList', 'tags'));
	}

	public function deleteAction() {
		$id = V('r:id');

		$rs = F::api('/Cz/School/delete', array('id' => $id));
		if ($rs && !isset($rs['errno'])) {
			F::ajaxRst($rs);
		} else {
			F::ajaxRst(false, 10000, '删除失败');
		}
	}

	//抓取关联学校数据
	public function initDataAction() {
		die('已处理禁止操作');
		$page = V('g:page',1);
		$alllist = F::api('/Cz/School/listByCondForAdmin', array('page'=>$page,'limit'=>10));

		if(empty($alllist['list'])) die('Finished at:'.date('Y-m-d H:i:s'));

		foreach($alllist['list'] as $get) {
			//关联学校不存在时忽略
			if(empty($get['datalink'])) {
				continue;
			}

			$opts = array(
			  'http'=>array(
			    'method'=>"GET",
			    'header'=>"Accept-language: en\r\n" .
			              "Cookie: foo=bar\r\n".
						  "User-Agent:Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36\r\n"
			  )
			);

			$context = stream_context_create($opts);

			$url = $get['datalink'];

			$curl = preg_replace(array('#([0-9]+)#sim'), array('sxgl/$1'), $url);


			//基础信息抓取
			$content = file_get_contents($url, false, $context, -1, 10000);
			preg_match_all('#<dd>(.*?)</dd>#sim', $content, $result);
			$_c = isset($result[1][0])?$result[1][0]:'';

			$base = array();
			if($_c) {
				$_c = strip_tags($_c);
				$_c = explode("\n", $_c);
				foreach($_c as $_r) {
					if(strpos($_r,'学校电话')!==false) {
						$base['ext']['phone'] = trim(str_replace('学校电话：', '', $_r));
					}
					if(strpos($_r,'学校地址')!==false) {
						$base['ext']['address'] = trim(str_replace('学校地址：', '', $_r));
					}
					if(strpos($_r,'学校网址')!==false) {
						$base['ext']['website'] = trim(str_replace('学校网址：', '', $_r));
					}
					if(strpos($_r,'入学途径')!==false) {
						$base['ext']['attype'] = trim(str_replace('入学途径：', '', $_r));
					}
				}
			}

			if(!empty($base['ext'])) {
				F::api('/Cz/School/update', array('id'=>$get['id'], 'ext'=>$base['ext']));
			}

			//块数据抓取
			$exArr = array(3=>array('zsqk'=>'住宿情况', 'stqk'=>'食堂情况', 'zxsj'=>'作息时间', 'kwhd'=>'课外活动'), 2=>array('sfqk'=>'学费'));

			$info = array();
			foreach($exArr as $type=>$ea) {
				foreach($ea as $_n=>$_t) {
					$ccontent = file_get_contents($curl.$_n.'/', false, $context, -1, 15000);
					preg_match('#<article>\s*<h3 class="schoolh3 cg1">(?:.*?)(<p>.*</p>)\s*</article>#sim', $ccontent, $result);
					$_cc = isset($result[1])?$result[1]:'';
					if($_cc) {
						$info[$type][] = array('flag'=>'rich_text', 'name'=>$_t, 'value'=>$_cc);
					}
				}
			}

			foreach($info as $type=>$data) {
				$list = F::api('/Cz/Info/listByCond', array('sid'=>$get['id'], 'type'=>$type));
				if(!empty($list['list'])) {
					$_tmp = array_shift($list['list']);
					F::api('/Cz/Info/update', array('id'=>$get['id'], 'data'=>$data));
				}else{
					F::api('/Cz/Info/create', array('sid'=>$get['id'], 'type'=>$type, 'data'=>$data));
				}
			}
		}

		echo '<script>window.location.href="'.F::URL('/Czadmin/school/initData', array('page'=>$page+1)).'";</script>finish page:'.$page;
		return false;
	}

	/**
	 * 关联http://school.aoshu.com/数据及增加没有数据
	 * @return [type] [description]
	 */
	public function initDataLinkAction() {
		die('已处理禁止操作');
		$page = V('g:page', 1);
		if($page>55) die('finish!');
			$url = 'http://school.aoshu.com/province/1019/1020/p'.$page.'/';
			$content = file_get_contents($url);
			//echo $content;
			preg_match_all('#<article[^>]*>(.*?)</article>#sim', $content, $result);

			$info = array();$j=0;
			for($i=1; $i<=10; $i++) {

				if(isset($result[1][$i])) {
					$_c = $result[1][$i];
					preg_match('#<dt>[^"]+"(.*?)"[^>]*>(.*?)</a>(?:.*?)<dd>(?:.*?)</dd>#sim', $_c, $dta);
					//var_dump($dta);
					$rs = F::api('/Cz/School/listByCondForAdmin', array('name'=>$dta[2]));
					if(!empty($rs['list'])) {
						$info['o'][$j]['datalink'] = $dta[1];
						$info['o'][$j]['name'] = $dta[2];
						$sinfo = array_shift($rs['list']);
						$info['o'][$j]['id'] = $sinfo['id'];
					}else{
						$info['x'][$j]['datalink'] = $dta[1];
						$info['x'][$j]['name'] = $dta[2];
					}					
				}

				$j++;
			}

			foreach($info as $_f => $rows) {
				if($_f=='o'){
					foreach($rows as $row) {
						F::api('/Cz/School/update', array('id'=>$row['id'], 'datalink'=>$row['datalink']));
					}
				}else{
					foreach($rows as $row) {
						F::api('/Cz/School/create', array('name'=>$row['name'], 'datalink'=>$row['datalink']));
					}
				}
			}
			echo '<script>window.location.href="'.F::URL('/Czadmin/school/initDataLink', array('page'=>$page+1)).'";</script>finish page:'.$page;
	}

//===========info==============================>
	public function editInfoAction() {
		$sid = V('r:id');
		$type = V('r:type');

		if (empty($sid) || empty($type)) {
			die('缺少参数');
		}

		$list = F::api('/Cz/Info/listByCond', array('sid' => $sid, 'type' => $type, '_useFormat'=>false));
		$info = isset($list['list'][0]) ? $list['list'][0] : array();

		$admitForteList = json_encode(CFG::school('admit_forte'));

		$struct = $this->getInfoStruct($type);
		$this->getView()->assign(compact(['sid', 'type', 'info', 'struct', 'admitForteList']));
		$this->getView()->display('school/editinfo.html');
		return false;
	}

	public function updateInfoAction() {
		$id = V('r:id');
		$info = F::api('/Cz/Info/get', array('id' => $id));

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
			$rs = F::api('/Cz/Info/create', $data);
		} else {
			$data['id'] = $id;//var_dump($data);
			$rs = F::api('/Cz/Info/update', $data);
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
	private function getInfoStruct($type) {

		$struct[1] = array(
			'modules' => array(
				array('name' => '自定义内容', 'flag' => 'udm_text', 'sys' => 0),
				array('name' => '升学成绩', 'flag' => 'score', 'sys' => 1),
			),
		);

		$struct[2] = array(
			'modules' => array(
				array('name' => '自定义内容', 'flag' => 'udm_text', 'sys' => 0),
				array('name' => '招生方式', 'flag' => 'rich_text', 'sys' => 1),
				array('name' => '招生对象', 'flag' => 'rich_text', 'sys' => 1),
				array('name' => '报名方法', 'flag' => 'rich_text', 'sys' => 1),
				array('name' => '录取分数线', 'flag' => 'admit_score', 'sys' => 1),
				array('name' => '分数优惠', 'flag' => 'rich_text', 'sys' => 1),
				array('name' => '特长生招生', 'flag' => 'admit_forte', 'sys' => 1),
				array('name' => '学费', 'flag' => 'rich_text', 'sys' => 1),
				array('name' => '奖学金', 'flag' => 'rich_text', 'sys' => 1),
			),
		);

		$struct[3] = array(
			'modules' => array(
				array('name' => '自定义内容', 'flag' => 'udm_text', 'sys' => 0),
				array('name' => '住宿情况', 'flag' => 'rich_text', 'sys' => 1),
				array('name' => '食堂情况', 'flag' => 'rich_text', 'sys' => 1),
				array('name' => '作息时间', 'num' => 12, 'flag' => 'rich_text'/*'schedule'*/, 'sys' => 1),
				array('name' => '课外活动', 'flag' => 'rich_text', 'sys' => 1),
			),
		);

		$struct[$type]['type'] = $type;
		$struct[$type]['name'] = CFG::school('schoolInfo', 'type', $type);

		return $struct[$type];
	}

//======================score本校中考数据====================>
	public function updateScoreAction() {
		$id = V('r:id');
		$info = F::api('/Cz/Score/get', array('id' => $id));

		$data = array();
		$fields = array('sid', 'score_avg', 'attend_num', 'city_score_avg', 't_h_ratio', 'year');

		foreach ($fields as $fieldName) {
			if (($fieldValue = V('p:' . $fieldName)) !== NULL) {
				$data[$fieldName] = $fieldValue;
			}
		}

		if (empty($info)) {
			$rs = F::api('/Cz/Score/create', $data);
		} else {
			$data['id'] = $id;
			$rs = F::api('/Cz/Score/update', $data);
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

		$list = F::api('/Cz/Score/listByCond', array('sid' => $sid));

		F::ajaxRst($list);
	}

	public function deleteScoreAction() {
		$id = V('r:id');

		$rs = F::api('/Cz/Score/delete', array('id' => $id));
		if ($rs && !isset($rs['errno'])) {
			F::ajaxRst($rs);
		} else {
			F::ajaxRst(false, 10000, '删除失败');
		}
	}

//=======================admitForte==============>
	public function updateAdmitForteAction() {
		$id = V('r:id');
		$info = F::api('/Cz/Admitforte/get', array('id' => $id));

		$data = array();
		$fields = array('sid', 'type', 'cate', 'year', 'num');

		foreach ($fields as $fieldName) {
			if (($fieldValue = V('p:' . $fieldName)) !== NULL) {
				$data[$fieldName] = $fieldValue;
			}
		}

		if (empty($info)) {
			$rs = F::api('/Cz/Admitforte/create', $data);
		} else {
			$data['id'] = $id;
			$rs = F::api('/Cz/Admitforte/update', $data);
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

		$list = F::api('/Cz/Admitforte/listByCond', array('sid' => $sid));

		F::ajaxRst($list);
	}

	public function deleteAdmitForteAction() {
		$id = V('r:id');

		$rs = F::api('/Cz/Admitforte/delete', array('id' => $id));
		if ($rs && !isset($rs['errno'])) {
			F::ajaxRst($rs);
		} else {
			F::ajaxRst(false, 10000, '删除失败');
		}
	}

//=======================AdmitScore==============>
	public function updateAdmitScoreAction() {
		$id = V('r:id');
		$info = F::api('/Cz/Admitscore/get', array('id' => $id));

		$data = array();
		$fields = array('sid', 'year', 'score', 'memo');

		foreach ($fields as $fieldName) {
			if (($fieldValue = V('p:' . $fieldName)) !== NULL) {
				$data[$fieldName] = $fieldValue;
			}
		}

		if (empty($info)) {
			$rs = F::api('/Cz/Admitscore/create', $data);
		} else {
			$data['id'] = $id;
			$rs = F::api('/Cz/Admitscore/update', $data);
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

		$list = F::api('/Cz/Admitscore/listByCond', array('sid' => $sid));

		F::ajaxRst($list);
	}

	public function deleteAdmitScoreAction() {
		$id = V('r:id');

		$rs = F::api('/Cz/Admitscore/delete', array('id' => $id));
		if ($rs && !isset($rs['errno'])) {
			F::ajaxRst($rs);
		} else {
			F::ajaxRst(false, 10000, '删除失败');
		}
	}

//======================schedule=================>
	public function updateScheduleAction() {
		$id = V('r:id');
		$info = F::api('/Cz/Schedule/get', array('id' => $id));

		$data = array();
		$fields = array('sid', 'data');

		foreach ($fields as $fieldName) {
			if (($fieldValue = V('p:' . $fieldName)) !== NULL) {
				$data[$fieldName] = $fieldValue;
			}
		}

		if (empty($info)) {
			$rs = F::api('/Cz/Schedule/create', $data);
		} else {
			$data['id'] = $id;
			$rs = F::api('/Cz/Schedule/update', $data);
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

		$rs = F::api('/Cz/Schedule/listByCond', array('sid' => $sid, 'limit' => 1));

		$list = array_shift($rs['list']);
		F::ajaxRst(array('list' => $list));
	}

	public function deleteScheduleAction() {
		$id = V('r:id');

		$rs = F::api('/Cz/Schedule/delete', array('id' => $id));
		if ($rs && !isset($rs['errno'])) {
			F::ajaxRst($rs);
		} else {
			F::ajaxRst(false, 10000, '删除失败');
		}
	}

}
