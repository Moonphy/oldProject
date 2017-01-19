<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/5/14
 * Time: 下午2:45
 */

namespace ORM\Huodong\Weixin\Star2015;


use ORM\Base;

class Share extends Base
{
    protected $connection = 'huodong';
    protected $table = 'star2015_shares';
    public $timestamps = true;

    public static function boot()
    {
        parent::boot();

        // 添加游戏记录后,为贺卡增加分数和游戏人数
        static::created(function ($share) {

            $card = $share->card;

            // 制作者的卡片数目
            if ($card->open_id == $share->open_id) {

                $totalCovers = $card->total_covers;

                if ($card->score_left > (40 - ($totalCovers * 8))) {

                    $card->increment('score', 8);
                    $card->decrement('score_left', 8);
                }

            } else {

                // 分享人总共分享了的次数
                $shareTimes = static::where('sid', $card->id)
                    ->where('open_id', $share->open_id)
                    ->count();

                /**
                 * 朋友分享,第只有一次才+8分
                 */
                if ($shareTimes == 1) {

                    $card->increment('score', 8);
                }
            }

            $card->increment('shares');

        });
    }

    public function card()
    {
        return $this->belongsTo('ORM\Huodong\Weixin\Star2015\Card', 'sid', 'id');
    }

}