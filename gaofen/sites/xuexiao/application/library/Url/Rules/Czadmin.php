<?php
namespace Url\Rules;
use \Url\RewriteRules;
use \Url\UrlDataTrait;

class Czadmin implements RewriteRules
{
    use UrlDataTrait;

    protected $_chuzhong = '/chuzhong';

    protected $_rules = [];

    public function __construct($url)
    {
        $this->parseUrl($url);
    }

    public function getRules()
    {

        return [];
    }

    public function getConditions()
    {
        return [];
    }

    public function getPatterns()
    {
        $query = $this->query;
        $path = $this->path;

         $patterns['(/czadmin/.*)'] = array('to' => '/chuzhong$1?{:params:}', 'params' => $this->query);
        return $patterns;
    }
}
