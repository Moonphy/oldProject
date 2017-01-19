<?php
/**
 * 项目名称:  高分CMS
 * 建立日期:  2013年02月25日
 *
 * 前台入口
 *
 * @作者 heli <heli@gaofen.com>
 * @版本 $Id:
 **/

//////////////////////////////////////////////////////////////////////////
// start profiling
//xhprof_enable(XHPROF_FLAGS_CPU + XHPROF_FLAGS_MEMORY);
/////////////////////////////////////////////////////////////////////////
if(!isset($_SESSION)) {
	session_start();
}

require './vendor/autoload.php';

$yaf_app = new Yaf_Application(CONFIG_PATH . '/app_teacher.ini');
//程序启动
$yaf_app->bootstrap()->run();
// $yaf_app->run();

/////////////////////////////////////////////////////////////////////////////
// stop profiler
//$xhprof_data = xhprof_disable();

//include_once "/home/wwwroot/gaofen/xhprof/xhprof_lib/utils/xhprof_lib.php";
//include_once "/home/wwwroot/gaofen/xhprof/xhprof_lib/utils/xhprof_runs.php";

//$xhprof_runs = new XHProfRuns_Default();
//$run_id = $xhprof_runs->save_run($xhprof_data, "xhprof_gfy");
////////////////////////////////////////////////////////////////////////////
