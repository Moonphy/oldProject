<?php
/**
 * 定时发布问题/文章
 */


$aws_plugin = [
	'requirements'	=> '20150226',
	'title'			=> '定时发布问题/文章',
	'version'		=> '1.0',

	'contents'	=>[
		'model'		=> [
			'class_name'=>'plugin_publisher_model',
			'include'=>'plugin_publisher_model.php'
		],
		'setups'	=> [
			//initdb初始化数据库，必须放在第一，否则可能引起各种问题
			[
				'app'		=>'publisher',
				'controller'=>'ajax',
				'include'	=>'setups/initdb.php'
			],

			//js功能注入
			[
				'app'		=>'publisher',
				'controller'=>'init',
				'include'	=>'setups/hack.php'
			],

		],
		'actions'	=>[
			[
				'app'		=>'publisher',
				'controller'=>'crond',
				'action'	=>'autopublish',
				'include'	=>'setups/initdb.php',
				'template'	=>'',
			],
			
			//定时间
			[
				'app'		=>'publisher',
				'controller'=>'crond',
				'action'	=>'autopublish',
				'include'	=>'actions/autopublish.php',
				'template'	=>'',
			],
		],
	]
];