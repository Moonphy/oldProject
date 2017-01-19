<?php
namespace Url;

class CommonRules implements RewriteRules
{
    protected $_parent;

    public function __construct(RewriteRules $parent)
    {
        $this->_parent = $parent;
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
        return $this->_parent->getPatterns();
    }
}
