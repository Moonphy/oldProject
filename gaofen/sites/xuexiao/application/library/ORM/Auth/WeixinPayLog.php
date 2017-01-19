<?php
namespace ORM\Auth;
use Illuminate\Database\Eloquent\SoftDeletingTrait;
use ORM\Base as ORMBase;
use Presenters\ModelPresenterTrait;

class WeixinPayLog extends ORMBase {
    use SoftDeletingTrait;
    use ModelPresenterTrait;

    protected $connection = 'auth';
	protected $table = 'pay_weixinlog';
    //protected $_present = '\Presenters\Auth\User';
	public $timestamps = true;
}
