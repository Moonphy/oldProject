<?php
namespace ORM\Huodong\Weixin\Bestvoice;


use Illuminate\Database\Eloquent\SoftDeletingTrait;
use ORM\Base as ORMBase;
use Presenters\ModelPresenterTrait;

class User extends ORMBase {
    use SoftDeletingTrait;
    use ModelPresenterTrait;

    protected $connection = 'event';
	protected $table = 'bestvoice_user';
    protected $_present = '\Presenters\Huodong\Bestvoice\User';
	public $timestamps = true;
}
