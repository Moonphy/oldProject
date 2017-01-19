<?php
namespace Repositories;

use Repositories\Contracts\CriteriaInterface;
use Illuminate\Support\Collection;
use Repositories\Contracts\Repository;
use Illuminate\Database\Eloquent\Model as ORM;

/**
 * Class BaseDBRepo
 */
class BaseDBRepo implements Repository, CriteriaInterface
{
    /**
     * @var ORM
     */
    protected $entry;

    /**
     * @var Collection
     */
    protected $criteria;

    /**
     * @var bool
     */
    protected $skipCriteria = false;

    /**
     * @param ORM $entry
     * @param Collection $collection
     */
    public function __construct(ORM $entry, Collection $collection = null)
    {
        $this->entry = $entry;
        $this->criteria = $collection ? $collection : new Collection();
        $this->resetScope();
    }

    /**
     * 查找所有记录
     * @param array $columns 需要返回的字段
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function all(array $columns = ['*'])
    {
        $this->applyCriteria();

        return $this->entry->get();
    }

    /**
     * 根据唯一标示符返回一条记录
     * 如果找不到,会抛ModelNotFoundException的异常
     *
     * @param $uuid 唯一标示符, 譬如id
     * @param array $columns
     * @return \Illuminate\Database\Eloquent\Collection|null|static
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function find($uuid, array $columns = ['*'])
    {
        $this->applyCriteria();

        return $this->entry->findOrFail($uuid);
    }


    /**
     * 根据条件返回一个记录集合
     * @param array $conditions
     * 'column' => '1',  where column = 1
     * 'column2' => ['>', 1], where column2 > 1
     *
     * @param array $columns
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function findBy(array $conditions, array $columns = ['*'])
    {
        $this->_findByCondiction($conditions);

        return $this->entry->get();
    }

    protected function _findByCondiction(array $conditions)
    {
        $this->applyCriteria();

        foreach ($conditions as $key => $where) {

            if (is_array($where) && count($where) == 2) {

                $this->entry = $this->entry->where($key, $where[0], $where[1]);

            } else {

                $this->entry = $this->entry->where($key, $where);
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
    public function paginate($page = 1, $limit = 1, array $conditions = [], array $columns = ['*'])
    {
        $this->_findByCondiction($conditions);

        return $this->entry->paginate($limit);
    }


    /**
     * 创建一条新记录, 如果创建成功,返回这个对象
     * @param array $data
     * @return \Illuminate\Database\Eloquent\Model|bool
     */
    public function create(array $data)
    {
        if ($entry = $this->entry->create($data)) {

            return $entry;
        }

        return false;
    }

    /**
     * @param array $data
     * @param $uuid
     * @param string $attribute
     */
    public function update(array $data, $uuid, $attribute = 'id')
    {
        $this->applyCriteria();

        return $this->entry->where($attribute, '=', $uuid)->update($data);
    }

    /**
     * @param $uuid
     * @return int
     */
    public function delete($uuid)
    {
        $this->applyCriteria();

        return $this->entry->destroy($uuid);
    }

    /**
     * @return $this
     */
    public function resetScope()
    {
        $this->skipCriteria(false);

        return $this;
    }

    /**
     * @param bool $status
     * @return $this
     */
    public function skipCriteria($status = true)
    {
        $this->skipCriteria = $status;

        // TODO: Implement skipCriteria() method.
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCriteria()
    {
        return $this->criteria;
    }

    /**
     * @param Criterion $criteria
     * @return $this
     */
    public function getByCriteria(Criterion $criteria)
    {
        $this->entry = $criteria->apply($this->entry, $this);

        return $this;
    }

    /**
     * @param Criterion $criteria
     * @return $this
     */
    public function pushCriteria(Criterion $criteria)
    {
        $this->criteria->push($criteria);

        return $this;
    }

    /**
     * @return $this
     */
    public function  applyCriteria()
    {
        if ($this->skipCriteria === true) {
            return $this;
        }

        foreach ($this->getCriteria() as $criteria) {
            if ($criteria instanceof Criterion) {
                $this->entry = $criteria->apply($this->entry, $this);
            }
        }

        return $this;
    }

}
