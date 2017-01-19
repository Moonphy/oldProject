<?php
namespace Api\Apis;

use Api\OpenApi;

abstract class Base
{
    /**
     * $this->getBase('Tblock');
     *
     * @param mixed $basename
     */
    protected function getBase($basename)
    {
        return OpenApi::apiBase($basename);
    }

    public function __call($name, $args)
    {
        if (isset($this->_base)) {
            return call_user_func_array([$this->_base, $name], $args);
        }
    }
}
