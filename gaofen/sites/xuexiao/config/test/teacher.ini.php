<?php
return [
	'wsdl'	=> [
		'teacher' => 'http://bizplatformtest.beststudy.net/VIPService/VIPTeacherService.svc?wsdl',
		'student' => 'http://bizplatformtest.beststudy.net/VIPService/VIPStudentService.svc?wsdl',
	],
	
	//年师帮用户登录cookie验证key
	'student_vaild_key' => [
		'cookieName' => 'TTS_UK',
		'cookieSalt' => 'TTS_UK_SALT',
		'session_key' => 'TTS_SESSION_DATA',
	],
];