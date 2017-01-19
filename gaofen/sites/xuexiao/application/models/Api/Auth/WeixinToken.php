<?php
use ORM\Auth\WeixinToken as ORM;


class Api_Auth_WeixinTokenModel extends Api_BaseModel {
	
	public function __construct() {
		$this->setORM(new ORM());
	}
}