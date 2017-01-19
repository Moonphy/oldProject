<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/5/27
 * Time: 下午3:53
 */

namespace Modules\Cp;

use Carbon\Carbon;
use Repositories\Decorators\BaseDecorator;

class CachePostsAfterWork extends BaseDecorator
{

    /**
     * @return bool
     */
    public function isAfterWork()
    {
        $now = Carbon::now();
        $startToWork = new Carbon('today 9 am');
        $endOfWork = new Carbon('today 6:30 pm');

        return !($now->gt($startToWork) && $now->lt($endOfWork));
    }

    /**
     * @return \Repositories\Decorators\BaseCacheRepo
     */
    protected function _getCacheRepo()
    {
        $entry = new \ORM\Cp\Post();
        $keygen = new \Cache\CacheKeyGenerator();
        $cache = \DIBuilder::make('Cache\Stores\StringStore');
        $cacheRepo = new \Cache\Repositories\CacheRepo($cache, $keygen);

        return new \Repositories\Decorators\BaseCacheRepo($entry, $this->repo, $cacheRepo, $keygen, 3600 * 15);
    }

    public function find($uuid, array $columns = ['*'])
    {
        $repo = $this->isAfterWork() ? $this->_getCacheRepo() : $this->repo;

        return $repo->find($uuid, $columns);
    }

    public function paginate($page = 1, $limit = 20, array $conditions, array $columns = ['*'])
    {
        $repo = $this->isAfterWork() ? $this->_getCacheRepo() : $this->repo;

        return $repo->paginate($page, $limit, $conditions, $conditions);
    }

}