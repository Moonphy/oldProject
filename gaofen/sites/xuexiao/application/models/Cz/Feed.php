<?php
use ORM\CZ\Feed;

class Cz_FeedModel
{
    public function getFeeds($uid)
    {
        $feeds = F::api('/cz/feed/getfeeds', ['uid' => $uid]);

        // return sub_array_to_orm($feeds, 'ORM\CZ\Feed');
        return $feeds;
    }

    public function follow($uid, $school_id)
    {
        return F::api('/cz/feed/follow', ['uid' => $uid, 'school_id' => $school_id]);
    }

    public function unfollow($uid, $school_id)
    {
        return F::api('/cz/feed/unfollow', ['uid' => $uid, 'school_id' => $school_id]);
    }
}
