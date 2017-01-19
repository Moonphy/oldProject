<?php
namespace ORM\Auth;
use Illuminate\Database\Eloquent\SoftDeletingTrait;
use ORM\Base as ORMBase;
use Presenters\ModelPresenterTrait;

class WeixinToken extends ORMBase {
    //use SoftDeletingTrait;
    use ModelPresenterTrait;

    protected $connection = 'auth';
	protected $table = 'weixin_token';
    //protected $_present = '\Presenters\Auth\Weixin';
	public $timestamps = true;
}
