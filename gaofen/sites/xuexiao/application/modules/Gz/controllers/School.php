<?php
use Traits\Gz\GuideData;

class SchoolController extends Yaf_Controller_Abstract
{
    use GuideData;

    public function indexAction()
    {
        $inputs = V('g');
        $inputs['district_id'] = $this->getLastSelectedDistrict();
        $form = DIBuilder::make('Html\Form', ['model' => $inputs]);
        $schoolModel = DIBuilder::make('Gz_SchoolModel');

        $model = DIBuilder::singleton('Gz_ChosenModel');

        $historyData = $this->getHistoryData($model);
        $chosenData = $this->getSelectData($model);

        /**
         * 热门学校
         */
        $hotSchools = $schoolModel->getHotSchools();

        /**
         * 广州重点高中
         */
        $keySchool = $schoolModel->getKeySchool();

        /**
         * 各区重点高中
         */
        $district_ids = array_keys($chosenData['district']);
        $district_id = array_slice($district_ids, 0, 1);
        $distictSchool = $schoolModel->getKeyDistictSchool($district_id);

        /**
         * 特色班级
         */
        $classes = $schoolModel->getSpecificClass();

        /**
         * 热门讨论
         */
        $threads = $schoolModel->getZhongkaoThreads();

        $this->getView()->assign(compact('form', 'threads', 'hotSchools', 'keySchool', 'distictSchool', 'classes'));
        $this->getView()->assign($chosenData);
        $this->getView()->assign($historyData);
    }

    public function listAction()
    {
        $model = NY('Gz_SchoolModel');

        // 你浏览过的资料
        $visited = F::api('/Gz/active/getVisited', ['uid' => Users::uid(), 'limit' => 5]);

        if (isset($visited['errno'])) {
            $visited = [];
        }


        $filters = $model->getFilters();

        $inputs = V('g');
        $inputs['city'] = 289;
        $inputs['orderby'] = 'views';
        $inputs['count'] = 10;
        $schools = $model->getSchools(array_except($inputs, ['page']));

        /**
         * 热门学校
         */
        $hotSchools = $model->getHotSchools();

        /**
         * 小升初资料专题
         */
        $topics = $model->getTopics();

        /**
         * 择校选项
         * @var [type]
         */
        $cmodel = DIBuilder::singleton('Gz_ChosenModel');

        $chosenData = $this->getSelectData($cmodel);

        $inputs['district_id'] = $this->getLastSelectedDistrict();
        $form = DIBuilder::make('Html\Form', ['model' => $inputs]);


        $this->getView()->assign(compact([
            'visited',
            'filters',
            'schools',
            'visited',
            'topics',
            'form',
            'distictSchool',
            'hotSchools',
            'inputs',
        ]));
        $this->getView()->assign($chosenData);
    }

    public function viewAction()
    {
        $id = V('G:id');
        $type = V('g:type', 7); //分组信息内容,默认招生信息

        $info = F::api('/Gz/School/get', ['id' => $id, '_autoIncView' => true]);

        if (empty($info) || empty($info['gz_state']) || !empty($info['deleted_at'])) {
            F::err404('数据不存在', 'Gz');
        }


        //学校类型列表
        $propertyList = CFG::school('school', 'property');

        $users = F::api('/Gz/active/setVisited', [
            'school_id' => $id,
            'uid' => Users::uid(),
            'username' => Users::username()
        ]);

        // 用户动态
        $actives = F::api('/Gz/active/getActive', [
            'school_id' => $id,
            'limit' => 5,
            'username' => Users::username()
        ]);

        $visited = F::api('/Gz/active/getVisited', ['uid' => Users::uid()]);
        if (isset($visited['errno'])) {
            $visited = [];
        }

        $picList = F::api('/Gz/Pic/listByCond', ['sid' => $id, 'limit' => 1]);

        //分组信息内容
        $infoList = F::com('SchoolInfo')->listGzInfo($info, $type, 'gzinfo', array('article_area_type' => 1));

        //是否关注
        $isFollow = F::api('/Gz/feed/isFollow', ['uid' => Users::uid(), 'school_id' => $id]);

        //关联初中
        $relCzUrl = '';
        if ($info['has_cz']) {
            $_tmp = F::api('/Search/cz', array('q' => $info['oname']));
            if (!empty($_tmp['list'])) {
                if (count($_tmp['list']) > 1) {
                    $relCzUrl = F::URL('/Cz/School/index', array('q' => $info['oname']));
                } else {
                    $relCzUrl = F::URL('/Cz/School/view', array('id' => $_tmp['list'][0]['id']));
                }
            }
        }

        //中考推荐文章
        $moduelObj = NY('Modules\School\Post');
        $topicPostList = $moduelObj->getTopic(array('limit'=>6, 'flag'=>13, 'school_type'=>2));

        $gzModel = NY('Gz_SchoolModel');

        $citySchools = $gzModel->getHotCitySchools();

        $districtSchools = $gzModel->getHotDistrictSchools($info['district']);

        $this->getView()->assign(compact([
            'actives',
            'visited',
            'info',
            'attypeList',
            'propertyList',
            'type',
            'infoList',
            'picList',
            'isFollow',
            'gzModel',
            'citySchools',
            'districtSchools',
            'relCzUrl',
            'topicPostList'
        ]));
    }

    public function detailAction()
    {
        $id = V('G:id');

        $info = F::api('/Gz/School/get', ['id' => $id, '_autoIncView' => true]);

        if (empty($info) || empty($info['gz_state']) || !empty($info['deleted_at'])) {
            F::err404('数据不存在', 'Gz');
        }

        $model = NY('Gz_SchoolModel');


        $this->getView()->assign(compact(['info']));
    }

    /**
     * 数据对比
     * @return [type] [description]
     */
    public function cmpAction()
    {
        $ids = V('g:ids');

        $ids = explode(',', $ids);

        foreach ($ids as $_k => $_id) {
            if (!is_numeric($_id)) {
                unset($ids[$_k]);
            }
        }

        $sList = F::api('/Gz/School/getBatch', ['ids' => $ids]);
        $sList = array_filter($sList, function ($row) {
            return $row['gz_state'] == 1;
        });
        $sList = array_values($sList);

        $infoList = $this->cmpInfo($sList);

        $fieldOrder = [
            '学校地址',
            '办学性质',
            '学校级别',
            '学校类型',
            '招生批次',
            '招生范围',
            '招生人数',
            '宿位',
            '分数线',
            '高考成绩',
        ];


        $this->getView()->assign(compact(['fieldOrder', 'sList', 'infoList']));
    }

    public function ajaxSchoolsAction()
    {
        Yaf_Dispatcher::getInstance()->disableView();
        /**
         * 学校资料
         */
        $model = NY('Gz_SchoolModel');

        $inputs = V('g');
        $inputs['city'] = 289;
        $inputs['orderby'] = 'views';
        $page = $inputs['page'];
        $schools = $model->getSchools($inputs, $page);

        if (isset($schools['error'])) {
            F::ajaxRst(null, $schools['errno'], $schools['error']);
        }

        $string = F::TPL('school/school.html', ['schools' => $schools['list']], 'Gz', true);

        F::ajaxRst([
            'html' => $string,
            'count' => count($schools['list']),
            'total' => $schools['total'],
        ]);
    }

    /**
     * 高中库首页异步获取各区重点高中
     */
    public function ajaxDistrictAction()
    {
        Yaf_Dispatcher::getInstance()->disableView();
        /**
         * 学校资料
         */
        $model = NY('Gz_SchoolModel');

        $district_id = V('g:id', 0);

        $distictSchools = $model->getKeyDistictSchool(array($district_id));

        foreach ($distictSchools as $schools) {
            if (isset($schools['error'])) {
                F::ajaxRst(null, $schools['errno'], $schools['error']);
            }

            $string = '';

            foreach ($schools['list'] as $school) {
                $string .= F::TPL('school/school_grid.html', ['school' => $school], 'Gz', true);
            }

            F::ajaxRst([
                'html' => $string,
                'count' => count($schools['list']),
                'total' => $schools['total'],
            ]);
        }
    }

    /**
     * 拼装info对比数据
     * @param $sList
     * @return array [type]      [description]
     * @throws Exception
     * @internal param $ [type] $sList 对比的学校数据
     */
    public function cmpInfo($sList)
    {
        $infoText = array();
        $extField = [
            'cate' => '办学性质',
            'address' => '学校地址',
            'gz_level' => '学校级别',
            'gz_property' => '学校类型',
            'gz_admit_batch' => '招生批次',
        ];

        //学校类型列表
        foreach ($sList as $row) {
            $_ptext = array();
            $infoText[$row['id']][$extField['cate']] = CFG::school('cate', 'gz_cate', $row['cate']);
            $infoText[$row['id']][$extField['address']] = @$row['ext']['address'];
            $infoText[$row['id']][$extField['gz_level']] = CFG::school('school', 'gz_level', $row['gz_level']);
            $infoText[$row['id']][$extField['gz_property']] = CFG::school('school', 'gz_property', $row['gz_property']);
            $batchTxt = array();
            foreach ($row['gz_admit_batch'] as $batch_id) {
                $batchTxt[] = CFG::school('school', 'gz_admit_batch', $batch_id);
            }

            $infoText[$row['id']][$extField['gz_admit_batch']] = implode('/', $batchTxt);
        }

        $ids = array_column($sList, 'id');
        foreach ($ids as $_sid) {
            $infoList = F::api('/Gz/Info/listByCond', array('sid' => $_sid));//var_export($infoList);exit;
            if (!empty($infoList['list'])) {
                foreach ($infoList['list'] as $oneTypeInfo) {
                    foreach ($oneTypeInfo['data'] as $_row) {
                        if ($_row['sys'] == 1) {
                            switch ($_row['flag']) {
                                case 'admit_forte':
                                    $_t = array();
                                    foreach ($_row['value'] as $_kk => $_vv) {
                                        if ($_vv['year'] != date('Y')) {
                                            continue;
                                        }
                                        //$_t[ $G_ADMIT_FORTE_LIST[$_vv['type']]['name']][] = $G_ADMIT_FORTE_LIST[$_vv['type']]['child'][$_vv['cate']];
                                        $_t[CFG::school('admit_forte', $_vv['type'],
                                            'name')][] = CFG::school('admit_forte', $_vv['type'], 'child',
                                            $_vv['cate']);
                                    }

                                    $_tt = array();
                                    foreach ($_t as $typename => $catelist) {
                                        $_tt[] = $typename . '：' . implode('，', $catelist);
                                    }
                                    $infoText[$_sid][$_row['name']] = implode('<br />', $_tt);
                                    break;

                                case 'gz_admit_score':
                                    $_t = array();
                                    foreach ($_row['value'] as $_kk => $_vv) {
                                        if ($_kk > 20) {
                                            break;
                                        } //只显示3条记录
                                        $_memo = empty($_vv['memo']) ? '' : '(' . $_vv['memo'] . ')';
                                        $_t[$_vv['year']][$_vv['batch_id']][] = $_vv;
                                    }

                                    $_tt = '<dl>';
                                    $_kk = 0;
                                    foreach ($_t as $_year => $batchData) {
                                        if ($_kk >= 3) {
                                            break;
                                        }
                                        $_tt .= '<dt>' . $_year . '年</dt>' . PHP_EOL;
                                        foreach ($batchData as $batch_id => $_rows) {
                                            $batchName = CFG::school('school', 'gz_admit_batch', $batch_id);

                                            $_tt .= '   <dd>' . $batchName . '：';
                                            foreach ($_rows as $_r) {
                                                if ($_r['luqu_id'] == 4) { //民办学校显示招生区域
                                                    $luquName = CFG::school('school', 'gz_admit_range',
                                                        $_r['admit_range_id']);
                                                } else {
                                                    $luquName = CFG::school('luqu_type', $_r['luqu_id']);
                                                }

                                                $_tt .= $luquName . $_r['low_mark'] . ' ';
                                            }
                                            $_tt .= '</dd>' . PHP_EOL;
                                        }
                                        $_kk++;
                                    }
                                    $_tt .= '</dl>';

                                    $infoText[$_sid]['分数线'] = $_tt;
                                    break;

                                case 'gz_score':
                                    $_t = array();
                                    foreach ($_row['value'] as $_kk => $_vv) {
                                        if ($_kk > 2) {
                                            break;
                                        }//只显示3条记录
                                        $_t[$_vv['year']] = $_vv;
                                    }


                                    $_tt = '<dl>';
                                    foreach ($_t as $_year => $_r) {
                                        $_tt .= '<dt>' . $_year . '年</dt>' . PHP_EOL;
                                        if (!empty($_r['yiben_luqu'])) {
                                            $_tt .= '<dd>一本录取率' . $_r['yiben_luqu'] . '%</dd>' . PHP_EOL;
                                        }
                                        if (!empty($_r['erben_a_luqu'])) {
                                            $_tt .= '<dd>二本A录取率' . $_r['erben_a_luqu'] . '%</dd>' . PHP_EOL;
                                        }
                                        if (!empty($_r['erben_b_luqu'])) {
                                            $_tt .= '<dd>二本B录取率' . $_r['erben_b_luqu'] . '%</dd>' . PHP_EOL;
                                        }
                                    }
                                    $_tt .= '</dl>';
                                    $infoText[$_sid][$_row['name']] = $_tt;
                                    break;

                                default:
                                    $infoText[$_sid][$_row['name']] = $_row['value'];
                                    break;
                            }
                        }
                    }
                }
            }
        }

        return array_values($infoText);
    }

    /**
     * 图库
     * @throws Exception
     */
    public function albumAction()
    {
        $sid = V('g:sid');

        if (empty($sid)) {
            F::err404('', 'Gz');
        }

        $info = F::api('/Gz/School/get', array('id' => $sid));

        if (empty($info) || empty($info['gz_state']) || !empty($info['deleted_at'])) {
            F::err404('学校不存在', 'Gz');
        }

        $picList = F::api('/Gz/Pic/listByCond', array('sid' => $sid, 'limit' => 80));

        $this->getView()->assign(compact(['picList', 'info']));
    }
}
