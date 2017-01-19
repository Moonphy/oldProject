<?php
namespace ORM\GZ;
use Illuminate\Database\Eloquent\SoftDeletingTrait;
use ORM\Base as ORMBase;
use Presenters\ModelPresenterTrait;

class School extends ORMBase {
    use SoftDeletingTrait;
    use ModelPresenterTrait;

	protected $table = 'gz_school';
    protected $_present = '\Presenters\GZ\School';
	public $timestamps = true;
}
