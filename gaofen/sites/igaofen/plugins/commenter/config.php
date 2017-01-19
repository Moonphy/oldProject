<?php
/**
 * 定时发布问题/文章
 */


$aws_plugin = [
	'requirements'	=> '20150226',
	'title'			=> '定时评论',
	'version'		=> '1.0',

	'contents'	=>[
		'model'		=> [
			'class_name'=>'plugin_commenter_model',
			'include'=>'plugin_commenter_model.php'
		],
		'setups'	=> [
			//initdb初始化数据库，必须放在第一，否则可能引起各种问题
			[
				'app'		=>'commenter',
				'controller'=>'ajax',
				'include'	=>'setups/initdb.php'
			],

			//js功能注入
			[
				'app'		=>'commenter',
				'controller'=>'init',
				'include'	=>'setups/hack.php'
			],

		],
		'actions'	=>[
			[
				'app'		=>'commenter',
				'controller'=>'crond',
				'action'	=>'autocomment',
				'include'	=>'setups/initdb.php',
				'template'	=>'',
			],
			
			//定时间
			[
				'app'		=>'commenter',
				'controller'=>'crond',
				'action'	=>'autocomment',
				'include'	=>'actions/autocomment.php',
				'template'	=>'',
			],
		],
	]
];