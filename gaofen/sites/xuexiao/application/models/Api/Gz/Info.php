<?php
use ORM\GZ\Info as ORM;

class Api_Gz_InfoModel extends Api_BaseModel {	
	public function __construct() {
		$this->setORM(new ORM());
		$this->setSelectResultField(['sort']);
	}
}