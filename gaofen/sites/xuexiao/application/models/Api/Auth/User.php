<?php
use ORM\Auth\User as ORM;

class Api_Auth_UserModel extends Api_BaseModel {
	
	public function __construct() {
		$this->setORM(new ORM());
	}
}