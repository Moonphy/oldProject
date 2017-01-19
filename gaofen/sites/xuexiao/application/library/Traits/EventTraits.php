<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/7/6
 * Time: 上午11:41
 */

namespace Traits;


trait EventTraits
{
    public function fireEvent($event, $payload = array(), $halt = false)
    {
        return \DIBuilder::make('events')->fire($event, $payload, $halt);
    }

    public function subscribe($event, $subscriber, $priority = 0)
    {
        return \DIBuilder::make('events')->listen($event, $subscriber, $priority);
    }
}