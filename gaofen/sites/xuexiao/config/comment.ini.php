<?php

return [
	'standard' =>[
		'project'=>[
            'mycourse2015'=>[
                'project_id'        =>'mycourse2015',
                'captcha'           => true, //是否使用验证码
                'referer_host'      => [], //是否referer, 如不检测请置空
                'day_times'         => 1, //每个主题每天限制评论次数
                'begin_time'        => '2016-11-09 17:23:00',
                'end_time'         => '2016-11-30 17:40:00',
                'min_word'          => '10', //最少字数检测
                'verify'            => true, //是否启用审核模式。开启审核模式后，隐藏的评论依然会计入总评数里，只有删除的才不统计

            ],
            'mycourse2016'=>[
                'project_id'        =>'mycourse2016',
                'captcha'           => false, //是否使用验证码
                'referer_host'      => ['m.gaofen.com'], //是否referer, 如不检测请置空
                'day_times'         => 1,
                'begin_time'        => '2016-11-10 09:00:00',
                'end_time'         => '2016-12-05 18:00:00',
                'min_word'          => '10', //最少字数检测
                'verify'            => true, //是否启用审核模式。开启审核模式后，隐藏的评论依然会计入总评数里，只有删除的才不统计
            ],
        ]
	],
];
