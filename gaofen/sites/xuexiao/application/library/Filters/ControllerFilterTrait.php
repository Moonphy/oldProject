<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/6/18
 * Time: 上午10:48
 */

namespace Filters;


trait ControllerFilterTrait
{
    public function filters(array $filters = [], array $options = [])
    {
        $factory = \DIBuilder::make('Filters\Factory');

        $factory->make($filters, $options)->handle($this->_request);
    }

}