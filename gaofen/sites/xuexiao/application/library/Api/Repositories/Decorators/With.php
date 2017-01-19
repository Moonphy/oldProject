<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/3/20
 * Time: 上午10:31
 */

namespace Api\Repositories\Decorators;

use Api\ApiParameterTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Database\Eloquent\Collection;
use Repositories\BaseDBRepo;
use Repositories\Contracts\Repository;
use Repositories\Criteria\Batch;
use Repositories\Decorators\BaseDecorator;
use Repositories\Exceptions\RelationNotFoundException;


/**
 * 代理ORM数据中的关系数据
 * Class With
 * @package Api\Repositories\Decorators
 */
class With extends BaseDecorator
{
    /**
     * @var array
     */
    protected $with;
    /**
     * @var Model
     */
    protected $entry;

    /**
     * @var array
     */
    protected $additionParams = [];

    use ApiParameterTrait;

    /**
     * @param Model $entry
     * @param Repository $repo
     * @param array $with
     * @param array $additionParams
     * @throws RelationNotFoundException
     */
    public function __construct(Model $entry, Repository $repo, array $with, array $additionParams)
    {
        parent::__construct($repo);
        $this->with = $with;
        $this->entry = $entry;

        $this->validateRelation($entry);

        $this->additionParams = $this->getWithParamters($additionParams);
    }

    /**
     * 查找所有记录
     * @param array $columns 需要返回的字段
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function all(array $columns = ['*'])
    {
        $entries = $this->repo->all($columns);

        return $this->getRelations($entries);
    }

    /**
     * @param Collection $collection
     * @return Collection
     */
    protected function getRelations(Collection $collection)
    {
        if ($collection->isEmpty()) {

            return $collection;
        }

        foreach ($this->with as $with) {

            $relation = $collection->first()->$with();

            $columnKey = $this->whichKey($relation);

            $entries = $this->getWith($relation, $collection->fetch($columnKey)->toArray(),
                $this->getAdditionalParams($with));

            $collection->map(function ($entry) use ($with, $entries, $columnKey) {

                $index = $entry->$columnKey;

                $entry[$with] = $entries->has($index) ? new Collection($entries->get($index)) : new Collection();

            });

        }

        return $collection;

    }

    /**
     * @param $with
     * @return array
     */
    protected function getAdditionalParams($with)
    {
        return isset($this->additionParams[$with]) ? $this->additionParams[$with] : [];
    }

    /**
     * @param Relation $relation
     * @return bool
     */
    protected function isSubordinate(Relation $relation)
    {
        return ($relation instanceof BelongsTo) || ($relation instanceof BelongsToMany);
    }

    /**
     * 根据关系判断需要提取的字段名称
     * 如果是has, hasMany 则提取orm中的主键
     * 如果是belongsTo, belongsToMany 则提取外键 xxx_id, 该字段是在ORM中定义的
     * @param Relation $relation
     * @return string
     */
    protected function whichKey(Relation $relation)
    {
        return $columnKey = $this->isSubordinate($relation) ? $relation->getForeignKey() : $this->entry->getKeyName();
    }

    /**
     * @param Relation $relation
     * @return bool
     */
    protected function isMany(Relation $relation)
    {
        return ($relation instanceof HasMany) || ($relation instanceof BelongsToMany);
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

        /*
         * 判断ORM是否继承RelationProvider接口
         *
         * 如果是,则说明可以根据这个接口获取对应的with数据
         */

        $traits = class_uses_recursive(get_class($orm));

        if (in_array('Repositories\RelationFrom', $traits)) {

            $relationRepo = $orm->getRelationFrom();

            /*
             * 获取所需的关联表的ids
             * 方法:可以先通过全文检索, 获取 From where '外键' in (parentsIds) 这段的ids
             * 根据关联表的ids获取对应的关联记录
             */

            $col = $this->isSubordinate($relation) ? $orm->getKeyName() : $relation->getForeignKey();
            $col = last(explode('.', $col));

            $entries = $relationRepo->getRelationEntries($orm->getKeyName(), $col, $parentIds, $additionParams);

        } else {

            $repo = new BaseDBRepo($orm);

            $col = $this->isSubordinate($relation) ? $orm->getKeyName() : $relation->getForeignKey();
            $criterion = new Batch($col, $parentIds);

            $repo->pushCriteria($criterion);

            $entries = $repo->all();

            $col = last(explode('.', $col));
        }

        return $entries = $entries->groupBy($col);
    }

    /**
     * 根据唯一标示符返回一条记录
     * @param $uuid          唯一标示符, 譬如id
     * @param array $columns 需要返回的字段
     * @return \Illuminate\Database\Eloquent\Model
     */
    public function find($uuid, array $columns = ['*'])
    {
        $entry = $this->repo->find($uuid, $columns);

        return $this->getRelation($entry);

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

            $entry[$with] = $entries->has($entry->$columnKey) ? new Collection($entries->get($entry->$columnKey)) : new Collection();

        }

        return $entry;
    }

    /**
     * 根据条件返回一个记录集合
     * @param array $conditions
     * @param array $columns
     * @return \Illuminate\Support\Collection
     */
    public function findBy(array $conditions, array $columns = ['*'])
    {
        $entries = $this->repo->findBy($conditions, $columns);

        return $this->getRelations($entries);
    }

    /**
     * 检查表关系是否已定义
     *
     * @param Model $entry
     * @throws RelationNotFoundException
     */
    protected function validateRelation(Model $entry)
    {
        foreach ($this->with as $with) {

            if (!method_exists($entry, $with)) {

                throw new RelationNotFoundException(get_class($entry) . "没有定义 {$with} 的关系");
            }
        }
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
        $entries = $this->repo->paginate($page, $limit, $conditions, $columns);

        return $this->getRelations($entries);
    }
}