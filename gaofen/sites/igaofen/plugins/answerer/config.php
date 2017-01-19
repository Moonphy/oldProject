<?php
/**
 * 定时发布问题/文章
 */


$aws_plugin = [
	'requirements'	=> '20150226',
	'title'			=> '定时回复',
	'version'		=> '1.0',

	'contents'	=>[
		'model'		=> [
			'class_name'=>'plugin_answerer_model',
			'include'=>'plugin_answerer_model.php'
		],
		'setups'	=> [
			//initdb初始化数据库，必须放在第一，否则可能引起各种问题
			[
				'app'		=>'answerer',
				'controller'=>'ajax',
				'include'	=>'setups/initdb.php'
			],

			//js功能注入
			[
				'app'		=>'answerer',
				'controller'=>'init',
				'include'	=>'setups/hack.php'
			],

		],
		'actions'	=>[
			[
				'app'		=>'answerer',
				'controller'=>'crond',
				'action'	=>'autoanswer',
				'include'	=>'setups/initdb.php',
				'template'	=>'',
			],
			
			//定时间
			[
				'app'		=>'answerer',
				'controller'=>'crond',
				'action'	=>'autoanswer',
				'include'	=>'actions/autoanswer.php',
				'template'	=>'',
			],
		],
	]
];