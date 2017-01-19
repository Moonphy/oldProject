<?php

return [
	//微信支付
	'weixin_cfg' => [
		'wx0c00a259e6ec67b5'=> [
			//微学府
			'app_id' 		=> 'wx0c00a259e6ec67b5', 
	        'app_secret'    => 'b7d711b38d40b1c1659440563c9c7a45',
	        'mch_id'		=> '1233846802', //受理商ID，身份标识
	        'mch_key'		=> '6e8981a96114bd38837b594a31394bfd',//商户支付密钥Key
	        'sslcert'	=> '/home/wwwroot/cert/weixin/apiclient_cert.pem',
	        'sslkey'	=> '/home/wwwroot/cert/weixin/apiclient_key.pem',
	    ],
	    'wx66faf207410346e2'=> [
	    //牛师帮
	    	'app_id' 		=> 'wx66faf207410346e2', 
	        'app_secret'    => 'a4a39bd7b4039f2b373d5d2e6d357b58',
	        'mch_id'		=> '1296032201', //受理商ID，身份标识
	        'mch_key'		=> 'd9a880582b530f4c7fe61433736d3257',//商户支付密钥Key
	        'sslcert'	=> '/home/wwwroot/cert/weixin/1296032201/apiclient_cert.pem',
	        'sslkey'	=> '/home/wwwroot/cert/weixin/1296032201/apiclient_key.pem',
	    ],
	    'wxa6c8a2e7d8e3283a'=> [
	    //豆计划
	    	'app_id' 		=> 'wxa6c8a2e7d8e3283a', 
	        'app_secret'    => '4419321d6ce633031fe0d27e5b4a8824',
	        'mch_id'		=> '1269910701', //受理商ID，身份标识
	        'mch_key'		=> 'd9a880582b530f4c7fe61433736d3257',//商户支付密钥Key
	        'sslcert'	=> '/home/wwwroot/cert/weixin/1269910701/apiclient_cert.pem',
	        'sslkey'	=> '/home/wwwroot/cert/weixin/1269910701/apiclient_key.pem',
	    ],

	    //云启迪学生端
	    'wxc3c662b563e68319' => [
	    	'app_id' 		=> 'wxc3c662b563e68319', 
	        'app_secret'    => '8b7febea648c2d747011af7a8415eb82',
	        'mch_id'		=> '', //受理商ID，身份标识
	        'mch_key'		=> '',//商户支付密钥Key
	        'sslcert'	=> '/home/wwwroot/cert/weixin/apiclient_cert.pem',
	        'sslkey'	=> '/home/wwwroot/cert/weixin/apiclient_key.pem',
	    ],
	],

	//默认情况下使用的catid,涉及微信用户表的openid，不能随便修改,如要修改，必须清除user表openid,及更新缓存
	'default_catid'=>168, 

	//订单分类列表
	//结构 catid=>[app_id, catkey] 目标是 weixin_cfg[app_id]
	'cat_list' => [
		//卓越选师-订单支付（正式环境）
		1 => [
			'app_id'=>'wx66faf207410346e2',  //分类对应微信app_id
			'catkey'=>'F5897C62CEA076F2D0106FABA5E3E3CA', //参与订单签名sign生成的盐值key:strtoupper(md5(time()));
			'body' => '卓越课程', //订单tittle
			],
		//卓越选师-打赏（正式环境）
		3 => [
			'app_id'=>'wx66faf207410346e2',  //分类对应微信app_id
			'catkey'=>'6DFE88B3D886CE94C5D7C0536F4B1724', //参与订单签名sign生成的盐值key:strtoupper(md5(time()));
			'body' => '送老师康乃馨', //订单tittle
			],
		168 => [
			'app_id'=>'wx0c00a259e6ec67b5',  //分类对应微信app_id
			'catkey'=>'1B1AAF69535F43AF22135386A630C5A8', //参与订单签名sign生成的盐值key:strtoupper(md5(time()));
			'body' => '微学府', //订单tittle
			],
		169 => [
			'app_id'=>'wxa6c8a2e7d8e3283a',  //分类对应微信app_id
			'catkey'=>'E1969EDB4F62F0619995CACD19C06F9F', //参与订单签名sign生成的盐值key:strtoupper(md5(time()));
			'body' => '豆计划', //订单tittle
			],
		//高分专家
		170 => [
			'app_id'=>'wxa6c8a2e7d8e3283a',  //分类对应微信app_id
			'catkey'=>'18F74746A84CF3F2A5B1517DF5063DF4', //参与订单签名sign生成的盐值key:strtoupper(md5(time()));
			'body' => '高分专家', //订单tittle
			],
		 //卓越选师-订单支付（测试环境）
        201 => [
            'app_id'=>'wx66faf207410346e2',  //分类对应微信app_id
            'catkey'=>'F5897C62CEA076F2D0106FABA5E3E3CA', //参与订单签名sign生成的盐值key:strtoupper(md5(time()));
            'body' => '卓越课程', //订单tittle
            ],
        //卓越问卷调查
        501 => [
			'app_id'=>'wx0c00a259e6ec67b5',  //分类对应微信app_id
			'catkey'=>'1B1AAF69535F43AF22135386A630C5A8', //参与订单签名sign生成的盐值key:strtoupper(md5(time()));
			'body' => '卓越问卷调查', //订单tittle
			],
		//云启迪家长微信端
        502 => [
			'app_id'=>'wxc3c662b563e68319',  //分类对应微信app_id
			'catkey'=>'D068BCDCC6D2E03AFC1406B2EA18ABF7', //参与订单签名sign生成的盐值key:strtoupper(md5(time()));
			'body' => '云启迪', //订单tittle
			],

	],

	'pay_status'=> [
		-1	=>'支付失败',
		1	=>'未支付',
		2	=>'已支付',
	],
		//支付方式
	'pay_type' => [2=>'线下支付',  1=>'微信支付'],

	//支付状态
	'pay_status' => [-1=>'支付失败', 1=>'未支付', 2=>'支付成功'],

	//订单类型 1:试听 2:约课
	'order_type' => [
		1=>[ //catid
			1=>'试听', 2=>'约课'
		],

	],

	//订单状态 -1:取消 1:未处理 2:处理中 3:订单完成
	'order_status' => [-1=>'取消', 1=>'未处理', 2=>'处理中', 3>'订单完成'],

	'refund_status' =>[-1=>'不能退费', 0=>'没退费请求', 1=>'请求中', 2=>'处理中',3=>'完成'],
];