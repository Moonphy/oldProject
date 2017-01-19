<?php
use ORM\GZ\Score as ORM;

class Api_Gz_ScoreModel extends Api_BaseModel {
	public function __construct() {
		$this->setORM(new ORM());
		$this->setSelectResultField(['year']);
	}
}