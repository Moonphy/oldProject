<?php
namespace ORM\Auth;
use Illuminate\Database\Eloquent\SoftDeletingTrait;
use ORM\Base as ORMBase;
use Presenters\ModelPresenterTrait;

class Weixin extends ORMBase {
    use SoftDeletingTrait;
    use ModelPresenterTrait;

    protected $connection = 'auth';
	protected $table = 'weixin';
    //protected $_present = '\Presenters\Auth\Weixin';
	public $timestamps = true;
}
