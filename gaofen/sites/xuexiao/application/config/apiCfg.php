<?php if (! defined('BASEPATH')) {
    exit('No direct script access allowed');
}
/**
 * 项目名称:  高分CMS
 * 建立日期:  2013年02月25日
 *
 * api 配置
 *
 * @作者 heli <heli@gaofen.com>
 * @版本 $Id:
 **/

//随机刷新最大命中值
define("API_CACHE_MAX_REFRESH_NUM", 200);

// 缓存前缀
define('API_CACHE_PREFIX', 'xx:api:');

//生成栏目页面的队列任务
define('TASK_CAT_IDS', API_CACHE_PREFIX.'task:cat:ids');

//错误故障处理队列
define('ERROR_FAULT_SETS', API_CACHE_PREFIX.'e:f:sets');

//存放已处理的错误故障
define('FIXED_FAULT_SETS', API_CACHE_PREFIX.'f:f:sets');

//存放处理不了的错误故障垃圾箱
define('TRASH_FAULT_SETS', API_CACHE_PREFIX.'t:f:sets');

//需要转换的文档id队列
define('QUEUE_DOCS_IDS', API_CACHE_PREFIX.'q:d:ids');

//表前缀
define('APP_TABLE_PREFIX', 'xuexiao_');


//API 配置
$G_API_CONFIG = array();
$G_API_CONFIG['tblock']['reg']['bk_block'] = array('regType' => 'bk_block');
$G_API_CONFIG['tblock']['reg']['bk_recom'] = array('regType' => 'bk_recom');


$G_CACHE_CONFIG = array();
//缓存适配器
$G_CACHE_CONFIG['cache_adapter'] = 'redis';

//redis服务器配置
//缓存配置修改cache.ini.php
//$G_CACHE_CONFIG['redis_servers'] = array(
//    'master' => array(
//        'servers' => REDIS_SERVER_M, ),
//    'slave' => array(
//        'servers' => REDIS_SERVER_S, ),
//);

//cs服务器配置
//$G_CACHE_CONFIG['cache_servers'] = array(
// 'cs1' => array(
//            'servers'  => REDIS_SERVER_M,
//            'keyPre'    => API_CACHE_PREFIX,
//        ),
//);

// 缓存配置
$G_CACHE_CONFIG['api_cache_cfg'] = array(
    // demo
    'demoVar'            => array('cs' => 'cs1', 't' => 2592000, 'n' => 0),
    'demoList'            => array('cs' => 'cs1', 't' => 2592000, 'n' => 1000),

    //推荐块缓存
    'tbk:r:dtl' => array('cs' => 'cs1', 't' => 604800, 'n' => 0), //单条记录
    'tbk:r:fg' => array('cs' => 'cs1', 't' => 604800, 'n' => 0), //flag与id关系cache
    'tbk:t:lst' => array('cs' => 'cs1', 't' => 86400, 'n' => 5000), //资料block各条件ID

    'entry:id' => ['cs' => 'cs1', 't' => 864000, 'n' => 0], // 词条数据
    'item:id' => ['cs' => 'cs1', 't' => 864000, 'n' => 0], // 词条解释数据
    'entry:watched:id' => ['cs' => 'cs1', 't' => 2592000, 'n' => 0], // 看过当前词条又看过其他的词条

    //学校排行榜
    'rank:cond:list' => ['cs' => 'cs1', 't' => 259200, 'n' => 100], //条件IDS
    'rank:id' => ['cs' => 'cs1', 't' => 86400, 'n' => 0], //单条记录
    'rank:unit:id' => ['cs' => 'cs1', 't' => 777600, 'n' => 0], //单条记录

    //学校扩展信息
    'czinfo:cond:list' => array('cs' => 'cs1', 't' => 259200, 'n' => 5000), //条件IDS
    'czinfo:id' => array('cs' => 'cs1', 't' => 86400, 'n' => 0), //单条记录
    'czinfo:unit:id' => array('cs' => 'cs1', 't' => 777600, 'n' => 0), //单条记录

    //学校图片数据
    'czpic:cond:list' => array('cs' => 'cs1', 't' => 259200, 'n' => 5000), //条件IDS
    'czpic:id' => array('cs' => 'cs1', 't' => 86400, 'n' => 0), //单条记录
    'czpic:unit:id' => array('cs' => 'cs1', 't' => 777600, 'n' => 0), //单条记录

    //学校基础信息
    'czschool:cond:list' => array('cs' => 'cs1', 't' => 259200, 'n' => 5000), //条件IDS
    'czschool:id' => array('cs' => 'cs1', 't' => 86400, 'n' => 0), //单条记录
    'czschool:unit:id' => array('cs' => 'cs1', 't' => 777600, 'n' => 0), //单条记录
    'czschool:unit:id:*' => array('cs' => 'cs1', 't' => 5, 'n' => 0), //单条记录

    //学校统考分数数据
    'czscore:cond:list' => array('cs' => 'cs1', 't' => 259200, 'n' => 5000), //条件IDS
    'czscore:id' => array('cs' => 'cs1', 't' => 86400, 'n' => 0), //单条记录
    'czscore:unit:id' => array('cs' => 'cs1', 't' => 777600, 'n' => 0), //单条记录

    //学校录取特长生数据
    'czAdmitforte:cond:list' => array('cs' => 'cs1', 't' => 259200, 'n' => 5000), //条件IDS
    'czAdmitforte:id' => array('cs' => 'cs1', 't' => 86400, 'n' => 0), //单条记录
    'czAdmitforte:unit:id' => array('cs' => 'cs1', 't' => 777600, 'n' => 0), //单条记录

    //学校普通录取分数线数据
    'czAdmitscore:cond:list' => array('cs' => 'cs1', 't' => 259200, 'n' => 5000), //条件IDS
    'czAdmitscore:id' => array('cs' => 'cs1', 't' => 86400, 'n' => 0), //单条记录
    'czAdmitscore:unit:id' => array('cs' => 'cs1', 't' => 777600, 'n' => 0), //单条记录

    //学校课程时间计划
    'czSchedule:cond:list' => array('cs' => 'cs1', 't' => 259200, 'n' => 5000), //条件IDS
    'czSchedule:id' => array('cs' => 'cs1', 't' => 86400, 'n' => 0), //单条记录
    'czSchedule:unit:id' => array('cs' => 'cs1', 't' => 777600, 'n' => 0), //单条记录

    // 用户浏览过的学校id
    'user:school:visited:list' => ['cs' => 'cs1', 't' => 604800, 'n' => 5000],
    // 用户的动态
    'cz:user:active:list' => ['cs' => 'cs1', 't' => 604800, 'n' => 3],
    // 用户的动态
    'gz:user:active:list' => ['cs' => 'cs1', 't' => 604800, 'n' => 3],

    //用户关注的学校id集合(每个记录是一个学校id)
    'czfollow:school:list' => ['cs' => 'cs1', 't' => 604800, 'n' => 5000],
    'gzfollow:school:list' => ['cs' => 'cs1', 't' => 604800, 'n' => 5000],
    //每间学校的动态列表(每个记录是一个动态)
    'czfeed:school:list' => ['cs' => 'cs1', 't' => 604800, 'n' => 3],
    'user:czfollow:school:id' => ['cs' => 'cs1', 't' => 604800, 'n' => 5000],
    'user:gzfollow:school:id' => ['cs' => 'cs1', 't' => 604800, 'n' => 5000],

    //每间学校的经验列表id(每个记录是一个id)
    'cztip:school:list' => ['cs' => 'cs1', 't' => 604800, 'n' => 5000],
    //每间学校的经验KV
    'cztip:school:id' => ['cs' => 'cs1', 't' => 604800, 'n' => 0],

    //学校扩展信息
    'gzinfo:cond:list' => array('cs' => 'cs1', 't' => 259200, 'n' => 5000), //条件IDS
    'gzinfo:id' => array('cs' => 'cs1', 't' => 86400, 'n' => 0), //单条记录
    'gzinfo:unit:id' => array('cs' => 'cs1', 't' => 777600, 'n' => 0), //单条记录

    //学校图片数据
    'gzpic:cond:list' => array('cs' => 'cs1', 't' => 259200, 'n' => 5000), //条件IDS
    'gzpic:id' => array('cs' => 'cs1', 't' => 86400, 'n' => 0), //单条记录
    'gzpic:unit:id' => array('cs' => 'cs1', 't' => 777600, 'n' => 0), //单条记录

    //学校基础信息
    'gzschool:cond:list' => array('cs' => 'cs1', 't' => 259200, 'n' => 5000), //条件IDS
    'gzschool:id' => array('cs' => 'cs1', 't' => 86400, 'n' => 0), //单条记录
    'gzschool:unit:id' => array('cs' => 'cs1', 't' => 777600, 'n' => 0), //单条记录
    'gzschool:unit:id:*' => array('cs' => 'cs1', 't' => 5, 'n' => 0), //单条记录

    //学校统考分数数据
    'gzscore:cond:list' => array('cs' => 'cs1', 't' => 259200, 'n' => 5000), //条件IDS
    'gzscore:id' => array('cs' => 'cs1', 't' => 86400, 'n' => 0), //单条记录
    'gzscore:unit:id' => array('cs' => 'cs1', 't' => 777600, 'n' => 0), //单条记录

    //学校录取特长生数据
    'gzAdmitforte:cond:list' => array('cs' => 'cs1', 't' => 259200, 'n' => 5000), //条件IDS
    'gzAdmitforte:id' => array('cs' => 'cs1', 't' => 86400, 'n' => 0), //单条记录
    'gzAdmitforte:unit:id' => array('cs' => 'cs1', 't' => 777600, 'n' => 0), //单条记录

    //学校普通录取分数线数据
    'gzAdmitscore:cond:list' => array('cs' => 'cs1', 't' => 259200, 'n' => 5000), //条件IDS
    'gzAdmitscore:id' => array('cs' => 'cs1', 't' => 86400, 'n' => 0), //单条记录
    'gzAdmitscore:unit:id' => array('cs' => 'cs1', 't' => 777600, 'n' => 0), //单条记录

    //学校课程时间计划
    'gzSchedule:cond:list' => array('cs' => 'cs1', 't' => 259200, 'n' => 5000), //条件IDS
    'gzSchedule:id' => array('cs' => 'cs1', 't' => 86400, 'n' => 0), //单条记录
    'gzSchedule:unit:id' => array('cs' => 'cs1', 't' => 777600, 'n' => 0), //单条记录


    //授权用户
    'auth:user:cond:list' => array('cs' => 'cs1', 't' => 86400, 'n' => 5000), //条件IDS
    'auth:user:id' => array('cs' => 'cs1', 't' => 10800, 'n' => 0), //单条记录
    'auth:user:unit:id' => array('cs' => 'cs1', 't' => 86400, 'n' => 0), //单条记录

    'auth:wx:cond:list' => array('cs' => 'cs1', 't' => 86400, 'n' => 5000), //条件IDS
    'auth:wx:id' => array('cs' => 'cs1', 't' => 10800, 'n' => 0), //单条记录
    'auth:wx:unit:id' => array('cs' => 'cs1', 't' => 86400, 'n' => 0), //单条记录

    //授权用户token
    'auth:wxtk:cond:list' => array('cs' => 'cs1', 't' => 86400, 'n' => 5000), //条件IDS
    'auth:wxtk:id' => array('cs' => 'cs1', 't' => 10800, 'n' => 0), //单条记录
    'auth:wxtk:unit:id' => array('cs' => 'cs1', 't' => 86400, 'n' => 0), //单条记录

    //牛师网教师数据缓存
    'tc:cond:list' => array('cs' => 'cs1', 't' => 259200, 'n' => 5000), //条件IDS
    'tc:id' => array('cs' => 'cs1', 't' => 86400, 'n' => 0), //单条记录
    'tc:unit:id' => array('cs' => 'cs1', 't' => 777600, 'n' => 0), //单条记录

    //牛师网教师统计数据缓存
    'tc:stat:cond:list' => array('cs' => 'cs1', 't' => 259200, 'n' => 5000), //条件IDS
    'tc:stat:id' => array('cs' => 'cs1', 't' => 86400, 'n' => 0), //单条记录
    'tc:stat:unit:id' => array('cs' => 'cs1', 't' => 777600, 'n' => 0), //单条记录

    //牛师网订单列表
    'tc:order:cond:list' => array('cs' => 'cs1', 't' => 259200, 'n' => 5000), //条件IDS
    'tc:order:id' => array('cs' => 'cs1', 't' => 86400, 'n' => 0), //单条记录
    'tc:order:unit:id' => array('cs' => 'cs1', 't' => 777600, 'n' => 0), //单条记录

    //牛师网用户数据
    'tc:user:cond:list' => array('cs' => 'cs1', 't' => 259200, 'n' => 5000), //条件IDS
    'tc:user:id' => array('cs' => 'cs1', 't' => 86400, 'n' => 0), //单条记录
    'tc:user:unit:id' => array('cs' => 'cs1', 't' => 777600, 'n' => 0), //单条记录

    //牛师网学生数据
    'tc:stu:cond:list' => array('cs' => 'cs1', 't' => 259200, 'n' => 5000), //条件IDS
    'tc:stu:id' => array('cs' => 'cs1', 't' => 86400, 'n' => 0), //单条记录
    'tc:stu:unit:id' => array('cs' => 'cs1', 't' => 777600, 'n' => 0), //单条记录

    //牛师网订单列表
    'auth:wxpo:cond:list' => array('cs' => 'cs1', 't' => 259200, 'n' => 20000), //条件IDS
    'auth:wxpo:id' => array('cs' => 'cs1', 't' => 86400, 'n' => 0), //单条记录
    'auth:wxpo:unit:id' => array('cs' => 'cs1', 't' => 777600, 'n' => 0), //单条记录

    //牛师网用户数据
    'auth:wxpl:cond:list' => array('cs' => 'cs1', 't' => 259200, 'n' => 5000), //条件IDS
    'auth:wxpl:id' => array('cs' => 'cs1', 't' => 86400, 'n' => 0), //单条记录
    'auth:wxpl:unit:id' => array('cs' => 'cs1', 't' => 777600, 'n' => 0), //单条记录

    //录音投票数据
    'event:bvfav:cond:list' => array('cs' => 'cs1', 't' => 259200, 'n' => 5000), //条件IDS
    'event:bvfav:id' => array('cs' => 'cs1', 't' => 86400, 'n' => 0), //单条记录
    'event:bvfav:unit:id' => array('cs' => 'cs1', 't' => 777600, 'n' => 0), //单条记录

    //素材
    'event:bvmtv:cond:list' => array('cs' => 'cs1', 't' => 259200, 'n' => 5000), //条件IDS
    'event:bvmtv:cond:CR:list' => array('cs' => 'cs1', 't' => 259200, 'n' => 5000), //条件IDS
    'event:bvmtv:score:cond:list' => array('cs' => 'cs1', 't' => 259200, 'n' => 5000), //条件IDS
    'event:bvmtv:score:total:cond:list' => array('cs' => 'cs1', 't' => 259200, 'n' => 5000), //条件IDS
    'event:bvmtv:id' => array('cs' => 'cs1', 't' => 86400, 'n' => 0), //单条记录
    'event:bvmtv:unit:id' => array('cs' => 'cs1', 't' => 777600, 'n' => 0), //单条记录

    //录音用户数据
    'event:bvuser:cond:list' => array('cs' => 'cs1', 't' => 259200, 'n' => 5000), //条件IDS    
    'event:bvuser:id' => array('cs' => 'cs1', 't' => 86400, 'n' => 0), //单条记录
    'event:bvuser:unit:id' => array('cs' => 'cs1', 't' => 777600, 'n' => 0), //单条记录

    //集合数据
    'event:assemblage:list' => array('cs' => 'cs1', 't' => 259200, 'n' => 5000), //条件IDS    
    'event:assemblage:id' => array('cs' => 'cs1', 't' => 86400, 'n' => 0), //单条记录
    'event:assemblage:unit:id' => array('cs' => 'cs1', 't' => 777600, 'n' => 0), //单条记录

    //奖品数据
    'event:prize:list' => array('cs' => 'cs1', 't' => 259200, 'n' => 50000), //条件IDS    
    'event:prize:id' => array('cs' => 'cs1', 't' => 86400, 'n' => 0), //单条记录
    'event:prize:unit:id' => array('cs' => 'cs1', 't' => 777600, 'n' => 0), //单条记录

    //支付
    'event:payment:list' => array('cs' => 'cs1', 't' => 259200, 'n' => 5000), //条件IDS    
    'event:payment:id' => array('cs' => 'cs1', 't' => 86400, 'n' => 0), //单条记录
    'event:payment:unit:id' => array('cs' => 'cs1', 't' => 777600, 'n' => 0), //单条记录

    //红包
    'event:redpack:list' => array('cs' => 'cs1', 't' => 259200, 'n' => 5000), //条件IDS    
    'event:redpack:id' => array('cs' => 'cs1', 't' => 86400, 'n' => 0), //单条记录
    'event:redpack:unit:id' => array('cs' => 'cs1', 't' => 777600, 'n' => 0), //单条记录

    //快捷评价
    'cmt:std:cond:list' => array('cs' => 'cs1', 't' => 259200, 'n' => 100000), //条件IDS    
    'cmt:std:id' => array('cs' => 'cs1', 't' => 86400, 'n' => 0), //单条记录
    'cmt:std:unit:id' => array('cs' => 'cs1', 't' => 777600, 'n' => 0), //单条记录
);


$GLOBALS['G_CACHE_CONFIG'] = $G_CACHE_CONFIG;
$GLOBALS['G_API_CONFIG'] = $G_API_CONFIG;
