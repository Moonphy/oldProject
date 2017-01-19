<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/3/19
 * Time: 下午5:32
 */

namespace Api\Repositories\Decorators;


use Repositories\Decorators\BaseDecorator;

/**
 * 仅仅返回field字段中的字段
 * Class Field
 * @package Api\Repositories\Decorators
 */
class Field extends BaseDecorator
{
    /**
     * 查找所有记录
     * @param array $columns 需要返回的字段
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function all(array $columns = ['*'])
    {
        $collections = parent::all($columns);

        return $collections;
    }

    /**
     * 根据唯一标示符返回一条记录
     * @param $uuid          唯一标示符, 譬如id
     * @param array $columns 需要返回的字段
     * @return \Illuminate\Database\Eloquent\Model
     */
    public function find($uuid, array $columns = ['*'])
    {
        $model = parent::find($uuid, $columns);

        if (!$this->isAllColumns($columns)) {

            $data = array_only($model->toArray(), $columns);
            $class = get_class($model);
            $model = new $class($data);
        }

        return $model;
    }

    /**
     * 根据条件返回一个记录集合
     * @param array $conditions
     * @param array $columns
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function findBy(array $conditions, array $columns = ['*'])
    {
        $collections = parent::findBy($conditions, $columns);

        return $collections;
    }

    /**
     * 和findBy一样,不过会带上总记录条数
     * @param int $page
     * @param int $limit
     * @param array $conditions
     * @param array $columns
     * @return mixed
     */
    public function paginate($page = 1, $limit = 1, array $conditions, array $columns = ['*'])
    {
        $collections = parent::paginate($page, $limit, $conditions, $columns);

        return $collections;
    }

    /**
     * @param array $columns
     * @return bool
     */
    public function isAllColumns(array $columns)
    {
        return count($columns) === 1 && $columns[0] === '*';
    }
}