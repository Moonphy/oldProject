<?php
use ORM\Huodong\Weixin\Bestvoice\Payment as ORM;


class Api_Huodong_Bestvoice_PaymentModel extends Api_BaseModel {
	public function __construct() {
		$this->setORM(new ORM());
	}
}