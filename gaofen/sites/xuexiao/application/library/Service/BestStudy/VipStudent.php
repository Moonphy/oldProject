<?php
namespace Service\BestStudy;

//use BeSimple\SoapClient\SoapClientBuilder;
use \SoapClient;

class VipStudent{

	public static $client = NULL;
	function __construct() {		
	}

	public static function getInstance($wsdl) {
		if(static::$client===NULL) {
			static::$client = new SoapClient($wsdl, static::getOptions());
		}

		return static::$client;
	}

	public static function getOptions() {
		return [
			//'cache_wsdl' => WSDL_CACHE_MEMORY,
		];
	}

}