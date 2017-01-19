<?php

return [
	'facepp' =>[
		'api_key'		=>'e128604553c75b2d16c4c5f48eba7d68',
		'api_secret'	=>'GWWz1WGXHE7cGKQOAJUQm6TT8MwNAx10',
	],

    // 168 - 微学府; 169 - 豆计划;
	'default_catid'		=>'168',

    //第五届微课大赛
    'mycourse2015' =>[
        'type'=>2,
        'catid'=>168,
        'begin_date' => '2016-11-09 17:29:00',
        'end_date'  =>'2016-12-09 17:30:00'
    ],

    'ny2016' => [
        'catid' => '169',
        'type' => [4, 6],
    ],

    'staroutlook' => [
        'catid' => '168',
        'type' => 7,
    ],

    'longwen' => [
        'catid' => '168',
        'type'  => 8,
    ],
    
    'xb2016' => [
    	'catid' => '168',
        'type' => 9,
        'taska' => [
            'type' => 10,
        ]
    ],

    'sojump' => [
        'catid' => '168',
    ],

    //家分家长录音
    'vv' => [
        'type'  => 11,
    ],

    'zhongkao' => [
        'type' => 13,
        'catid' => '168'
    ],
    //卓越语文产品录音
    'chinese'=>[
        'type'  => 15,
    ],

    'lectures'=>[
        'catid' => '168'
    ],

    // 每日英语
    'everydayenglish'=>[
        'type' => 16,
        'catid' => '168',
        'begin_date' => '2016-11-21',
        'end_date'  =>'2017-12-19'
    ],
    
    //第六届微课大赛
    'mycourse2016' =>[
        'type'=>17,
        'catid'=>168,
        'begin_date'    => '2016-11-10 09:00:00',
        'end_date' => '2016-12-05 18:00:00'
    ],
    //高分2017月历
    'gaofen2017' =>[
        'type'=>18,
        'catid'=>168,
        'begin_date'    => '2016-01-01',
        'end_date' => '2018-01-01'
    ],
];
