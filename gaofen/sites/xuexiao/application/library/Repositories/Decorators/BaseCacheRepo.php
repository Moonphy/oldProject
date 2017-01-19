<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/3/13
 * Time: 下午3:57
 */

namespace Repositories\Decorators;

use Cache\Contracts\KeyGenerator;
use Illuminate\Database\Eloquent\Model as ORM;
use Repositories\Contracts\Repository as QueryRepository;
use Cache\Contracts\Repository as CacheRepository;

/**
 * Class BaseCacheRepo
 * 基础缓存操作
 * @package Cache\Repository
 */
class BaseCacheRepo implements QueryRepository
{
    /**
     * @var Repository
     */
    protected $repo;
    /**
     * @var \Cache\Contracts\Store
     */
    protected $cache;
    /**
     * @var KeyGenerator
     */
    protected $keygen;
    /**
     * @var ORM
     */
    protected $entry;
    /**
     * @var int
     */
    private $cacheTime = 3600;

    /**
     * @param ORM $entry
     * @param QueryRepository $repo
     * @param CacheRepository $cache
     * @param KeyGenerator $keygen
     */
    public function __construct(
        ORM $entry,
        QueryRepository $repo,
        CacheRepository $cache,
        KeyGenerator $keygen,
        $cacheTime = null
    ) {
        $this->repo = $repo;
        $this->cache = $cache;
        $this->keygen = $keygen;
        $this->entry = $entry;
        $this->cacheTime = $cacheTime ? $cacheTime : $this->cacheTime;
    }

    public function setCacheTime($cacheTime)
    {
        $this->cacheTime = $cacheTime;

        return $this;
    }


    /**
     * 查找所有记录
     * @param array $columns 需要返回的字段
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function all(array $columns = ['*'])
    {
        $key = $this->keygen->getCacheKey($this->getKeysParameters(['all']));

        if ($this->cache->has($key)) {

            return $this->cache->fetch($key);
        }

        $entries = $this->repo->all($columns);
        $this->cache->remember($key, $entries, 10);

        return $entries;
    }

    /**
     * 根据唯一标示符返回一条记录
     * @param $uuid          唯一标示符, 譬如id
     * @param array $columns 需要返回的字段
     * @return \Illuminate\Database\Eloquent\Model
     */
    public function find($uuid, array $columns = ['*'])
    {
        $keyParamters = $this->getKeysParameters(['uuid' => $uuid, 'type' => 'entry']);
        $key = $this->keygen->getCacheKey($keyParamters);

        if ($this->cache->has($key)) {

            return $this->cache->fetch($key);
        }

        $entry = $this->repo->find($uuid, $columns);

        $this->cache->remember($key, $entry, $this->cacheTime);

        return $entry;
    }

    /**
     * 根据条件返回一个记录集合
     * @param array $conditions
     * @param array $columns
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function findBy(array $conditions, array $columns = ['*'])
    {
        $key = $this->keygen->getCacheKey(['type' => 'query'] + $this->getKeysParameters($conditions));

        if ($this->cache->has($key)) {

            return $this->cache->fetch($key);
        }
        $entries = $this->repo->findBy($conditions, $columns);

        $this->cache->remember($key, $entries, $this->cacheTime);

        return $entries;
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
        $keyCondictions = ['page' => $page, 'limit' => $limit] + $conditions;
        $key = $this->keygen->getCacheKey(['type' => 'query'] + $this->getKeysParameters($keyCondictions));

        if ($this->cache->has($key)) {

            return $this->cache->fetch($key);
        }

        $entries = $this->repo->paginate($page, $limit, $conditions, $columns);

        $this->cache->remember($key, $entries, $this->cacheTime);

        return $entries;
    }

    /**
     * 创建一条新记录, 如果创建成功,返回这个对象
     * @param array $data
     * @return \Illuminate\Database\Eloquent\Model|bool
     */
    public function create(array $data)
    {
        $entry = $this->repo->create($data);

        if ($entry) {

            $keyParamters = $this->getKeysParameters(['uuid' => $entry->getKey()]);
            $key = $this->keygen->getCacheKey($keyParamters);

            $this->cache->remember($key, $entry, $this->cacheTime);

            // 清空和这个table有关的query缓存

            // TODO 设置需要清空的key名称
            $query_key = '';
            $this->cache->forget($query_key);
        }

        return $entry;
    }

    /**
     * 更新记录
     * @param array $data
     * @param $uuid
     * @param string $attribute
     */
    public function update(array $data, $uuid, $attribute = 'id')
    {
        $numbers_of_updated = $this->repo->update($data, $uuid, $attribute);

        $key = $this->getKeysParameters(['uuid' => $uuid, 'attribute' => $attribute]);

        // 清空和这个table有关的query缓存

        // TODO 设置需要清空的key名称
        $query_key = '';
        $this->cache->forget($query_key);

        return $numbers_of_updated;
    }

    /**
     * 删除记录
     * @param $uuid
     * @return int
     */
    public function delete($uuid)
    {
        $numbers_of_deleted = $this->repo->delete($uuid);

        if ($numbers_of_deleted) {
            // TODO: 从缓存中删除记录
            $key = $this->keygen->getCacheKey($this->getKeysParameters(['uuid' => $uuid]));

            // TODO 设置需要清空的key名称
            $query_key = '';
            $this->cache->forget($query_key);
        }

        return $numbers_of_deleted;
    }

    /**
     * @param array $addiction
     * @return array
     */
    protected function getKeysParameters(array $addiction = [])
    {
        $parameter = ['table' => $this->entry->getTable()];

        return array_merge($parameter, $addiction);
    }

}