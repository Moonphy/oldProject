<?php
namespace Api\Apis;
use Api\OpenApi;

class Search extends Base
{
    /**
     * 中学库搜索
     * @param  array  $p [description]
     * @return [type]    [description]
     * http://sphinx.gaofen.com/school/search/cz_school?q=关键字
     * &district=地区id
     * &property=学校属性类型id
     * &attype=精确查校id
     * &orderby=根据views排序
     * &count=每页返回的结果默认 30
     * &top=1|2 1为推荐,2为不推荐，不传值取所有
     * &page=1
     */
    public function cz(array $p=array()) {

        $p['orderby'] = isset($p['orderby']) ? $p['orderby'] : 'views';
        $rs = \F::api('sphinx:/school/search/cz_school', $p);

        if (isset($rs['error'])) {

            throw  OpenApi::throwException($rs['error_code'], $rs['error']);

        }

        $list = $this->getBase('/Cz/School')->getBatch($rs['ids']);
        return array('list'=>array_values($list), 'total'=>$rs['total_number']);
    }

    /**
     * 特长生数据搜索
     * @param  array  $p [description]
     * @return [type]    [description]
     * http://sphinx.gaofen.com/school/search/cz_admit_forte?sid=学校ids&type=特长大类id&cate=特长小类id
     */
    public function czAdmitForte(array $p=array()) {

        $rs = \F::api('sphinx:/school/search/cz_admit_forte', $p);

        if (isset($rs['error'])) {

            throw  OpenApi::throwException($rs['error_code'], $rs['error']);

        }

        $list = $this->getBase('/Cz/Admitforte')->getBatch($rs['ids']);
        $sids = array_column($list, 'sid');
        $schoolList = $this->getBase('/Cz/School')->getBatch($sids);

        foreach($list as $_k=>$_item) {
            $list[$_k]['sInfo'] = array('id'=>$_item['sid'], 'name'=>$schoolList[$_item['sid']]['name']);
        }

        return array('list'=>array_values($list), 'total'=>$rs['total_number']);
    }
}