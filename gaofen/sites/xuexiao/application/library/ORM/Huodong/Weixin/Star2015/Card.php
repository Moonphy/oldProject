<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/5/12
 * Time: 下午3:13
 */

namespace ORM\Huodong\Weixin\Star2015;


class Card extends \ORM\Base
{
    protected $connection = 'huodong';
    protected $table = 'star2015_cards';
    protected $primaryKey = 'id';
    public $timestamps = true;

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($card) {
            // before delete() method call this
            $card->covers()->delete();
            $card->games()->delete();
            $card->shares()->delete();
        });
    }

    public function covers()
    {
        return $this->hasMany('ORM\Huodong\Weixin\Star2015\Cover', 'open_id', 'open_id')->orderBy('created_at', 'desc');
    }

    public function games()
    {
        return $this->hasMany('ORM\Huodong\Weixin\Star2015\Game', 'sid', 'id');
    }

    public function shares()
    {
        return $this->hasMany('ORM\Huodong\Weixin\Star2015\Share', 'sid', 'id');
    }

}