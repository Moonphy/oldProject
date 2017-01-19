<?php

$config[] = array(
    'title' => '高分专家',
    'cname' => 'specialist',
    'children'  => array(
        array(
            'id'    => 1100,
            'title' => '方法列表',
            'url'   => 'admin/specialist/topic_list/',
        ),
        array(
            'id'    => 1101,
            'title' => '用户提问列表',
            'url'   => 'admin/specialist/question_list/',
        ),
        array(
            'id'    => 1102,
            'title' => '提现申请列表',
            'url'   => 'admin/specialist/draw_list/',
        ),
        array(
            'id'    => 1103,
            'title' => '方法提示管理',
            'url'   => 'admin/specialist/topic_tips_list/',
        ),
        array(
            'id'    => 1104,
            'title' => '平台订单明细',
            'url'   => 'admin/specialist/terrace_order_list/',
        ),
        array(
            'id'    => 1105,
            'title' => '用户收入明细',
            'url'   => 'admin/specialist/user_income_list/',
        ),
        array(
            'id'    => 1106,
            'title' => '专辑管理',
            'url'   => 'admin/specialist/special_list/',
        ),
    ),
);

$config[] = array(
    'title' => AWS_APP::lang()->_t('神箭手'),
    'cname' => '23',
    'children' => array(
        array(
            'id' => 901,
            'title' => AWS_APP::lang()->_t('问答设置'),
            'url' => 'admin/shenjianshou/question/',
        ),
        array(
            'id' => 902,
            'title' => AWS_APP::lang()->_t('文章设置'),
            'url' => 'admin/shenjianshou/article/',
        ),
        array(
        		'id' => 903,
        		'title' => AWS_APP::lang()->_t('账户绑定'),
        		'url' => 'admin/shenjianshou/account/',
        ),
    ),
);


$config[] = array(
    'title' => '自定义工具',
    'cname' => 'tools',
    'children' => array(
        array(
            'id' => 905,
            'title' => '数据批量导入',
            'url' => 'admin/data_import/',
        ),
    )
);



