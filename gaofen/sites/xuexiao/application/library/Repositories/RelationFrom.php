<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/3/23
 * Time: 下午2:22
 */

namespace Repositories;

use Repositories\Contracts\RelationProvider;
use Repositories\Exceptions\RelationNotProvidedException;

trait RelationFrom
{
    /**
     * @return RelationProvider
     * @throws RelationNotProvidedException
     */
    public function getRelationFrom()
    {
        $class = get_class($this);

        if (!method_exists($this, 'relationProvidBy')) {

            $message = "{$class}没有定义relationProvidBy方法";
            throw new RelationNotProvidedException($message);
        }

        $provider = $this->relationProvidBy();

        if (!$provider instanceof RelationProvider) {

            $message = "{$class}relationWith方法返回的对象没有实现Repositories\Contracts\RelationProvider接口";
            throw new RelationNotProvidedException($message);
        }

        return $provider;
    }

}