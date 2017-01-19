<?php
use ORM\Huodong\Weixin\Bestvoice\Material as ORM;

class Api_Huodong_Bestvoice_MaterialModel extends Api_BaseModel {
	public function __construct() {
		$this->setORM(new ORM());
		$this->setSelectResultField(['fav_num', 'fav_num_total']);
	}
}