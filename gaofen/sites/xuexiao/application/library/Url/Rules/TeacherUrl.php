<?php
namespace Url\Rules;
use \Url\RewriteRules;
use \Url\UrlDataTrait;

class TeacherUrl implements RewriteRules
{
    use UrlDataTrait;

    protected $_dir = '/gaozhong';

    protected $_rules = [];

    public function __construct($url)
    {
        $this->parseUrl($url);
        //$this->_dir = \F::inEnv('test') ? '' : $this->_dir;
    }

    public function getRules()
    {
        $query = $this->query;
        $path = $this->path;

        $this->_rules = [];
        return $this->_rules;
    }

    public function getConditions()
    {
        $query = $this->query;
        $path = $this->path;

        $conditions = [];

        return $conditions;
    }

    public function getPatterns()
    {
        return [];
    }
}
