<?php
namespace Url\Rules;
use \Url\RewriteRules;
use \Url\UrlDataTrait;

class ProductionEnv implements RewriteRules
{
    protected $_parent;

    public function __construct(RewriteRules $parent)
    {
        $this->_parent = $parent;
    }

    public function __get($name)
    {
        return $this->_parent->$name;
    }

    public function getRules()
    {
        return $this->_parent->getRules();
    }

    public function getConditions()
    {
        return $this->_parent->getConditions();
    }

    public function getPatterns()
    {
        $patterns = $this->_parent->getPatterns();
       
        return $patterns;
    }
}
