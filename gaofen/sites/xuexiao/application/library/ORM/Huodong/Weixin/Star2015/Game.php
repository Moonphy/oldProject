<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/5/12
 * Time: 下午3:13
 */

namespace ORM\Huodong\Weixin\Star2015;


class Game extends \ORM\Base
{
    protected $connection = 'huodong';
    protected $table = 'star2015_games';
    public $timestamps = true;

    public static function boot()
    {
        parent::boot();

        // 添加游戏记录后,为贺卡增加分数和游戏人数
        static::created(function ($game) {

            $game->card()->increment('score', $game->score);
            $game->card()->increment('friends');

        });
    }

    public function card()
    {
        return $this->belongsTo('ORM\Huodong\Weixin\Star2015\Card', 'sid', 'id');
    }


}