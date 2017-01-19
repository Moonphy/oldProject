<?php
use ORM\Auth\PayOrder as ORM;

class Api_Auth_PayOrderModel extends Api_BaseModel {
	public function __construct() {
		$this->setORM(new ORM());
	}
}