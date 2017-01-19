<?php
use ORM\CZ\Schedule as ORM;

class Api_Cz_ScheduleModel extends Api_BaseModel {
	
	public function __construct() {
		$this->setORM(new ORM());
	}
}