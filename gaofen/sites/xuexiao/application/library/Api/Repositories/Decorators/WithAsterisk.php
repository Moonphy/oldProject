<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/4/28
 * Time: 下午2:05
 */

namespace Api\Repositories\Decorators;


use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;
use Traits\AsteriskTrait;

/**
 * Class WithAsterisk
 * @package Api\Repositories\Decorators
 */
class WithAsterisk extends With
{

    /**
     * @var array
     */
    protected $asteriskKeys = [];

    use AsteriskTrait;

    /**
     * 根据唯一标示符返回一条记录
     * @param $uuid          唯一标示符, 譬如id
     * @param array $columns 需要返回的字段
     * @return \Illuminate\Database\Eloquent\Model
     */
    public function find($uuid, array $columns = ['*'])
    {
        $this->recordAsterisk([$this->entry->getKeyName() => $uuid]);

        return parent::find($uuid, $columns);
    }

    /**
     * @param array $paramters
     */
    public function recordAsterisk(array $paramters)
    {
        foreach ($paramters as $key => $value) {

            /**
             * 记录拥有*的键值
             */
            if ($this->isAsterisk($value)) {

                $this->asteriskKeys[$key] = $value;
            }
        }

    }

    /**
     * @param Model $entry
     * @return Model
     */
    protected function getRelation(Model $entry)
    {
        foreach ($this->with as $with) {

            $relation = $entry->$with();

            $columnKey = $this->whichKey($relation);

            $entries = $this->getWith($relation, [$entry->$columnKey], $this->getAdditionalParams($with));

            // 和父类的区别, 不需要按照组id获取
            $entry[$with] = !$entries->isEmpty() ? $entries->flatten() : new Collection();

        }

        return $entry;
    }

    /**
     * 获取关联的父子数据
     * @param Relation $relation
     * @param array $parentIds
     * @param array $additionParams
     * @return static
     */
    protected function getWith(Relation $relation, array $parentIds, array $additionParams = [])
    {
        $orm = $relation->getModel();
        $col = $this->isSubordinate($relation) ? $orm->getKeyName() : $relation->getForeignKey();
        $col = last(explode('.', $col));

        if (isset($this->asteriskKeys[$col])) {

            $additionParams[$col] = $this->asteriskKeys[$col];
        }

        $entries = parent::getWith($relation, $parentIds, $additionParams);

        return $entries;
    }

}