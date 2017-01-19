<?php
use ORM\Huodong\Weixin\Bestvoice\Fav as ORM;


class Api_Huodong_Bestvoice_FavModel extends Api_BaseModel {
	public function __construct() {
		$this->setORM(new ORM());
	}
}