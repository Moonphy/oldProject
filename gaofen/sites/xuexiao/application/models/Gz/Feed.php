<?php
use ORM\GZ\Feed;

class Gz_FeedModel
{
    public function getFeeds($uid)
    {
        $feeds = F::api('/gz/feed/getfeeds', ['uid' => $uid]);

        // return sub_array_to_orm($feeds, 'ORM\CZ\Feed');
        return $feeds;
    }

    public function follow($uid, $school_id)
    {
        return F::api('/gz/feed/follow', ['uid' => $uid, 'school_id' => $school_id]);
    }

    public function unfollow($uid, $school_id)
    {
        return F::api('/gz/feed/unfollow', ['uid' => $uid, 'school_id' => $school_id]);
    }
}
