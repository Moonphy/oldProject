<?php
/**
 * seo数据生成
 * 
 * 获取seo数据
 * 例：
 *     F::SEO()->getTitle(array('name'='高分网'));   => "{name}是一家网络教育机构" => "高分网是一家网络教育机构"
 *     F::SEO()->getKeyword(); //同上
 *     F::SEO()->getDesc(); //同上
 *
 *     特殊参数：
 *     string $__callBack = ''; //可能有某些文本模版需要复杂数据要处理，才得出最后显示结果，这里候可以用回调方式
 *     string $__pindex = ''; //有些seo需求在同一页面显示不同的seo文本，这里可用参数组成相应的下标获取相应的模板
 *     F::SEO()->getTitle(array('__callBack'='', name'='高分网'));      
 */

namespace Components\Seo;

class Gz extends Base {

	public function _init() {
		$year = (date('Yn') >= date('Y9') || date('Yn')<date('Y9', strtotime('-1 year'))) ? date('Y')+1:date('Y');
		$this->addRenderData('year', $year);
	}

	public $__tpls = array(
		//首页
		'school.index' => array(
			'title' => "【广州重点高中】_{year}广州高中排名-高分网高中库",
			'keyword'	=> "广州重点高中,广州高中排名",
			'desc'	=> "高分网高中库为您提供{year}广州重点高中，广州各区重点高中排名，历年录取分数线查询等信息。",
		),

		//列表页
		'school.list' => array(
			'title' => "广州{district_name}{gz_level_name}{gz_property_name}{gz_admit_batch_name}{gz_admit_range_name}{cate_name}学校有哪些_广州{district_name}{gz_level_name}{gz_property_name}{gz_admit_batch_name}{gz_admit_range_name}{cate_name}学校排名-高分网高中库",
			'keyword'	=> "",
			'desc'	=> "",
		),

		//详细页
		'school.view' => array(
			'title' => array(
							7=>"【{name}】分数线_{year}{name}录取分数线-高分网高中库",
							8=>"【{name}】中考分数_{year}{name}高考成绩-高分网高中库",
							9=>"【{name}】招生简章_{year}{name}招生信息|特长生招生-高分网高中库",
							10=>"【{name}】地址|邮编|电话-高分网高中库",
							11=>"【{name}】最新资讯|最新消息-高分网高中库",
							12=>"【{name}】试题|真题复习资料推荐(下载)-高分网高中库",
						),
			'keyword'	=> array(
							7=>"{name}分数线,{name}录取分数线",
							8=>"{name}中考分数,{name}高考成绩",
							9=>"{name}招生简章,{name}招生信息,特长生招生",
							10=>"{name}地址,{name}邮编,{name}电话",
							11=>"{name}地址,{name}邮编,{name}电话",
							12=>"{name}试题真题复习资料推荐(下载)",
						),
			'desc'	=> array(
							7=>"高分网高中库为您提供{year}{name}，广州各区院校录取分数线，以及广州历年录取分数线查询等信息。",
							8=>"高分网高中库为您提供{year}{name}高考成绩查询,{name}中考分数查询等内容,欢迎广大考生和家长参考查询。",
							9=>"高分网高中库为您提供{year}{name}招生简章、{name}招生信息、学校信息、招生政策、招生计划、特长生招生等内容,欢迎广大考生和家长参考查询。",
							10=>"高分网高中库为您提供{year}{name}地址、邮编、电话、学校周边交通信息、校园生活信息等内容,欢迎广大考生和家长参考查询。",
							11=>"高分网高中库为您提供{year}{name}学校要闻、学校周边交通信息、校园生活信息等内容,欢迎广大考生和家长参考查询。",
							12=>"高分网高中库为您提供历年试题真题复习资料下载，欢迎广大考生和家长下载参考。",
						),
		),
		//学校介绍
		'school.detail' => array(
			'title' 	=> "{name}介绍",
			'keyword'	=> "",
			'desc'		=> "",
		),
		
		//图库页
		'school.album' => array(
			'title' 	=> "{name}图库",
			'keyword'	=> "",
			'desc'		=> "",
		),

		//对比页
		'school.cmp' 	=> array(
			'title' 	=> "{cmp_name}对比哪个好【办学性质|学费|住宿情况】-高分网高中库",
			'keyword'	=> "",
			'desc'		=> "对比{cmp_name}具体区别,了解{cmp_name}中高考成绩和录取分数线，比较{cmp_name}哪个好，请看高分网高中库{cmp_name}对比PK。",
		),

		//选校指南
		'guide.index' 	=> array(
			'title' 	=> "【择校指南】如何择校_择校问题-高分网高中库",
			'keyword'	=> "择校指南,如何择校",
			'desc'		=> "高分网高中库为您提供择校指南，择校问题，欢迎广大考生和家长参考。",
		),


		//估分选校
		'guide.select' 	=> array(
			'title' 	=> "中考分数线_{year}中考录取分数线-高分网高中库",
			'keyword'	=> "在线估分,估分选校,估分报志愿",
			'desc'		=> "高分网高中库为您提供估分选校，估分报志愿实践技巧，帮您预估您的实力，欢迎广大考生和家长参考。",
		),

		//估分选校结果
		'guide.result' => array(
			'title' => "在线估分结果-高分网高中库",
			'keyword'	=> "",
			'desc'	=> "高分网高中库为您提供在线估分结果,帮您预估您的实力,助你更精准的择校。",
		),

		//历年分数线查询
		'guide.history' => array(
			'title' 	=> "中考分数线查询_中考录取分数线查询-高分网高中库",
			'keyword'	=> "中考分数线查询,中考录取分数线查询",
			'desc'		=> "高分网高中库为您提供{year}中考录取分数线查询、中考分数线查询等查询内容,欢迎广大考生和家长参考查询。",
		),

		//填志愿页
		'guide.aspiration' 	=> array(
			'title' 		=> "中考志愿填报指南_中考志愿填报技巧-高分网高中库",
			'keyword'		=> "中考志愿填报指南,中考志愿填报技巧",
			'desc'			=> "高分网高中库为您提供{year}中考志愿填报指南、中考志愿填报技巧等资讯内容,欢迎广大考生和家长参考。",
		),
//////////------------------------mobile--------------->
///
///		//列表页&搜索页
		'mobile_school.list' => array(
			'title' => array(
				0 => '高中库大全',
				1 => '搜素结果页',
			),
		),

		//详细页
		'mobile_school.view' => array(
			'title' => '{name}',
		),

		//图库
		'mobile_school.album' => array(
			'title' => '{name}图片',
		),

		//快讯
		'mobile_school.article' => array(
			'title' => '{name}快讯',
		),

		//高中库首页
		'mobile_school.index' => array(
			'title' => '高中库大全',
		),

	);

	
	/**
	 * callback例子
	 * @param  [type] $tpl  [description]
	 * @param  [type] $data [description]
	 * @return [type]       [description]
	 */
	public function schoolListEx($tpl, $data) {
		$data['district_name'] = !empty($data['inputs']['district'])?
									\CFG::school('location', 'city', $data['inputs']['city'], 'district', $data['inputs']['district'])
									:'';
		$data['gz_level_name'] = !empty($data['inputs']['level'])?
									\CFG::school('school', 'gz_level', $data['inputs']['level'])
									:'';
		$data['gz_property_name'] = !empty($data['inputs']['property'])?
									\CFG::school('school', 'gz_property', $data['inputs']['property'])
									:'';
		$data['gz_admit_batch_name'] = !empty($data['inputs']['batch_id'])?
									\CFG::school('school', 'gz_admit_batch', $data['inputs']['batch_id'])
									:'';
		$data['gz_admit_range_name'] = !empty($data['inputs']['range_id'])?
									\CFG::school('school', 'gz_admit_range', $data['inputs']['range_id'])
									:'';
		$data['cate_name'] = !empty($data['inputs']['cate'])?
									\CFG::school('cate', 'gz_cate', $data['inputs']['cate'])
									:'';
		return $this->textRender($tpl, $data);
	}
	
}