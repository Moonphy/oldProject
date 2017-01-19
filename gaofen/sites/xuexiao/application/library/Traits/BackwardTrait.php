<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/5/5
 * Time: 下午3:49
 */

namespace Traits;


trait BackwardTrait 
{
    protected function backwardLink($url, $query)
    {
        $referer = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : null;

        $currentHost = $_SERVER['HTTP_HOST'];

        if ($referer && parse_url($referer, PHP_URL_HOST) == $currentHost) {

            return 'javascript:history.go(-1)';
        }

        return \F::URL($url, $query);
    }
}