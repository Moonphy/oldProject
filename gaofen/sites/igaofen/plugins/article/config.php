<?php
/**
 * 文章/话题功能注入
 */


$aws_plugin = [
	'requirements'	=> '20150226',
	'title'			=> '评论插件注入',
	'version'		=> '1.0',

	'contents'	=>[
		/*'model'		=> [
			'class_name'=>'',
			'include'=>''
		],*/
		'setups'	=> [
			//加载发布器
			[
				'app'		=>'article',
				'controller'=>'main',
				'include'	=>'setups/commenter.php'
			],
			[
				'app'		=>'article',
				'controller'=>'main',
				'include'	=>'setups/gfmj.php'
			],
			[
				'app'		=>'article',
				'controller'=>'main',
				'include'	=>'setups/bbcode.php'
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