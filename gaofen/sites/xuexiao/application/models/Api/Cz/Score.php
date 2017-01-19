<?php
use ORM\CZ\Score as ORM;

class Api_Cz_ScoreModel extends Api_BaseModel
{
    public function __construct() {
        $this->setORM(new ORM());
        $this->setSelectResultField(['year']);
    }
}
