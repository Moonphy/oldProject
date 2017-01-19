<?php
namespace Api\Apis\Gz;

use Api\OpenApi;

class Search extends \Api\Apis\Base
{
    /**
     * 高中分数线搜索接口
     * @param  array  $params
     * range_id=招生范围id
     * year=年份
     * luqu_id=录取类别id
     * low_mark=最高分数,最低分数
     * @return array
     */
    public function admitScore(array $params)
    {
        /* http://sphinx.gaofen.com/school/search/gz_admit_score */

        $params = array_only($params, ['range_id', 'year', 'luqu_id', 'batch_id', 'orderby', 'low_mark', 'sid']);
        $params['count'] = 1000;
        $rs = \F::api('sphinx:/school/search/gz_admit_score', $params);

        return $this->_rst($rs);
    }

    /**
     * 高中库学校搜索接口
     * @param  array  $params
     * q=关键字
     * &district=地区id
     * &property=学校属性类型id
     * &cate=办学类型id
     * &city=城市id&
     * province=省份id
     * &range_id=招生范围ids
     * &batch_id=录取批次ids
     * &level=学校等级id
     * &orderby=根据views排序
     * &count=每页返回的结果默认30
     * &page=1
     * @return array
     */
    public function getSchools(array $params)
    {
        /* http://sphinx.gaofen.com/school/search/gz_school */
        $rs = \F::api('sphinx:/school/search/gz_school', $params);

        return $this->_rst($rs);
    }

    protected function _rst($rs)
    {
        if (!$rs || isset($rs['error_code'])) {
            return ['ids' => [], 'total_number' => 0];
        }

        return $rs;
    }
}
