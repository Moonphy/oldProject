<?php

use ORM\Base as ORMBase;

class Api_School_FeedModel
{
    protected $_followORM;

    public function __construct(ORMBase $orm)
    {
        $this->_followORM = $orm;
    }

    /**
     * 关注学校
     * @param  integer $uid 用户id
     * @param  integer $school_id 学校id
     * @return ORM\CZ\Follow 数据库的关注记录
     */
    public function follow($uid, $school_id)
    {
        $data = ['uid' => $uid, 'school_id' => $school_id];

        $follows = $this->_followORM->where($data);

        if (!$follows->count()) {
            $follow = $this->_followORM->create($data);

            return $follow;
        }
    }

    /**
     * 取消关注
     * @param  integer $uid 用户id
     * @param  integer $school_id 学校id
     * @return boolean 成功删除
     */
    public function unfollow($uid, $school_id)
    {
        $data = ['uid' => $uid, 'school_id' => $school_id];

        $follow = $this->_followORM->where($data)->delete($data);

        return $follow;
    }

    /**
     * 返回用户关注的学校id
     * @param  integer $uid $uid 用户id
     * @return array
     */
    public function getFollows($uid)
    {
        $school_ids = $this->_followORM->where(['uid' => $uid])
        ->orderBy('created_at', 'desc')
        ->lists('school_id', 'id');

        return $school_ids;
    }

    public function getZetFollows($uid)
    {
        $school_ids = $this->getFollows($uid);

        $follows = [];
        foreach ($school_ids as $id => $school_id) {
            $follows[] = ['zScore' => $id, 'zMember' => $school_id];
        }

        return $follows;
    }

    /**
     * 获取指定用户收藏学校的对应信息
     *
     * @param int|string $docid
     * @param int|string $uid
     * @param bool $reset
     *
     * @return array|bool
     */
    public function getFollowByUid($school_id, $uid)
    {
        $data = ['school_id' => $school_id, 'uid' => $uid];
        $follow = $this->_followORM->where($data)->first();
        return $follow->toArray();
    }

    /**
     * 获取用户关注学校的动态
     * @param  $school_id 学校id
     * @return array
     */
    public function getFeeds($school_id, $limit = 3)
    {
        return Feed::where('school_id', $school_id)
        ->limit($limit)
        ->get()
        ->toArray();
    }

    /**
     * 发表学校动态
     * @param  array  $feed
     * integer school_id 学校id
     * integer feed_type 动态类型 1招生信息 2 学生生活 3 最新资讯
     * feed_url 新闻url (动态类型为3时必填)
     * feed_title 新闻标题 (动态类型为3时必填)
     * @return ORM\CZ\Feed 数据库的动态数据
     */
    public function postFeed(array $feed)
    {
        $save_data = array_only($feed, ['feed_type', 'feed_url',
                                'feed_title', 'school_id']);

        $feed = Feed::create($save_data);

        return $feed;
    }
}
