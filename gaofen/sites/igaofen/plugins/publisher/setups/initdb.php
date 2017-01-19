<?php

/**
 * 初始化发布器model
 * @var string
 */

/**
 * [$modelName description]
 * @var string
 */
$pluginModelName = 'plugin_publisher_model';
$pluginModelFiles = AWS_APP::plugins()->model();

//加载model
include_once($pluginModelFiles[$pluginModelName]);

$_publisherLockFile = dirname(__FILE__).'/initdb_install_lock.php';
if(!is_file($_publisherLockFile)) {
	//第一次初始化数据库
	$model = AWS_APP::model($pluginModelName);
	if($rs = $model->init_db()) {
		touch($_publisherLockFile);
	}
}