<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/5/29
 * Time: 上午11:16
 */

namespace Adapters\Mongodb;


use Traits\QueryLoggerTrait;

class Connection extends \Jenssegers\Mongodb\Connection
{
    use QueryLoggerTrait;

    /**
     * Log a query in the connection's query log.
     *
     * @param  string $query
     * @param  array $bindings
     * @param  float|null $time
     * @return void
     */
    public function logQuery($query, $bindings, $time = null)
    {
        parent::logQuery($query, $bindings, $time);
        $this->log($query, $bindings, $time, $this->getName());
    }


}