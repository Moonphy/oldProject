<?php
use ORM\CZ\Admitforte as ORM;

class Api_Cz_AdmitforteModel extends Api_BaseModel {
	
	public function __construct() {
		$this->setORM(new ORM());
		$this->setSelectResultField(['year']);
	}
}