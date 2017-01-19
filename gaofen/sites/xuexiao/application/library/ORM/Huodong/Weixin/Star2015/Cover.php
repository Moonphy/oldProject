<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/5/12
 * Time: 下午3:12
 */
namespace ORM\Huodong\Weixin\Star2015;

use ORM\Base;

class Cover extends Base
{
    protected $connection = 'huodong';
    protected $table = 'star2015_covers';
    public $timestamps = true;

    public static function boot()
    {
        parent::boot();

        // 添加游戏记录后,为贺卡增加分数和游戏人数
        static::created(function ($game) {

            $game->card()->increment('total_covers');

        });
    }

    public function Card()
    {
        return $this->belongsTo('ORM\Huodong\Weixin\Star2015\Card', 'open_id', 'open_id');
    }

}