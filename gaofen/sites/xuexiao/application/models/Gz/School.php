<?php
use Illuminate\Database\Eloquent\Collection;

class Gz_SchoolModel extends School_SchoolModel
{
    protected $_orm = 'ORM\GZ\School';

    public function getSpecificSchools()
    {
        $zs = array('86' => '全市','78' => '老三区','79' => '七区');

        $school_ids = [55, 61, 74, 82, 54, 1, 88, 145];

        $school_tj = F::api('/gz/school/getBatch', ['ids' => $school_ids]);

        /*array(
                           '55' => array('name' => '广州市执信中学','cover' => '20140715/20140715171450_67419.jpg', 'zs' => 86),
                           '61' => array('name' => '广州市铁一中学','cover' => '20111109/20111109133514_45461.jpg', 'zs' => 86),
                           '74' => array('name' => '广州市育才中学','cover' => '20111110/20111110094620_59003.jpg', 'zs' => 86),
                           '82' => array('name' => '中山大学附属中学','cover' => '20111128/20111128121156_58048.jpg', 'zs' => 78),
                           '54' => array('name' => '广东广雅中学','cover' => '20111109/20111109113201_42019.jpg', 'zs' => 86),
                           '1' => array('name' => '广东实验中学','cover' => '20111107/20111107173615_71309.jpg', 'zs' => 86),
                           '88' => array('name' => '广州市天河中学','cover' => '20111110/20111110140554_78871.jpg', 'zs' => 79),
                           '145' => array('name' => '华师附属中学','cover' => '20111111/20111111135443_22672.jpg', 'zs' => 78),
                           );*/

        return ['school_tj' => sub_array_to_orm($school_tj, 'ORM\GZ\School')];
    }

    /**
     * 特色班
     * @return array
     */
    public function getSpecificClass()
    {
        $classes = CFG::school('recommand_classes');
        $school_ids = array_column($classes, 'id');
        $classes = array_reset_key($classes, 'id');

        $schools = F::api('/gz/school/getBatch', ['ids' => $school_ids]);

        foreach ($schools as $index => $school) {
            $schools[$index]['classes'] = $classes[$index]['name'];
        }
//        var_dump($schools);
        return sub_array_to_orm($schools, 'ORM\CZ\School');
    }

    protected function _getByCondiction(array $condiction, $page = 1, $limit = 30)
    {
        $condiction['page'] = max(1, (int) $page);
        $condiction['limit'] = $limit;

        $schools = \F::api('/Gz/school/getSchools', $condiction);

        return $this->_rst($schools);
    }


    /**
     * 获取学校招生范围
     * @param  [array] $gz_admit_range ex:array(1,2,3)
     * @return [array]                 ex:array(1=>"全国")
     */
    public function explainAdmitRange(array $gz_admit_range)
    {
        $admitRangeList = CFG::school('school', 'gz_admit_range');
        $admitRangeIds = array_keys($admitRangeList);

        if (in_array(1, $gz_admit_range)) {
            return array(0 => $admitRangeList[1]);
        }

        //获取需要过滤大类的对应小类，避免前台重复显示
        $explainIds = array(
                4 => array(2, 3, 5, 6, 7, 8, 9, 10, 11, 16),
                3 => array(2, 5, 6, 7, 8, 9, 10, 11),
                2 => array(5, 6, 8),
                17 => array(12),
                18 => array(12, 16),
                19 => array(16),
            );

        foreach ($explainIds as $_id => $_arr) {
            if (in_array($_id, $gz_admit_range)) {
                $gz_admit_range = array_diff($gz_admit_range, $_arr);
            }
        }

        $gz_admit_range = array_unique($gz_admit_range);
        foreach ($gz_admit_range as $_k => $_id) {
            $gz_admit_range[$_k] = $admitRangeList[$_id];
        }

        return $gz_admit_range;
    }

    /**
     * 获取学校招生批次
     * @param  [type] $gz_admit_range [description]
     * @return [type]                 [description]
     */
    public function explainAdmitBatch(array $gz_admit_batch)
    {
        $admitBatchList = CFG::school('school', 'gz_admit_batch');
        foreach ($gz_admit_batch as $_k => $_id) {
            $gz_admit_batch[$_k] = @$admitBatchList[$_id];
        }

        return $gz_admit_batch;
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

        // 学校级别
        $gzLevelList = CFG::school('school', 'gz_level');

        // 学校类型
        $gzPropertyList = CFG::school('school', 'gz_property');

        //录取批次
        $gzAdmitBatchList =  CFG::school('school', 'gz_admit_batch');

        //招生范围
        $gzAdmitRangeList =  CFG::school('school', 'gz_admit_range');

        //办学性质
        $cateList = CFG::school('cate', 'gz_cate');

        $list = [
         'district' => ['filter_name' => '所在区域', 'param_name' => 'district', 'list' => $districtList ],
         'gz_level' => ['filter_name' => '学校级别', 'param_name' => 'level', 'list' => $gzLevelList ],
         'gz_property' => ['filter_name' => '学校类型', 'param_name' => 'property', 'list' => $gzPropertyList ],
         'gz_admit_batch' => ['filter_name' => '录取批次', 'param_name' => 'batch_id', 'list' => $gzAdmitBatchList ],
         'gz_admit_range' => ['filter_name' => '招生范围', 'param_name' => 'range_id', 'list' => $gzAdmitRangeList ],
         'cate' => ['filter_name' => '办学性质', 'param_name' => 'cate', 'list' => $cateList ],
        ];

        return array_except($list, $except);
    }

    /**
     * 广州重点高中 top=3
     * @return Illuminate\Database\Eloquent\Collection
     */
    public function getKeySchool()
    {
        $getKeySchools = $this->_getByCondiction(['top' => 3], 1, 10);
        return $getKeySchools;
    }

    /**
     * 各区重点高中 top=4
     * @return Illuminate\Database\Eloquent\Collection
     */
    public function getKeyDistictSchool(array $district_ids)
    {
        $districts = [];
        foreach ($district_ids as $district_id) {
            $districts[] = $this->_getByCondiction(['top' => 4, 'district' => $district_id], 1, 4);
        }

        return new Collection($districts);
    }

    public function getZhongkaoThreads($count = 5)
    {
        /**
         * 获取中考板块(fids=49)，讨论，择校，小道的主题(typeids=41, 86, 441)
         */
        $condiction = ['fids' => [49] , 'typeids' => '41,86,441', 'count' => $count];
        $threads = \F::api('/Bbs/thread/dzxThread', $condiction);
        return $threads;
    }

    /**
     * 返回7天内的热门学校
     * @return Illuminate\Database\Eloquent\Collection
     */
    public function getHotSchools()
    {
        $hotSchools = $this->_getByCondiction(['orderby' => 'range_views'], 1, 10);

        /**
         * 判断是否已收藏
         */
        $fav_ids = F::api('/gz/feed/getFollows', ['uid' => Users::uid(), 'only_id' => true]);
        $fav_ids = $fav_ids['list'];

        $hotSchools['list']->map(function ($school) use ($fav_ids) {

            $school->isFollow = in_array($school->id, $fav_ids) ? true : false;

        });

        return $hotSchools;
    }

    /**
     * 小升初频道首页右侧的数据同步
     * @return array
     */
    public function getTopics()
    {
        $topics = F::api('cms:/docBlock/get', ['id' => 205, 'count' => 8]);

        if (!$topics) {
            return ['list' => [], 'total' => 0];
        }

        return ['list' => $topics['data'], 'total' => count($topics['data'])];
    }

    /**
     * 获取推荐民校
     * @return Illuminate\Database\Eloquent\Collection
     */
    public function getHotCitySchools()
    {
        $hotCitySchools = $this->_getByCondiction(['orderby' => 'views'], 1, 8);
        //$privateSchools['list']->shuffle();

        return $hotCitySchools;
    }

    /**
     * 获取推荐公校
     * @return Illuminate\Database\Eloquent\Collection
     */
    public function getHotDistrictSchools($district)
    {
        $hotDistrictSchools = $this->_getByCondiction(['orderby' => 'views', 'district' => $district], 1, 8);
        //$govSchools['list']->shuffle();
        // shuffle($govSchools);

        return $hotDistrictSchools;
    }
}
