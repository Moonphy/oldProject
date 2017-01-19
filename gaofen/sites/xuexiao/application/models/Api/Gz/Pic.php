<?php
use ORM\GZ\Pic as ORM;

class Api_Gz_PicModel extends Api_BaseModel {
	public function __construct() {
		$this->setORM(new ORM());
		$this->setSelectResultField(['sort']);
	}
}