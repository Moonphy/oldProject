<?php
namespace Api\Base\Cz;

use Api\Base\School\Active as Base;

/**
 * 用户动态模型
 */
class Active extends Base
{
    /**
     * 缓存模型
     * @var Api_Cache_Active
     */
    protected $_cache;

    public function __construct(\Api_Cz_ActiveModel $cache)
    {
        $this->_cache = $cache;
    }

}