<?php
namespace Api\Base\Gz;

use Api_Gz_FeedModel;
use Cache\Api as Cache;
use Api\Base\School\Feed as Base;

class Feed extends Base
{

    /**
     * @param Api_ItemModel $model
     */
    public function __construct(Api_Gz_FeedModel $model, Cache $cache, $reset = false)
    {
        $this->_model = $model;

        $this->_reset = $reset;

        $this->_cache = $cache;
    }


    /**
     * 获取指定用户收藏学校的对应信息
     *
     * @param int|string $docid
     * @param int|string $uid
     * @param bool       $reset
     *
     * @return array|bool
     */
    public function getFollowByUid($school_id, $uid, $reset = true)
    {
        $rst = array();
        $rst = $this->cacheCall(
            ['model' => $this->_model, 'func' => 'getFollowByUid'],
            array('school_id' => $school_id, 'uid' => $uid),
            array('kname' => 'user:gzfollow:school:id', 'kvar' => $school_id.':'.$uid),
            $reset
        );
        return $rst;
    }


    protected function _getFollowOpt($uid)
    {
        return $opt = ['kname' => 'gzfollow:school:list', 'kvar' => $uid, 'isSet' => true];
    }
}
