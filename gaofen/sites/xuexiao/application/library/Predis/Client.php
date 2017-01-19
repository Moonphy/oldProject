<?php

namespace Predis;

/**
 * 此类的产生是由于微信公从号API的oauth redis存储必须为predis\client
 */

class Client{

	private $obj = NULL;

	function __construct() {
		$this->obj = new \Redis();
		$ip = \CFG::cache('drivers', 'redis', 'master', 'server');
		$port = \CFG::cache('drivers', 'redis', 'master', 'port');
		$db = \CFG::cache('connections', 'default', 'database');
        $this->obj->connect($ip, $port);
        $this->obj->select($db);
        $this->obj->setOption(\Redis::OPT_SERIALIZER, \Redis::SERIALIZER_PHP);
	}
	
	//尝试用影射，但没成功执行
	public function __call($name, $args) {
		return \F::invoke(array($this->obj, $name), $args);
	}
}