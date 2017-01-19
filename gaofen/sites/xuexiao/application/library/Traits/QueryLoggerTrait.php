<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/5/29
 * Time: 下午1:56
 */

namespace Traits;

trait QueryLoggerTrait
{
    public function log($query, $bindings, $time, $name)
    {
        $data = compact('bindings', 'time', 'name');

        // Format binding data for sql insertion
        foreach ($bindings as $i => $binding) {
            if ($binding instanceof \DateTime) {
                $bindings[$i] = $binding->format('\'Y-m-d H:i:s\'');
            } elseif (is_string($binding)) {
                $bindings[$i] = "'$binding'";
            }
        }

        // Insert bindings into query
        $query = str_replace(array('%', '?'), array('%%', '%s'), $query);
        $query = vsprintf($query, $bindings);

        $logger = \DIBuilder::singleton('Adapters\Log\Logger');

        $logger->debug($query);
    }

}