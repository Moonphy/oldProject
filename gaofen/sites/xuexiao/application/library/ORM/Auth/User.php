<?php
namespace ORM\Auth;
use Illuminate\Database\Eloquent\SoftDeletingTrait;
use ORM\Base as ORMBase;
use Presenters\ModelPresenterTrait;

class User extends ORMBase {
    use SoftDeletingTrait;
    use ModelPresenterTrait;

    protected $connection = 'auth';
	protected $table = 'user';
    //protected $_present = '\Presenters\Auth\User';
	public $timestamps = true;
}
