<?php
namespace Presenters;

trait ModelPresenterTrait
{
    protected $_presentInstance;

    public function present()
    {
        if (!isset($this->_present) && !class_exists($this->_present) ) {
            throw new Exception("present now set", 1);
        }

        $this->_presentInstance = $this->_presentInstance ? $this->_presentInstance : new $this->_present($this);
        return $this->_presentInstance;
    }

    public function setPresent($present)
    {
        $this->_presentInstance = null;
        $this->_present = $present;
    }
}