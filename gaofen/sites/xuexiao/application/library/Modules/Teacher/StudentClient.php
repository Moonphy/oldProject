<?php

namespace Modules\Teacher;
use Service\BestStudy\VipStudent;

class StudentClient {
	function __call($name, $args){
		$client = VipStudent::getInstance(\CFG::teacher('wsdl', 'student'));
		return $client->__soapCall($name, $args);
	}

	function client() {
		return VipStudent::getInstance(\CFG::teacher('wsdl', 'student'));
	}
}