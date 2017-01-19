<?php

namespace Url\Rules;


use Url\RewriteRules;
use Url\UrlDataTrait;

class HuodongMobiUrl implements RewriteRules
{
    use UrlDataTrait;

    public function __construct($url)
    {
        $this->parseUrl($url);
    }

    public function getRules()
    {
        return [
            //'/huodong/events/index' => ['to' => '/huodong/'],
            //'/huodong/events/ajaxhuodong' => ['to' => '/huodong/ajaxhuodong'],
        ];
    }

    public function getConditions()
    {
        return [
            //'/huodong/events/show' => ['to' => '/huodong/show?{:params:}', 'params' => $this->query],
        ];
    }

    public function getPatterns()
    {
        return [];
    }
}