<?php

namespace Modules\Teacher;
use Service\BestStudy\VipTeacher;

class TeacherClient {
	function __call($name, $args){
		$client = VipTeacher::getInstance(\CFG::teacher('wsdl', 'teacher'));
		return $client->__soapCall($name, $args);
	}

	function client() {
		return VipTeacher::getInstance(\CFG::teacher('wsdl', 'teacher'));
	}
}