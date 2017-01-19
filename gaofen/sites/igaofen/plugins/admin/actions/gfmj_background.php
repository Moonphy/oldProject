<?php
//初始化插件
$plugins = AWS_APP::plugins()->parse('gfmj', 'background_init', 'setup');
foreach($plugins as $plugin_file) {
	include($plugin_file);
}
