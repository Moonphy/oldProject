<?php
use ORM\Auth\WeixinPayLog as ORM;

class Api_Auth_WeixinPayLogModel extends Api_BaseModel {
	public function __construct() {
		$this->setORM(new ORM());
	}
}