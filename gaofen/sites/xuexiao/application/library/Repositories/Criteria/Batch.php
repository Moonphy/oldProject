<?php
namespace Repositories\Criteria;

use Repositories\Contracts\Repository;
use Repositories\Criterion;

/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/3/19
 * Time: 下午3:46
 */

class Batch extends Criterion
{

    /**
     * @var
     */
    private $attribute;
    /**
     * @var array
     */
    private $values;

    public function __construct($attribute, array $values)
    {
        $this->attribute = $attribute;
        $this->values = $values;
    }

    /**
     * @param Model $orm
     * @param Repository $repository
     * @return mixed
     */
    public function apply($orm, Repository $repository)
    {
        return $orm->whereIn($this->attribute, $this->values);
    }
}