<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/4/22
 * Time: 下午3:26
 */

namespace ORM\COMMENT;


use Api\DecoratorsFactory;
use Illuminate\Database\Eloquent\SoftDeletingTrait;
use ORM\Base;
use Repositories\RelationFrom;

class Comment extends Base
{
    protected $connection = 'comment';
    public $timestamps = true;

    use RelationFrom;
    use SoftDeletingTrait;

    public function relationProvidBy()
    {
        return new \Api\Apis\Comment\Comment(new static, new DecoratorsFactory);
    }

    public static function boot()
    {
        parent::boot();

        static::created(function ($comment) {

            $comment->thread()->increment('total_comments');
        });

        static::deleted(function ($comment) {

            $comment->thread()->decrement('total_comments');
        });
    }

    public function thread()
    {
        return $this->belongsTo('\ORM\COMMENT\Thread', 'project_id', 'project_id');
    }

}