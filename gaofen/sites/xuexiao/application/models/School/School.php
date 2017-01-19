<?php
use Illuminate\Database\Eloquent\Collection;

abstract class School_SchoolModel
{
    /**
     * 根据条件获取学校
     * @param  array $inputs 搜索条件
     * @param int $page
     * @param int $limit
     * @return mixed
     */
    public function getSchools(array $inputs, $page = 1, $limit = 10)
    {
        $keyword = V('G:q', null);

        /**
         * 过滤没有值的参数,防止api报错
         */
        $inputs = array_filter($inputs, function ($var) {

            return $var;
        });

        /**
         * 有关键字的条件下优先获取关键字
         */
        $params = $keyword ? array_only($inputs, ['q']) : array_except($inputs, ['q']);

        return $this->_getByCondiction($params, $page, $limit);
    }

    /**
     * @param array $params
     * @return mixed
     */
    abstract protected function _getByCondiction(array $params);

    /**
     * 获取推荐民校
     * @return Illuminate\Database\Eloquent\Collection
     */
    public function getTopPrivateSchools()
    {
        $privateSchools = $this->_getByCondiction(['top' => 1, 'cate' => 2], 1, 15);
        $privateSchools['list']->shuffle();

        return $privateSchools;
    }

    /**
     * 获取推荐公校
     * @return Illuminate\Database\Eloquent\Collection
     */
    public function getTopGovSchools()
    {
        $govSchools = $this->_getByCondiction(['cate' => 1, 'orderby' => 'range_rank_yg'], 1, 15);
        $govSchools['list']->shuffle();
        // shuffle($govSchools);

        return $govSchools;
    }

    /**
     * @param $rst
     * @return Collection
     */
    protected function _rst($rst)
    {
        if (!$rst || isset($rst['error'])) {
            return new Collection([]);
        }

        if (isset($this->_orm)) {
            $rst['list'] = sub_array_to_orm($rst['list'], $this->_orm);
        }
        $rst['list'] = new Collection($rst['list']);
        return $rst;
    }
}
