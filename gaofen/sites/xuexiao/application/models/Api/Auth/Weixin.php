<?php
use ORM\Auth\Weixin as ORM;


class Api_Auth_WeixinModel extends Api_BaseModel {
	
	public function __construct() {
		$this->setORM(new ORM());
		$this->setPKField('uid');
	}
}