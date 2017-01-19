<?php
namespace ORM\GZ;

use ORM\Base as ORMBase;
use Presenters\ModelPresenterTrait;

class Admitscore extends ORMBase
{
    use ModelPresenterTrait;

    protected $table = 'gz_admit_score';
    public $timestamps = true;

    protected $_present = '\Presenters\GZ\Admitscore';
}
