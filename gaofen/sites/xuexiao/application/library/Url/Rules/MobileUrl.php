<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/5/22
 * Time: 上午9:55
 */

namespace Url\Rules;


use Url\RewriteRules;
use Url\UrlDataTrait;

class MobileUrl implements RewriteRules
{
    use UrlDataTrait;

    public function __construct($url)
    {
        $this->parseUrl($url);
    }

    public function getRules()
    {
        return [
            '/mobile/index' => ['to' => '/'],
        ];
    }

    public function getConditions()
    {
        return [
            '/mobile/index' => ['to' => '/', 'params' => []],
        ];
    }

    public function getPatterns()
    {
        return [];
    }
}