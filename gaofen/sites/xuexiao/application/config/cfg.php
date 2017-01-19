<?php
/**
 * 项目名称:  高分CMS
 * 建立日期:  2013年02月25日
 *
 * 公共配置项
 *
 * @作者 heli <heli@gaofen.com>
 * @版本 $Id:
 **/

date_default_timezone_set('Asia/Chongqing');

define('SERVER_IMAGE_URL',  'http://' . V('s:HTTP_HOST') . '/data/uploads/');

$G_MIMETYPE_CONFIG = array();
//mimetype配置
$G_MIMETYPE_CONFIG = array(
    'doc' => 'application/msword',
    'docx' => 'application/msword',
    'xls' => 'application/vnd.ms-excel',
    'xlsx' => 'application/vnd.ms-excel',
    'ppt' => 'application/vnd.ms-powerpoint',
    'pdf' => 'application/pdf',
    'txt' => 'text/plain',
    'zip' => 'application/zip',
    '7z' => 'application/x-7z-compressed',
);

$GLOBALS['G_MIMETYPE_CONFIG'] = $G_MIMETYPE_CONFIG;

//中学库PC版
define('SEO_XCZ_RANK_TITLE', '广州初中欢迎度排名-高分网初中库');
define('SEO_XCZ_CMP_TITLE', '{sn1}{sn2}{sn3}{sn4}对比哪个好_招生方式、分数线、硬件对比-高分网初中库');
define('SEO_XCZ_PIC_TITLE', '{school_name}图片-高分网初中库');
define('SEO_XCZ_DETAIL_TITLE', '{school_name}招生电话、地址、官网-高分网初中库');
define('SEO_XCZ_INDEX_TITLE', '广州初中大全_广州初中大全-高分网初中库');
define('SEO_XCZ_INDEX_EX_TITLE', '【{district}{property}初中】广州{district}{property}初中有哪些_{district}{property}排行榜-高分网初中库
');
define('SEO_XCZ_INDEX_SEARCH_TITLE', '搜索结果_初中库');
define('SEO_XCZ_VIEW_1_TITLE', '【{school_name}点评】{school_name}好不好、执信中学经验分享-高分');
define('SEO_XCZ_VIEW_2_TITLE', '【{school_name}】{school_name}招生简章_分数线、特长生招生-高分网初中库');
define('SEO_XCZ_VIEW_3_TITLE', '【{school_name}学生生活】{school_name}食宿环境、硬件设施-高分网初中库');
define('SEO_XCZ_VIEW_4_TITLE', '【{school_name}最新资讯】{school_name}最新消息-高分网初中库');
define('SEO_XCZ_VIEW_5_TITLE', '【{school_name}试卷】{school_name}试题、真题、资料-高分网初中库');

define('SEO_XCZ_GUIDE_TITLE', '升学指导-高分网初中库');

//中学库Mobi版
define('SEO_M_XCZ_PIC_TITLE', '{school_name}图片');
define('SEO_M_XCZ_VIEW_TITLE', '{school_name}');
define('SEO_M_XCZ_INDEX_TITLE', '{city}初中大全');
define('SEO_M_XCZ_INDEX_EX_TITLE', '{district}{property}初中大全');
define('SEO_M_XCZ_INDEX_SEARCH_TITLE', '搜素结果页');
define('SEO_M_XCZ_VIEW_4_TITLE', '{school_name}快讯');

// 移动版首页
define('SEO_M_INDEX', '高分网_中小学教育服务平台');

// 资讯列表页
define('SEO_M_XSC_INDEX', date('Y') . '小升初_广州小升初网_广州小升初最新政策_高分网');
define('SEO_M_ZHONGKAO_INDEX', date('Y') . '中考网_中考资源网_备战中考冲刺_高分网');
define('SEO_M_GAOKAO_INDEX', date('Y') . '高考网_高考资源网_高考复习_高分网');

// 资讯详细页
define('SEO_M_XSC_VIEW', '{title}_{catname}_小学_高分网');
define('SEO_M_ZHONGKAO_VIEW', '{title}_{catname}_初中_高分网');
define('SEO_M_GAOKAO_VIEW', '{title}_{catname}_高中_高分网');
