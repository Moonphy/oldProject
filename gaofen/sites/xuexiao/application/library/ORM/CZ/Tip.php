<?php
namespace ORM\CZ;
use Presenters\ModelPresenterTrait;

class Tip extends \ORM\Base
{
    use ModelPresenterTrait;

    protected $table = 'cz_tips';
    protected $_present = '\Presenters\CZ\Tip';

    public $timestamps = true;

    public function getDates()
    {
        return array('updated_at', 'created_at', 'shared_at');
    }
}