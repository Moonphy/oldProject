<?php
use ORM\Huodong\Weixin\Bestvoice\User as ORM;


class Api_Huodong_Bestvoice_UserModel extends Api_BaseModel {
	public function __construct() {
		$this->setORM(new ORM());
	}
}