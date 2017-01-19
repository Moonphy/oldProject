<?php
/**
 * 文章/话题功能注入
 */


$aws_plugin = [
	'requirements'	=> '20150226',
	'title'			=> '发布页插件注入',
	'version'		=> '1.0',

	'contents'	=>[
		/*'model'		=> [
			'class_name'=>'',
			'include'=>''
		],*/
		'setups'	=> [
			//加载发布器
			[
				'app'		=>'publish',
				'controller'=>'main',
				'include'	=>'setups/publisher.php'
			],
			[
				'app'		=>'publish',
				'controller'=>'main',
				'include'	=>'setups/gfmj.php'
			],
		],
		
		'actions'	=>[
			/*[
				'app'		=>'publish',
				'controller'=>'main',
				'action'	=>'article',
				'include'	=>'',
				'template'	=>'abc',
			],

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