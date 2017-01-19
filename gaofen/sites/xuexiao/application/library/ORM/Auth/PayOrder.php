<?php
namespace ORM\Auth;
use Illuminate\Database\Eloquent\SoftDeletingTrait;
use ORM\Base as ORMBase;
use Presenters\ModelPresenterTrait;

class PayOrder extends ORMBase {
    use SoftDeletingTrait;
    use ModelPresenterTrait;

    protected $connection = 'auth';
	protected $table = 'pay_order';
    protected $_present = '\Presenters\Auth\PayOrder';
	public $timestamps = true;
}
