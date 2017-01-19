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
	        'sslcert'	=> DATA_PATH.'/cert/apiclient_cert.pem',
	        'sslkey'	=> DATA_PATH.'/cert/apiclient_key.pem',
	    ],
	],
];