<?php
use ORM\COMMENT\Standard as ORM;


class Api_Comment_StandardModel extends Api_BaseModel {
	public function __construct() {
		$this->setORM(new ORM());
	}
}