<?php

/**
 * 各分站api访问的host部，用作拼装远程api地址
 */

return  [
		'develop'   => [
			'cms' => 'http://dev.cms.gaofen.com/api',
			// 'cms'   => 'http://ziliao.gaofen.com/api',
			'sso'   => 'http://dev.login.gaofen.com/api',
			// 'cp'    => 'http://dev.cp.gaofen.com/api.php',
			'cp'    => 'http://cp.dev.gaofen.com/api.php',
			'sphinx' => 'http://dev.sphinx.gaofen.com',
			//'sphinx' => 'http://sphinx.dev.gaofen.com',
			// 'baike' => 'http://dev.baike.gaofen.com/api',
			'baike' => 'http://baike.dev.gaofen.com/api',
			'comment' => 'http://comment.gaofen.com/api',
			'auth'	=> 'http://u.gaofen.com/api',
			'teacher' => 'http://dev.xuexiao.gaofen.com/api',
			'pay'	=> 'http://dev.xuexiao.gaofen.com/api',
			'form'	=> 'http://dev.form.gaofen.com/api',
			'weixin'	=> 'http://dev.wx.gaofen.com',
		],
		'test'      => [
			'cms'   => 'http://ziliao.dev.gaofen.com/api',
			'sso'   => 'http://login.gaofen.com',
			'cp'    => 'http://cp.gaofen.com/api.php',
			'sphinx' => 'http://sphinx.dev.gaofen.com',
			'baike' => 'http://baike.gaofen.com/api',
			'comment' => 'http://comment.dev.gaofen.com/api',
			'auth'	=> 'http://u.gaofen.com/api',
			'teacher' => 'http://teachertest.dev.gaofen.com/api',
			'pay'	=> 'http://u.dev.gaofen.com/api',
			'form'	=> 'http://formdev.dev.gaofen.com/api',
			'weixin'	=> 'http://wx.gaofen.com',
		],
		'product'   => [
			'cms'   => 'http://ziliao.gaofen.com/api',
			'sso'   => 'http://login.gaofen.com',
			'cp'    => 'http://cp.gaofen.com/api.php',
			'sphinx' => 'http://sphinx.gaofen.com',
			'baike' => 'http://baike.gaofen.com/api',
			'comment' => 'http://comment.gaofen.com/api',
			'auth'	=> 'http://u.gaofen.com/api',
			'teacher' => 'http://teacher.gaofen.com/api',
			'pay'	=> 'http://u.gaofen.com/api',
			'form'	=> 'http://form.dev.gaofen.com/api',
			'weixin'	=> 'http://wx.gaofen.com',
		],
	];
