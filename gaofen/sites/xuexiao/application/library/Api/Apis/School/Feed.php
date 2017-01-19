<?php
namespace Api\Apis\School;

use Api\Apis\Base as Base;
use Api\OpenApi;

/**
 * 学校动态管理api
 */
abstract class Feed extends Base
{
    /**
     * @var FeedBase
     */
    protected $_base;

    /**
     * 关注学校
     * uid 用户id required
     * school_id 学校id required
     *
     * @return
     */
    public function follow(array $params)
    {
        return $this->_base->follow($params);
    }

    /**
     * 取消关注
     * uid 用户id required
     * school_id 学校id required
     *
     * @return
     */
    public function unfollow(array $params)
    {
        return $this->_base->unfollow($params);
    }

    /**
     * 是否关注
     * @param  array $params
     * uid 用户id required
     * school_id 学校id required
     * @return boolean
     */
    public function isFollow(array $params)
    {
        return $this->_base->isFollow($params);
    }

    /**
     * 获取关注
     * @param Api\Base\Gz|Cz\School
     * @param  array $params
     * uid 用户id required
     * page 页码 optional
     * limit 每页限制 optional
     * only_id 只返回id
     * @return array
     */
    public function getFollows($schoolsBase, array $params)
    {
        $page = OpenApi::param($params, 'page', 1);
        $limit = OpenApi::param($params, 'limit', 10);
        $only_id = OpenApi::param($params, 'only_id', false);

        $school_ids = $this->_base->getFollows($params);
        $total = count($school_ids);

        $school_ids = array_slice($school_ids, ($page - 1) * $limit, $limit);

        if ($only_id) {

            return ['total' => $total, 'count' => count($school_ids), 'list' => $school_ids];
        }

        $schools = $schoolsBase->getBatch($school_ids);

        foreach ($schools as $index => $school) {
            $schools[$index]['favInfo'] = $this->_base->getFollowByUid($school['id'], $params['uid']);
        }

        return ['total' => $total, 'count' => count($schools), 'list' => $schools];
    }

}
