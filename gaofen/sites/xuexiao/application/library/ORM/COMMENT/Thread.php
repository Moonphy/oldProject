<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/4/22
 * Time: 下午3:25
 */

namespace ORM\COMMENT;


use Illuminate\Database\Eloquent\SoftDeletingTrait;
use ORM\Base;

class Thread extends Base
{
    protected $connection = 'comment';
    protected $primaryKey = 'project_id';
    public $timestamps = true;

    use SoftDeletingTrait;

    public function comments()
    {
        return $this->hasMany('\ORM\COMMENT\Comment', 'project_id', 'project_id');
    }

}