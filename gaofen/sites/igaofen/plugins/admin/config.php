<?php
/**
 * 文章/话题功能注入
 */


$aws_plugin = [
	'requirements'	=> '20150226',
	'title'			=> '会员管理插件注入',
	'version'		=> '1.0',

	'contents'	=>[
		/*'model'		=> [
			'class_name'=>'',
			'include'=>''
		],*/
		'setups'	=> [
			//加载后台马甲使用
			/*[
				'app'		=>'admin',
				'controller'=>'user',
				'include'	=>'setups/gfmj_background.php'
			],*/
		],
		
		'actions'	=>[
			[
				'app'		=>'admin',
				'controller'=>'user',
				'action'	=>'list',
				'include'	=>'actions/gfmj_background.php',
				'template'	=>'admin/user/list',
			],
			/*
			//定时间
			[
				'app'		=>'crond',
				'controller'=>'',
				'action'	=>'',
				'include'	=>'',
				'template'	=>'',
			]*/
		],
	]
];