<?php
namespace Api\Apis\Cz;

use Api\Apis\School\Feed as Base;
use Api\Base\Cz\Feed as FeedBase;
use Api\OpenApi;

/**
 * 学校动态管理api
 */
class Feed extends Base
{
    /**
     * @var FeedBase
     */
    protected $_base;

    public function __construct(FeedBase $feed)
    {
        $this->_base = $feed;
    }

    /**
     * 获取关注
     * @param  array $params
     * uid 用户id required
     * page 页码 optional
     * limit 每页限制 optional
     * @return array
     */
    public function getFollows(\Api\Base\Cz\School $schoolsBase, array $params)
    {
        return parent::getFollows($schoolsBase, $params);
    }
}
