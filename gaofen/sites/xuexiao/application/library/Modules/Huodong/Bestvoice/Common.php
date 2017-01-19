<?php
namespace Modules\Huodong\Bestvoice;

use Request;

class Common {
	public static function getCurrentUrl($host='huodong_m') {
		$host = $host ? $host.':':'';
		return \F::URL($host.implode('/', [Request::getModuleName(), Request::getControllerName(), Request::getActionName()]), 
                        array_except($_GET, ['r']));
	}
}
