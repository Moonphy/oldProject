<?php
use ORM\CZ\Pic as ORM;

class Api_Cz_PicModel extends Api_BaseModel {
	
	public function __construct() {
		$this->setORM(new ORM());
		$this->setSelectResultField(['sort']);
	}
}