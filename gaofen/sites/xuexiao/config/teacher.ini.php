<?php
return [
	'service'=>['phone'=>'4008809880'],
	//年级
	'grade' => [1=>'一年级','二年级','三年级','四年级','五年级','六年级','七年级','八年级','九年级','高一','高二','高三'],

	//科目
	'subject' => [3=>'语文', 4=>'数学', 5=>'英语', 7=>'物理', 8=>'化学', 6=>'政治', 11=>'生物', 9=>'历史', 10=>'地理', 116=>'学能训练', 117=>'心能辅导'],

	//认正
	'cert'	=> [1=>'身份认证', 2=>'学历认证', 3=>'教师认证'],

	//性别
	'gender' => ['male'=>'男', 'female'=>'女', 'other'=>'不公开'],

	'wsdl'	=> [
		'teacher' => 'http://businessplatform.beststudy.net/VIPService/VIPTeacherService.svc?wsdl',
		'student' => 'http://businessplatform.beststudy.net/VIPService/VIPStudentService.svc?wsdl',
	],

	//订单类型 1:试听 2:约课
	'order_type' => [
		1=>'试听', 2=>'约课',
	],

	//高中
	'school_types' => [
		3 => '小学', 2=>'初中',  1=>'高中'
	],

	//年师帮用户登录cookie验证key
	'student_vaild_key' => [
		'cookieName' => 'TPS_UK',
		'cookieSalt' => 'TPS_UK_SALT',
		'session_key' => 'TPS_SESSION_DATA12',
	],

	//排序方式
	'orderby' => [/*'near'=>'离我最近', */'exp_age'=>'教龄最长', 'star'=>'星级最高', 'order_num'=>'约课量最多', 'fee_desc'=>'价格由高至低
','fee_asc'=>'价格由低至高'],

	'trainingCenter' => array (
					  3 => 
					  array (
					  	'id' => '3',
					    'TrainingCenterName' => '农讲所',
					    'address' => '越秀区中山四路77号（农讲所D出口对面）',
					    'district'=> '3046',
					    'password'=> '739843',
					  ),
					  2 => 
					  array (
					  	'id' => '2',
					    'TrainingCenterName' => '岗顶',
					    'address' => '天河区五山路1号华晟大厦首层、附楼(地铁岗顶站A出口)',
					    'district'=> '3040',
					    'password'=> '902523',
					  ),
					  1 => 
					  array (
					  	'id' => '1',
					    'TrainingCenterName' => '江南大道',
					    'address' => '海珠区江南大道中233号北楼首层(摩登百货旁)(地铁昌岗站C1出口)',
					    'district'=>'3041',
					    'password'=> '396356',
					  ),
					  4 => 
					  array (
					  	'id' => '4',
					    'TrainingCenterName' => '鹭江',
					    'address' => '海珠区新港西路181号中电数码城5层(地铁鹭江站A出口)',
					    'district'=> '3041',
					    'password'=> '158200',
					  ),
					  5 => 
					  array (
					  	'id' => '5',
					    'TrainingCenterName' => '中山七',
					    'address' => '荔湾区中山七路191号美荔心筑3层(地铁陈家祠站C出口)',
					    'district'=> '3045',
					    'password'=> '325631',
					  ),
					  7 => 
					  array (
					  	'id' => '7',
					    'TrainingCenterName' => '机场路',
					    'address' => '白云区机场生活区远景路穗景大厦C座3楼(肯德基或农商银行旁入100米)',
					    'district'=> '3043',
					    'password'=> '465487',
					  ),
					  10 => 
					  array (
					  	'id' => '10',
					    'TrainingCenterName' => '区庄',
					    'address' => '越秀区环市东路450号华信中心3楼(地铁区庄站C出口)',
					    'district'=> '3046',
					    'password'=> '666043',
					  ),
					  6 => 
					  array (
					  	'id' => '6',
					    'TrainingCenterName' => '黄埔',
					    'address' => '黄埔区大沙东6号裕港大厦5层(潮楼斜对面)(地铁大沙地站C出口)',
					    'district'=> '3047',
					    'password'=> '914141',
					  ),
					  9 => 
					  array (
					  	'id' => '9',
					    'TrainingCenterName' => '同和',
					    'address' => '白云区广州大道北1421号圣地大厦(南楼)5层(地铁京溪南方医院站D出口)',
					    'district'=> '3043',
					    'password'=> '740255',
					  ),
					  35 => 
					  array (
					  	'id' => '35',
					    'TrainingCenterName' => '体育中心',
					    'address' => '天河区体育东路140-148号南方证券大厦二层',
					    'district'=> '3040',
					    'password'=> '541760',
					  ),
					  37 => 
					  array (
					  	'id' => '37',
					    'TrainingCenterName' => '西村',
					    'address' => '荔湾区环市西路34号微八酒店5楼(地铁西村站A出口)',
					    'district'=> '3045',
					    'password'=> '774807',
					  ),
					  8 => 
					  array (
					  	'id' => '8',
					    'TrainingCenterName' => '市桥',
					    'address' => '番禺区市桥大北路105号凯美大厦5楼(番禺宾馆正对面)',
					    'district'=> '3042',
					    'password'=> '181793',
					  ),
					  20 => 
					  array (
					  	'id' => '20',
					    'TrainingCenterName' => '龙珠',
					    'address' => '花都区新华街龙珠路11号1-4层(红菊花旁、银菊花北门对面)',
					    'district'=> '3044',
					    'password'=> '536267',
					  ),
					  13 => 
					  array (
					  	'id' => '13',
					    'TrainingCenterName' => '云山大道',
					    'address' => '花都区新华街公园前路35-5号二楼全层(华润万家旁)',
					    'district'=> '3044',
					    'password'=> '314865',
					  ),
					  38 => 
					  array (
					  	'id' => '38',
					    'TrainingCenterName' => '洛溪',
					    'address' => '番禺区洛溪新城如意中心15号首层(地铁洛溪站A出口)',
					    'district'=> '3042',
					    'password'=> '198080',
					  ),
					  50 => 
					  array (
					  	'id' => '50',
					    'TrainingCenterName' => '新塘',
					    'address' => '新塘镇新塘大道中28号（家家乐电器旁） ',
					    'district'=>'3039',
					    'password'=> '806063',
					  ),
					  51 => 
					  array (
					  	'id' => '51',
					    'TrainingCenterName' => '荔城富鹏',
					    'address' => '增城荔城沙园中路1号中泰写字楼三楼(林业局对面)',
					    'district'=> '3039',
					    'password'=> '414950',
					  ),
					  49 => 
					  array (
					  	'id' => '49',
					    'TrainingCenterName' => '宝岗',
					    'address' => '海珠区宝岗大道可逸南街4至20号首层',
					    'district'=> '3041',
					    'password'=> '122933',
					  ),
					  59 => 
					  array (
					  	'id' => '59',
					    'TrainingCenterName' => '丽影',
					    'address' => '海珠区新港中路356号之八丽影广场A区3楼(地铁客村站D出口)',
					    'district'=> '3041',
					    'password'=> '945590',
					  ),
					  44 => 
					  array (
					  	'id' => '44',
					    'TrainingCenterName' => '汇侨',
					    'address' => '白云区新市镇汇侨路8号',
					    'district'=> '3043',
					    'password'=> '736190',
					  ),
					  56 => 
					  array (
					  	'id' => '56',
					    'TrainingCenterName' => '五羊新城',
					    'address' => '越秀区寺右新马路25号大院2号兴城大厦4楼(华润万家对面)(地铁五羊邨站D出口)',
					    'district'=> '3046',
					    'password'=> '443487',
					  ),
					  57 => 
					  array (
					  	'id' => '57',
					    'TrainingCenterName' => '沙园',
					    'address' => '海珠区工业大道北97号之一201号卓越教育(地铁沙园站D出口)',
					    'district'=> '3041',
					    'password'=> '469799',
					  ),
					  62 => 
					  array (
					  	'id' => '62',
					    'TrainingCenterName' => '东山口',
					    'address' => '越秀区农林下路9号新富熊大厦首层(好又多对面)(地铁东山口站C出口)',
					    'district'=> '3046',
					    'password'=> '739761',
					  ),
					  61 => 
					  array (
					  	'id' => '61',
					    'TrainingCenterName' => '小北',
					    'address' => '越秀区环市中路304号东侧原中湾酒店1层(地铁小北站A出口)',
					    'district'=> '3046',
					    'password'=> '552828',
					  ),
					  65 => 
					  array (
					  	'id' => '65',
					    'TrainingCenterName' => '车陂',
					    'address' => '天河区中山大道87号车陂苏宁生活广场3楼(地铁车陂站D出口)',
					    'district'=> '3040',
					    'password'=> '986184',
					  ),
					  67 => 
					  array (
					  	'id' => '67',
					    'TrainingCenterName' => '芳村',
					    'address' => '荔湾区陆居路9号汇生商务园3楼(芳宫羽毛球馆正对面)(地铁芳村站B2出口)',
					    'district'=> '3045',
					    'password'=> '693701',
					  ),
					  60 => 
					  array (
					  	'id' => '60',
					    'TrainingCenterName' => '心理科',
					    'address' => '',
					    'district'=> '',
					    'password'=> '722457',
					  ),
					  12 => 
					  array (
					  	'id' => '12',
					    'TrainingCenterName' => '个辅教研处',
					    'address' => '',
					    'district'=> '',
					    'password'=> '710208',
					  ),
					  70 => 
					  array (
					  	'id' => '70',
					    'TrainingCenterName' => '市二宫',
					    'address' => '海珠区江南大道中80号创展自由港(原新疆证券大厦)1楼(广发银行旁边)(地铁市二宫站E出口)',
					    'district'=> '3041',
					    'password'=> '290612',
					  ),
					  73 => 
					  array (
					  	'id' => '73',
					    'TrainingCenterName' => '金沙洲',
					    'address' => '白云区建设大道北金沙湾财富广场三楼(白沙中海金沙湾总站正对面)',
					    'district'=> '3043',
					    'password'=> '471255',
					  ),
					  74 => 
					  array (
					  	'id' => '74',
					    'TrainingCenterName' => '人和',
					    'address' => '白云区人和大马路1号丰兴大厦三楼(地铁人和站C2出口)',
					    'district'=> '3043',
					    'password'=> '155892',
					  ),
					  76 => 
					  array (
					  	'id' => '76',
					    'TrainingCenterName' => '祈福',
					    'address' => '番禺区钟村一村星梦芳华商务酒店五楼(钟福广场对面）',
					    'district'=> '3042',
					    'password'=> '896316',
					  ),
					  80 => 
					  array (
					  	'id' => '80',
					    'TrainingCenterName' => '花都共用',
					    'address' => '',
					    'district'=> '3044',
					    'password'=> '119390',
					  ),
					  90 => 
					  array (
					  	'id' => '90',
					    'TrainingCenterName' => '锦东',
					    'address' => '花都新华街紫薇路锦东花园B区203-2号（骏威小学旁）',
					    'district'=> '3044',
					    'password'=> '584689',
					  ),
					),

	//微信APPKEY
	'weixin_cfg' => [
		'app_id' 	=> 'wx0c00a259e6ec67b5',
        'app_secret'=> 'b7d711b38d40b1c1659440563c9c7a45',
        'mch_id'	=>'1233846802',  //分类对应微信支付帐号
	],

	//牛师帮订单类别信息
	'catinfo' =>[
		'catid'		=> '1', //订单类别
		'catkey'	=> 'F5897C62CEA076F2D0106FABA5E3E3CA', //参与订单连接sign的生成
	],

	//location
	'location' => [
		'province' => [
			19 => [
				'name' => '广东省',
				'city' => [
					80 => [
						'name' => '广州市',
						'district' => [
							3046 =>'越秀区'/*, 3045 =>'荔湾区', 3041 =>'海珠区',
							3040 =>'天河区', 3043 =>'白云区', 3047 =>'黄埔区',
							3042 =>'番禺区', 3036 =>'萝岗区', 3037 =>'南沙区',
							3044 =>'花都区', 3039 =>'增城区', 3038 =>'从化区',*/
						]
					],
					/*
					83 => [
						'name' => '佛山市',
						'district' => [
							3078 =>'高明区', 3077 =>'顺德区', 3076 =>'禅城区',
							3046 =>'南海区', 3074 =>'三水区',

						],
					],

					81 = [
						'name' => '东莞市',
						'district' => [
							3144 =>'东莞市区',

						]
					],
					
					82 => [
						'name' => '珠海市',
						'district' => [
							3066 =>'香洲区', 3065 =>'金湾区', 3064 =>'斗门区',

						]
					],
					89 => [
						'name' => '江门市',
						'district' => [
							3085 =>'鹤山市', 3084 =>'蓬江区', 3083 =>'江海区',
							3082 =>'新会区', 3081 =>'恩平市', 3080 =>'开平市',
							3079 =>'台山市',
						]
					],
					88 = [
						'name' => '中山市',
						'district' => [
							3046 =>'越秀区',

						]
					],*/
				]
			]

		],
	],

	
];