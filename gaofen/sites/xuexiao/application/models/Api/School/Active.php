<?php

abstract class Api_School_ActiveModel
{
    protected $_cache;

    public function __construct(Cache\Api $cache)
    {
        $this->_cache = $cache;
    }

    abstract public function getCacheListName(array $params);

    /**
     * 添加缓存
     * @param array  $params   待转换的参数
     * @param $kvar
     * @param 列表名称 $listName
     */
    public function setActive(array $params, $listName, $kvar)
    {
        $saveData = $params;
        $saveData['time'] = time();

        //排除重复的旧缓存
        $this->_excludeDulipateAction($saveData, $listName, $kvar);

        $this->_cache->listPush($listName, $kvar, json_encode($saveData));
    }

    public function getActive($listName, $kvar)
    {
        return $this->_cache->listGet($listName, $kvar);
    }

    /**
     * 排除旧的缓存
     * @param  array  $saveData
     * @param  列表名称 $listName
     * @param  $kvar
     */
    protected function _excludeDulipateAction(array $saveData, $listName, $kvar)
    {
        // 判断当前用户是否有记录
        $active = $this->getActive($listName, $kvar);

        if ($active) {

            foreach ($active as $index => $value) {

                $obj = json_decode($value, true);

                // 查看当前用户的操作和缓存是否有区别
                $diff = array_diff(array_except($obj, array('time')) , array_except($saveData, array('time')));

                // 没区别就删掉旧缓存
                if (!$diff) {

                    $this->_cache->listDel($listName, $kvar, $value);
                }
            }
        }
    }

}