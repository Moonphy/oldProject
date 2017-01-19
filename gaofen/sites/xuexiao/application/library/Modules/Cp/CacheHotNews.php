<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/5/27
 * Time: 下午3:38
 */

namespace Modules\Cp;


use Repositories\Decorators\BaseDecorator;

class CacheHotNews extends BaseDecorator
{
    public function findBy(array $conditions, array $columns = ['*'])
    {
        $entry = new \ORM\Cp\Post();
        $keygen = new \Cache\CacheKeyGenerator();
        $cache = \DIBuilder::make('Cache\Stores\StringStore');
        $cacheRepo = new \Cache\Repositories\CacheRepo($cache, $keygen);
        $repo = new \Repositories\Decorators\BaseCacheRepo($entry, $this->repo, $cacheRepo, $keygen, 3600 * 12);

        return $repo->findBy($conditions, $columns);
    }
}