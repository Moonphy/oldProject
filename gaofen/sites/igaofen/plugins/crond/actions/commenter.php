<?php

/**
 * 执行publisher定时任务
 */

$plugins = AWS_APP::plugins()->parse('commenter', 'crond', 'autocomment');
foreach($plugins as $plugin_file) {
	include($plugin_file);
}