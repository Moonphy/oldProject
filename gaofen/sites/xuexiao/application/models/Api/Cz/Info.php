<?php
use ORM\CZ\Info as ORM;

class Api_Cz_InfoModel extends Api_BaseModel {
	
	public function __construct() {
		$this->setORM(new ORM());
		$this->setSelectResultField(['sort']);
	}
}