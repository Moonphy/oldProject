<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/5/11
 * Time: 上午9:46
 */

namespace Repositories\Criteria;


use Repositories\Contracts\Repository;
use Repositories\Criterion;

class OrderBy extends Criterion
{
    /**
     * @var
     */
    private $columns;
    /**
     * @var string
     */
    private $order;

    public function __construct($columns, $order = 'asc')
    {
        $this->columns = $columns;
        $this->order = $order;
    }

    /**
     * @param $orm
     * @param Repository $repository
     * @return mixed
     */
    public function apply($orm, Repository $repository)
    {
        if (is_array($this->columns)) {

            foreach ($this->columns as $column) {

                $orm = $orm->orderBy($column['column'], $column['order']);
            }


        } else {

            $orm = $orm->orderBy($this->columns, $this->order);
        }

        return $orm;
    }
}