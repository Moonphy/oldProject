<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/5/28
 * Time: 上午11:18
 */

namespace ORM;

use Adapters\Mongodb\MongoConnectionResolver;
use Jenssegers\Mongodb\Model as Eloquent;


class MongoBase extends Eloquent
{
    protected $guarded = ['deleted_at'];

    public $timestamps = false;


    public static function boot()
    {
        parent::boot();
        static::setConnectionResolver(new MongoConnectionResolver());
    }

}