<?php
/**
 * 定时发布问题/文章
 */


$aws_plugin = [
	'requirements'	=> '20150226',
	'title'			=> 'gfmj',
	'version'		=> '1.0',

	'contents'	=>[
		'model'		=> [
			'class_name'=>'plugin_gfmj_model',
			'include'=>'plugin_gfmj_model.php'
		],
		'setups'	=> [
			//initdb初始化数据库，必须放在第一，否则可能引起各种问题
			[
				'app'		=>'gfmj',
				'controller'=>'ajax',
				'include'	=>'setups/initdb.php'
			],

			//前台js功能注入
			[
				'app'		=>'gfmj',
				'controller'=>'foreground_init',
				'include'	=>'setups/foreground_hack.php'
			],
			//后台js功能注入
			[
				'app'		=>'gfmj',
				'controller'=>'background_init',
				'include'	=>'setups/background_hack.php'
			],

		],
		'actions'	=>[
			//定时间
			[
				'app'		=>'crond',
				'controller'=>'',
				'action'	=>'',
				'include'	=>'',
				'template'	=>'',
			]
		],
	]
];