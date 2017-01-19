<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/3/19
 * Time: 下午3:01
 */

namespace Repositories;

use Repositories\Contracts\Repository;

abstract class Criterion
{

    /**
     * @param $orm
     * @param Repository $repository
     * @return mixed
     */
    public abstract function apply($orm, Repository $repository);
}