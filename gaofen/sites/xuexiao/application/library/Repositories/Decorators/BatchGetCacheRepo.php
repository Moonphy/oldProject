<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/3/18
 * Time: 上午11:04
 */

namespace Repositories\Decorators;


use Illuminate\Database\Eloquent\Collection;
use Repositories\Contracts\Repository;
use Traits\Validator;

/**
 *
 * Class BatchGetCacheRepo
 * @package Cache\Repositories
 *
 * 本类是Api层通过调用getBatch(ids)获取缓存而特殊化的类
 * 本类重写findBy方法
 *
 */
class BatchGetCacheRepo extends BaseCacheRepo implements Repository
{
    use Validator;

    static protected $_rules = [
        'field' => 'required|string',
        'in' => 'required|array'
    ];
    static protected $_messages = [
        'field.required' => '必须提供搜索的字段(field)',
        'field.string' => '字段名(field)必须是字符串',
        'in.required' => '必须提供in',
        'in.array' => 'in必须是数组',
    ];

    /**
     * 根据条件返回一个记录集合
     *
     * @param array $field_ids {
     * @option string field 需要搜索的字段 @required
     * @option array ids 需要搜索的唯一识别符 @required
     *                         }
     * @param array $columns
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function findBy(array $field_ids, array $columns = ['*'])
    {
        $this->validate($field_ids, self::$_rules, self::$_messages);

        $field = $field_ids['field'];
        $orignIds = $field_ids['in'];

        // 根据id检查哪些数据已经在缓存中
        $keys = $this->_getMultiCacheKeys($orignIds, 'entry');

        $cachedEntries = $this->cache->fetch($keys);

        // 排除已经在缓存中的id
        if (!$cachedEntries->isEmpty()) {

            $ids = array_diff($orignIds, $cachedEntries->fetch($field)->toArray());

        } else {

            $ids = $orignIds;
        }


        if ($ids) {

            // 获取数据
            $field_ids['in'] = $ids;

            $entries = $this->repo->findBy($field_ids, $columns);

            if (!$entries->isEmpty()) {

                $entriesIds = $entries->fetch($field)->toArray();

                // 保存到缓存数据
                $keys = $this->_getMultiCacheKeys($entriesIds, 'entry');

                $this->cache->remember($keys, $entries, 30 * 60);

                foreach ($entries as $entry) {

                    $cachedEntries->put($entry->$field, $entry);
                }

                $orderedEntries = new Collection();

                foreach ($orignIds as $id) {

                    $orderedEntries->add($cachedEntries->get($id));
                }

                return $orderedEntries->keyBy($field);
            }

        }

        return $cachedEntries;
    }

    protected function _getMultiCacheKeys(array $ids, $keyType)
    {
        return array_map(function ($id) use ($keyType) {

            $key = $this->getKeysParameters(['type' => $keyType, 'uuid' => $id]);

            return $this->keygen->getCacheKey($key);

        }, $ids);
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
        // TODO: Implement paginate() method.
    }
}