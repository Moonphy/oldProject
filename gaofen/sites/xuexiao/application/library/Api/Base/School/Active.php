<?php
namespace Api\Base\School;

use Api\Base\Base as Base;

/**
 * 用户动态模型
 */
abstract class Active extends Base
{
    protected $_visitedRule = [
        'school_id' => 'required',
    ];

    protected $_activeRule = [

        'school_id' => 'required',
        'uid' => 'required|numeric',
        'type' => 'required',
    ];

    /**
     * 添加动态信息
     * @param
     */
    public function setActive(array $params)
    {
        $validator = $this->_validation($params,
                                        $this->_activeRule);

        $list = $this->_cache->getCacheListName($params);
        return $this->_cache->setActive($params, $list, $params['school_id']);
    }

    /**
     * 获取动态信息
     * @return array
     */
    public function getActive(array $params)
    {
        $validator = $this->_validation($params,
                                        array_only($this->_activeRule, ['school_id']));

        $list = $this->_cache->getCacheListName($params);

        $actives = $this->_cache->getActive($list, $params['school_id']);

        $actives = $actives ? $actives : [];

        if ($actives) {

            $actives = $this->_restoreData($actives);

        }

        // 排除当前用户的动态
        if ( isset($params['username']) && $actives) {
            $username = $params['username'];
            $actives = $this->_excludeUser($username, $actives);

        }

        $actives = isset($params['limit']) ? array_slice($actives, 0, $params['limit']) : $actives;

        return $actives;
    }

    public function setVisited(array $params, $cookie_name)
    {
        $validator = $this->_validation($params,
                                        $this->_visitedRule);

        $school_id = $params['school_id'];

        $com = NY('Components\WatchedSchool', ['cookie_name' => $cookie_name]);

        $com->setWatched($school_id);
    }

    public function getVisited(array $params, $cookie_name)
    {
        $com = NY('Components\WatchedSchool', ['cookie_name' => $cookie_name]);
        $school_ids = $com->getWatched();
        return NY('Api\Base\Cz\School')->getBatch($school_ids);
        // return $model->get;
    }

    /**
     * 把缓存从json转换为数组
     * @param  array  $actives
     * @return array
     */
    protected function _restoreData(array $actives)
    {
        foreach ($actives as $index => $value) {

            $actives[$index] = json_decode($value, true);
        }
        return $actives;
    }

    /**
     * 排除用户
     * @param  string $username 需要排除的用户名
     * @param  array  $actives
     * @return array
     */
    protected function _excludeUser($username, array $actives)
    {
        foreach ($actives as $index => $active) {

            if ($active['username'] == $username) {

                unset($actives[$index]);
            }
        }
        return $actives;
    }

}