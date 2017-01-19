<?php
use ORM\Huodong\Weixin\Bestvoice\Redpack as ORM;


class Api_Huodong_Bestvoice_RedpackModel extends Api_BaseModel {
	public function __construct() {
		$this->setORM(new ORM());
	}
}