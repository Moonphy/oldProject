<?php
use Api\OpenApi;

class FeedController extends Yaf_Controller_Abstract
{
    /**
     *
     * @var FeedModel
     */
    protected $_model;

    public function init()
    {
//        $school = new \ORM\CZ\School();
//        $repo = new \Repositories\BatchGetDBRepo($school);
//
//
//        $store = DIBuilder::make('\Cache\Stores\StringStore');
//        $keyGen = DIBuilder::make('\Cache\CacheKeyGenerator');
//
//        $repo = new \Cache\Repositories\BatchGetCacheRepo($school, $repo, new \Cache\Repositories\CacheRepo($store, $keyGen), $keyGen);
//
//        $repo = new \Repositories\Decorators\With($school, $repo, ['scores']);
//        $collection = $repo->findBy(['field' => 'id', 'in' => [1, 70, 81, 63]]);

//        try {
//
//            $repo->find(4);
//        } catch (Exception $excetion)
//        {
//
//        }
//        var_dump($collection->toArray());
    }

    /**
     * 我的关注
     * @param  integer $uid 用户uid
     * @return Yaf_View_Simple
     */
    public function indexAction()
    {
        $follow = new \ORM\CZ\Follow();

        $repo = new \Repositories\BaseDBRepo($follow);
        $repo = new \Repositories\Decorators\With($follow, $repo, ['school']);

//        $results = $repo->findBy([['uid' => Users::uid()]]);
//        $results = $repo->find(8);
//        var_dump($results->toArray());


//        $store = DIBuilder::make('\Cache\Stores\StringStore');
//        $keyGen = DIBuilder::make('\Cache\CacheKeyGenerator');

        return false;
    }


}