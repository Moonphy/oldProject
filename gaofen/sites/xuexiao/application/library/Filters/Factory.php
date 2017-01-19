<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/6/18
 * Time: 上午11:19
 */

namespace Filters;

use DI\DI;


/**
 * Class Factory
 * @package Filters
 */
class Factory
{
    /**
     * @var \DI\DI
     */
    private $app;

    /**
     * @param \DI\DI $app
     */
    public function __construct(DI $app)
    {
        $this->app = $app;
    }

    /**
     * @param array $filters
     * @param array $options
     * @return null
     */
    public function make(array $filters = [], array $options = [])
    {
        $lastFilter = null;

        foreach ($filters as $filter) {

            $class = class_exists($filter, false) ? $filter : 'Filters\\' . $filter;

            $lastFilter = $this->app->make($class, ['nextFilter' => $lastFilter]);

            if (isset($options['only'])) {
                $lastFilter->only($options['only']);
            }

            if (isset($options['except'])) {
                $lastFilter->except($options['except']);
            }

        }

        return $lastFilter;
    }

}