<?php
namespace ORM\Huodong\Weixin\Bestvoice;

//use Illuminate\Database\Eloquent\SoftDeletingTrait;
use ORM\Base as ORMBase;
use Presenters\ModelPresenterTrait;

class Payment extends ORMBase {
    //use SoftDeletingTrait;
    //use ModelPresenterTrait;

    protected $connection = 'event';
	protected $table = 'bestvoice_payment';
    //protected $_present = '\Presenters\Huodong\Bestvoice\Fav';
	public $timestamps = true;
}
