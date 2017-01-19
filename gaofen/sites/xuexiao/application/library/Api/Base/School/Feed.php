<?php
namespace Api\Base\School;

use Api_Cz_FeedModel;
use Cache\Api as Cache;
use Api\Base\Base as Base;

abstract class Feed extends Base
{
    /**
     * @var Api_ItemModel|Api_Cz_FeedModel
     */
    protected $_model;

    /**
     * @var Cache
     */
    protected $_cache;

    /**
     * @var array
     */
    protected $_rules = [

        'school_id' => 'required|exists:cz_school,id',
        'uid' => 'required',
    ];

    /**
     * @var array
     */
    protected $_messages = [

        'school_id.required' => '缺少学校id',
        'uid' => '缺少用户id',
        'school_id.exists' => '学校不存在',

    ];

    /**
     * @param Api_ItemModel|Api_Cz_FeedModel $model
     * @param Cache $cache
     * @param bool $reset
     */
    public function __construct(Api_Cz_FeedModel $model, Cache $cache, $reset = false)
    {
        $this->_model = $model;

        $this->_reset = $reset;

        $this->_cache = $cache;
    }

    public function follow(array $params)
    {
        $validator = $this->_validation(
            $params,
            $this->_rules,
            $this->_messages
        );
        extract($params);

        if (($follow = $this->_model->follow($uid, $school_id)) && $this->_isFollowKeyExists($uid)) {
            $opt = $this->_getFollowOpt($uid);

            return $this->_cache->zSetPush(
                $opt['kname'], $opt['kvar'],
                ['zMember' => $school_id, 'zScore' => $follow->id]
            );
        }
    }

    public function unfollow(array $params)
    {
        $validator = $this->_validation(
            $params,
            $this->_rules,
            $this->_messages
        );

        extract($params);

        if ($this->_model->unfollow($uid, $school_id) && $this->_isFollowKeyExists($uid)) {
            $opt = $this->_getFollowOpt($uid);

            return $this->_cache->zSetDel($opt['kname'], $opt['kvar'], $school_id);
        }
    }

    public function getFollows(array $params)
    {
        $validator = $this->_validation(
            $params,
            ['uid' => 'required'],
            $this->_messages
        );

        extract($params);

        return $school_ids = $this->_getFollowIds($uid);
    }

    /**
     * @param array $params
     * @return bool
     */
    public function isFollow(array $params)
    {
        $this->_validation(
            $params,
            $this->_rules,
            $this->_messages
        );

        if (isset($params['uid']) && $params['uid']) {
            extract($params);

            $school_ids = $this->_getFollowIds($uid);

            return in_array($school_id, $school_ids);
        }
    }

    /**
     * 获取指定用户收藏学校的对应信息
     *
     * @param $school_id
     * @param int|string $uid
     * @param bool $reset
     * @return array|bool
     */
    abstract public function getFollowByUid($school_id, $uid, $reset = true);


    /**
     * 发表动态
     *
     * @param  array $params
     */
    public function postFeeds(array $params)
    {
        $rules = array_only($this->_rules, ['cz_school_id']);

        $rules = [
            'content' => 'required',
            'feed_type' => 'required',
            'feed_url' => 'required_if:feed_type,==,3',
            'feed_title' => 'required_if:feed_type,==,3',
        ];

        $messages = [
            'feed_type' => '缺少动态类型',
        ];

        $validator = $this->_validation(
            $params,
            $rules,
            $messages
        );

        $feedopt = ['kname' => 'czfeed:school:list', 'kvar' => $school_id];

        if ($this->_cache->exists($opt)) {
            // $this->_cache->zSetPush($opt, ['zMember' => $school_id, 'zScore' => $follow->id]);
        }
    }

    /**
     * 获取动态
     *
     * @param  array $params
     * @return
     */
    public function getFeeds(array $params)
    {
        $uid = $params['uid'];

        $rules = ['uid' => 'required'];

        $validator = $this->_validation(
            $params,
            $rules,
            $this->_messages
        );

        $opt = ['kname' => 'czfollow:school:list', 'kvar' => $uid, 'isSet' => true];

        // 获取关注的学校ids
        $follow_ids = $this->cacheCall(
            [
                'model' => $this->_model,
                'func' => 'getZetFollows'
            ],
            ['uid' => $uid], $opt
        );
        $feeds = [];
        foreach (array_keys($follow_ids) as $school_id) {
            $feedopt = ['kname' => 'czfeed:school:list', 'kvar' => $school_id];

            $feeds[$school_id]['feed'] = $this->cacheCall(
                ['model' => $this->_model, 'func' => 'getFeeds'],
                ['school_id' => $school_id], $feedopt
            );
        }

        return $feeds;
    }

    /**
     * 返回用户所有关注的学校ids
     * @param  integer $uid
     * @return array
     */
    protected function _getFollowIds($uid)
    {
        $opt = $this->_getFollowOpt($uid);

        if ($this->_isFollowKeyExists($uid)) {
            return $this->_cache->zSetGet($opt['kname'], $opt['kvar'], 'DESC');
        }

        // 获取关注的学校ids
        $school_ids = $this->cacheCall(
            [
                'model' => $this->_model,
                'func' => 'getZetFollows'
            ],
            ['uid' => $uid], $this->_getFollowOpt($uid)
        );

        return array_keys($school_ids);
    }

    abstract protected function _getFollowOpt($uid);

    public function _isFollowKeyExists($uid)
    {
        $opt = $this->_getFollowOpt($uid);

        return $this->_cache->exists($opt['kname'], $opt['kvar']);
    }
}
