<?php
use ORM\GZ\Admitforte as ORM;

class Api_Gz_AdmitforteModel extends Api_BaseModel {	
	public function __construct() {
		$this->setORM(new ORM());
		$this->setSelectResultField(['year']);
	}
}