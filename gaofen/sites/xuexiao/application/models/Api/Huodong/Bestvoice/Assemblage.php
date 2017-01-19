<?php
use ORM\Huodong\Weixin\Bestvoice\Assemblage as ORM;


class Api_Huodong_Bestvoice_AssemblageModel extends Api_BaseModel {
	public function __construct() {
		$this->setORM(new ORM());
	}
}