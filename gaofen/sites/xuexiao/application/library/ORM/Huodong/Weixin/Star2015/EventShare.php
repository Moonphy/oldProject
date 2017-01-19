<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/5/18
 * Time: 下午4:07
 */

namespace ORM\Huodong\Weixin\Star2015;


class EventShare extends \ORM\Base
{
    protected $connection = 'huodong';
    protected $table = 'gf_event_share';
    protected $primaryKey = 'open_id';

}