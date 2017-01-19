<?php

//载入定时发布插件
if($this->user_info['permission']['is_administortar']) {
	//初始化插件
	$plugins = AWS_APP::plugins()->parse('gfmj', 'foreground_init', 'setup');
	foreach($plugins as $plugin_file) {
		include($plugin_file);
	}
}