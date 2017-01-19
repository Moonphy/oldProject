<?php
use ORM\GZ\Schedule as ORM;

class Api_Gz_ScheduleModel extends Api_BaseModel {	
	public function __construct() {
		$this->setORM(new ORM());
	}
}