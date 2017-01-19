<?php
use ORM\GZ\Admitscore as ORM;

use Illuminate\Database\Query\Expression;

class Api_Gz_AdmitscoreModel extends Api_BaseModel
{
    public function __construct() {
        $this->setORM(new ORM());
        $this->setSelectResultField(['year']);
    }
}
