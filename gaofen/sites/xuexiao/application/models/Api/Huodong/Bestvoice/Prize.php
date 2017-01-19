<?php
use ORM\Huodong\Weixin\Bestvoice\Prize as ORM;


class Api_Huodong_Bestvoice_PrizeModel extends Api_BaseModel {
	public function __construct() {
		$this->setORM(new ORM());
	}
}