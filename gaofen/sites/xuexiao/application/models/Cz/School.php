<?php

class Cz_SchoolModel extends School_SchoolModel
{
    protected $_orm = 'ORM\CZ\School';

    protected function _getByCondiction(array $condiction, $page = 1, $limit = 30)
    {
        $condiction['page'] = max(1, (int) $page);
        $condiction['count'] = (int) $limit;
        $schools = \F::api('/search/cz', $condiction);

        return $this->_rst($schools);
    }

    /**
     * 返回搜索过滤列表
     * @param array $except
     * @return array
     */
    public function getFilters(array $except = [], $params = [])
    {
        $city = (isset($params['city']) && $params['city'] == 291) ? 291 : 289;
        // 所在区域
        $districtList = CFG::school('location', 'city', $city, 'district');

        // 学校类型
        $propertyList = CFG::school('school', 'property');

        // 入学途径
        $attypeList = CFG::school('school', 'attype');

        $cateList = CFG::school('cate', 'cate');

        $list = [
         'district' => ['filter_name' => '所在区域', 'param_name' => 'district', 'list' => $districtList ],
         'property' => ['filter_name' => '学校类型', 'param_name' => 'property', 'list' => $propertyList ],
         'attype' => ['filter_name' => '入学途径', 'param_name' => 'attype', 'list' => $attypeList ],
         'cate' => ['filter_name' => '属性', 'param_name' => 'cate', 'list' => $cateList ],
        ];

        return array_except($list, $except);
    }

    /**
     * 小升初频道首页右侧的数据同步
     * @return array
     */
    public function getTopics()
    {
        $topics = F::api('cms:/docBlock/get', ['id' => 204, 'count' => 8]);

        if (!$topics) {
            return ['list' => [], 'total' => 0];
        }

        return ['list' => $topics['data'], 'total' => count($topics['data'])];
    }

    public function getSpecificSchools(array $params, $limit = 8)
    {
        $params['count'] = $limit;

        $SpecificSchools = F::api('search/cz', $params);

        if (isset($SpecificSchools['total']) && $SpecificSchools['total']) {
            $SpecificSchools['list'] = sub_array_to_orm($SpecificSchools['list'], 'ORM\CZ\School');
        } else {
            $SpecificSchools['list'] = [];
        }

        return $SpecificSchools;
    }

    /**
     * 获取标签
     * @param  [type] $gid    [description] 分组ID
     * @param  [type] $except [description] 不需要返回的tag id
     * @param  [type] $limit  [description] 获取N个
     * @return [type]         [description]
     */
    public function getTags($gid = null, array $except = [], $limit = null)
    {
        $tags = CFG::tags('tags');
        if ($gid) {
            $tags_ids = CFG::tags('group', $gid);
            $tags = array_only($tags, $tags_ids);
        }

        if ($except) {
            $tags = array_except($tags, $except);
        }

        if ($limit) {
            $tags = array_slice($tags, 0, (int) $limit);
        }

        return $tags;
    }

    /**
     * 获取标签的名称
     * @param  [type] $tid [description] 标签ID
     * @return [type]      [description]
     */
    public function getTagName($tid)
    {
        $tags = CFG::tags('tags');
        return isset($tags[$tid]) ? $tags[$tid] : null;
    }

    /**
     * 批量获取标签
     * @param  arrray $tids [description]
     * @return [type]       [description]
     */
    public function getTagByIds( array $tids) {
        $tags = CFG::tags('tags');
        return array_only($tags, $tids);
    }

    /**
     * 获取标签所属分组ID
     * @param  [type] $tid [description]
     * @return [type]      [description]
     */
    public function getGidByTid($tid) {
        $group = CFG::tags('group');
        $gid = NULL;
        foreach($group as $_gid=>$ids) {
            if(in_array($tid, $ids)) {
                $gid = $_gid;
                break;
            }
        }

        return $gid;
    }

    /**
     * 首页民校择校
     * @return Illuminate\Database\Eloquent\Collection
     */
    public function getIndexPrivateSchool()
    {
        return $this->_getByCondiction(['top' => 2, 'city' => 289], 1, 6);
    }

    /**
     * 特长生择校
     * @return Illuminate\Database\Eloquent\Collection
     */
    public function getSpecialStudentSchool()
    {
        return $this->_getByCondiction(['top' => 3, 'city' => 289], 1, 6);
    }

    /**
     * 外国语学校
     * @return Illuminate\Database\Eloquent\Collection
     */
    public function getForeignLanguageSchool()
    {
        return $this->_getByCondiction(['top' => 4, 'city' => 289], 1, 6);
    }

    public function getXSCThreads($count = 8)
    {
        /**
         * 获取小升初板块(fids=45)，招生、择校、爆料的主题(typeids=26, 25, 55)
         */
        $condiction = ['fids' => [45] , 'typeids' => '26, 25, 55', 'count' => $count];
        $threads = \F::api('/Bbs/thread/dzxThread', $condiction);
        return $threads;
    }
}
