<?php
namespace ORM\COMMENT;


use Illuminate\Database\Eloquent\SoftDeletingTrait;
use ORM\Base as ORMBase;
use Presenters\ModelPresenterTrait;

class Standard extends ORMBase {
    use SoftDeletingTrait;
    use ModelPresenterTrait;

    protected $connection = 'comment';
	protected $table = 'standard_comments';
    protected $_present = '\Presenters\Comment\Standard';
	public $timestamps = true;
}
