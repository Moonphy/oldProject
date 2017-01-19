<?php
namespace Components;

use F;

class WatchedSchool
{
    /**
     * 已看过id
     * @var array
     */
    protected $_watched_school_ids;

    protected $_watched_cookie_name;


    public function __construct($cookie_name = 'gf_cz_watched_entries')
    {
        $this->_watched_cookie_name = $cookie_name;

        $this->_watched_school_ids = $this->_getWatchedSchoolIds();
    }

    /**
     * 通过cookie获取
     * @return array
     */
    protected function _getWatchedSchoolIds()
    {
        $watched = V('C:'.$this->_watched_cookie_name);

        return $watched ? explode(',', $watched) : [];
    }

    /**
     * 把当前的词条id添加到cookie中的ids的已看过列队中
     * @param integer $school_id 当前浏览的词条id
     */
    public function setWatched($school_id)
    {
        $ids = $this->_watched_school_ids;

        /**
         * 假如school_id已存在于看过的列表中，删除school_id
         * 接下来的步骤会让school_id排到首位
         */
        if(($key = array_search($school_id, $ids)) !== false) {
            unset($ids[$key]);
        }

        array_unshift($ids, $school_id);

        $ids = array_slice($ids, 0, 5);

        $ids = implode(',', $ids);

        F::setCookie($this->_watched_cookie_name, $ids);
    }

    /**
     * 获取看过的学校条目id
     * @return array
     */
    public function getWatched()
    {
        return $ids = $this->_watched_school_ids;
    }
}