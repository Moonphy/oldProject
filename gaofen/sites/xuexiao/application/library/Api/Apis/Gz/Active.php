<?php
namespace Api\Apis\GZ;

use Api\Base\Gz\Active as ActiveBase;
/**
 *  用户动态API
 */
class Active
{
    /**
     * 验证类
     * @var Validation_ActiveValidator
     */
    protected $_validator;

    protected $_base;

    /**
     * 对象类
     * 对参数赋默认值
     * @var Api_Entries_Active
     */
    protected $_entry;

    public function __construct(ActiveBase $base)
    {
        $this->_base = $base;
    }

    /**
     * 添加动态
     * url /active/setActive
     * @return array 用户动态数组
     * school_id 必填
     * uid 用户id 必填
     * username 用户名 必填
     * type 动态类型 必填
     */
    public function setActive(array $params)
    {
        return $this->_base->setActive($params);
    }

    /**
     * 获取动态
     * url /active/getActive
     * @return array 用户动态数组
     */
    public function getActive(array $params)
    {
       $limit = isset($params['limit']) ? $params['limit'] : 5;
       return array_slice($this->_base->getActive($params), 0, $limit);
    }

    /**
     * 设置用户访问过的学校
     * @param array $params
     * school_id 学校id 必填
     * uid 用户id 必填
     * username 用户名 必填
     */
    public function setVisited(array $params)
    {
        $this->_base->setVisited($params, 'gf_gz_watched_entries');

        $params['type'] = 'visited';
        $this->setActive($params);
    }

    /**
     * 获取用户访问过的学校
     * @param  array  $params
     * uid 用户id 必填
     * @return
     */
    public function getVisited(array $params)
    {
       $limit = isset($params['limit']) ? $params['limit'] : 5;
       return array_slice($this->_base->getVisited($params, 'gf_gz_watched_entries'), 0, $limit);
    }

}
