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

class Teacher extends Base {

	public $__tpls = array(
		//首页
		'teacher.list' => array(
			'title' => "牛师帮",
			'keyword' => '教师列表',
		),

		'teacher.view' => array(
			'title' => "牛师帮",
			'keyword' => "教师详情",
		),

		'teacher.sell' => array(
			'title' => "牛师帮",
			'keyword' => array(
				1=>'试听',
				2=>'约课',
				)
		),

		'user.orderlist' => array(
			'title' => "牛师帮",
			'keyword' => '我的订单'
		),

		'user.setting' => array(
			'title' => "牛师帮",
			'keyword' => '个人设置'
		),

		'user.bind' => array(
			'title' => "牛师帮",
			'keyword' => '绑定卓越教育帐号'
		),

	);	
}