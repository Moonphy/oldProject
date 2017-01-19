<?php
/**
 * 定时任务配置
 */


$aws_plugin = [
	'requirements'	=> '20150226',
	'title'			=> '定时任务',
	'version'		=> '1.0',

	'contents'	=>[	
		'actions'	=>[
			//定时间
			[
				'app'		=>'crond',
				'controller'=>'main',
				'action'	=>'half_minute',
				'include'	=>'actions/publisher.php',
				'template'	=>'',
			],
			[
				'app'		=>'crond',
				'controller'=>'main',
				'action'	=>'half_minute',
				'include'	=>'actions/answerer.php',
				'template'	=>'',
			],
			[
				'app'		=>'crond',
				'controller'=>'main',
				'action'	=>'half_minute',
				'include'	=>'actions/commenter.php',
				'template'	=>'',
			]
		],
	]
];