<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/5/7
 * Time: 上午10:33
 */

namespace ORM\CMS;


use ORM\Base;

class Huodong extends Base
{

    public function getExpirationAttribute()
    {
        $expiration = $this->attributes['expiration'];
        return date('Y-m-d H:s:i', $expiration);
    }

    public function getApplynumAttribute()
    {
        return $this->attributes['applynum'] + $this->attributes['cheat_applynum'];
    }

    public function getStartimeAttribute()
    {
        $startime = $this->attributes['startime'];
        return date('m-d H:s', $startime);
    }

    public function getCoverAttribute()
    {
        $cover = $this->attributes['cover'];

        return \F::imageUrl($cover, '160_120', '/attachs/');
    }
}