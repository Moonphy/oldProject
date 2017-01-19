<?php
use ORM\CZ\Admitscore as ORM;

class Api_Cz_AdmitscoreModel extends Api_BaseModel {
	
	public function __construct() {
		$this->setORM(new ORM());
		$this->setSelectResultField(['year']);
	}
}