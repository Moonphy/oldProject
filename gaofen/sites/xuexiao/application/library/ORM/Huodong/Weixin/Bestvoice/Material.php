<?php
namespace ORM\Huodong\Weixin\Bestvoice;


use Illuminate\Database\Eloquent\SoftDeletingTrait;
use ORM\Base as ORMBase;
use Presenters\ModelPresenterTrait;

class Material extends ORMBase {
    use SoftDeletingTrait;
    use ModelPresenterTrait;

    protected $connection = 'event';
	protected $table = 'bestvoice_material';
    protected $_present = '\Presenters\Huodong\Bestvoice\Material';
	public $timestamps = true;
}
