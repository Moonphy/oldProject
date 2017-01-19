<?php

class SchoolController extends Yaf_Controller_Abstract
{
    /**
     * 初中库首页
     */
    public function frontAction()
    {
        $model = NY('Cz_SchoolModel');
        /**
         * 推荐民校
         */
        $privateSchools = $model->getTopPrivateSchools();

        /**
         * 推荐公校
         */
        $govSchools = $model->getTopGovSchools();

        /**
         * 民校推荐数据
         */

        /**
         * 选学校
         */
        $filters = $model->getFilters(['cate', 'property', 'attype']);

        /**
         *
         */
        $pstypeList = CFG::school('school', 'pstype_index');

        /**
         * 地区
         */
        $districtList = CFG::school('location', 'city', 289, 'district');

        $form = DIBuilder::make('Html\Form');

        $schools = [
            [
                'name' => '民校择校',
                'link' => ['district' => 0, 'property' => 2, 'attype' => 4],
                'list' => $model->getIndexPrivateSchool(),
                'params' => 'scores',
            ],
            [
                'name' => '特长生择校',
                'link' => ['district' => 0, 'property' => 0, 'attype' => 2],
                'list' => $model->getSpecialStudentSchool(),
                'params' => 'admitForte'
            ],
            [
                'name' => '外国语学校',
                'link' => ['district' => 0, 'property' => 3, 'attype' => 0],
                'list' => $model->getForeignLanguageSchool(),
                'params' => 'scores'
            ],
        ];

        //特长生选项
        $admitForteList = CFG::school('admit_forte');

        $threads = $model->getXSCThreads();

        $this->getView()->assign(compact([
            'govSchools',
            'privateSchools',
            'schools',
            'pstypeList',
            'form',
            'districtList',
            'filters',
            'admitForteList',
            'threads',
        ]));
    }

    public function indexAction()
    {
        $model = NY('Cz_SchoolModel');

        // 你浏览过的资料
        $visited = F::api('/cz/active/getVisited', ['uid' => Users::uid(), 'limit' => 5]);

        if (isset($visited['errno'])) {
            $visited = [];
        }


        /**
         * 资料
         */
        $filters = $model->getFilters(['cate']);

        /**
         * 学校资料
         */
        $inputs = V('g');
        $inputs['city'] = 289;
        $schools = $model->getSchools(array_except($inputs, ['page']));

        /**
         * 小升初资料专题
         */
        $topics = $model->getTopics();

        /**
         * 推荐民校
         */
        $privateSchools = $model->getTopPrivateSchools();

        /**
         * 推荐公校
         */
        $govSchools = $model->getTopGovSchools();

        /**
         * 地区
         */
        $districtList = CFG::school('location', 'city', 289, 'district');

        $form = DIBuilder::make('Html\Form');

        //特长生选项
        $admitForteList = CFG::school('admit_forte');

        $pstypeList = CFG::school('school', 'pstype_index');


        $this->getView()->assign(compact([
            'visited',
            'filters',
            'schools',
            'admitForteList',
            'pstypeList',
            'topics',
            'privateSchools',
            'govSchools',
            'districtList',
            'form'
        ]));
    }

    public function viewAction()
    {
        $id = V('G:id');
        $type = V('g:type', 2); //分组信息内容,默认招生信息

        $info = F::api('/Cz/School/get', ['id' => $id, '_autoIncView' => true]);

        if (empty($info) || empty($info['cz_state']) || !empty($info['deleted_at'])) {
            F::err404('数据不存在', 'Cz');
        }

        //入学途径选项列表
        $attypeList = CFG::school('school', 'attype');

        //学校类型列表
        $propertyList = CFG::school('school', 'property');

        $users = F::api('/cz/active/setVisited', [
            'school_id' => $id,
            'uid' => Users::uid(),
            'username' => Users::username()
        ]);

        // 用户动态
        $actives = F::api('/cz/active/getActive', [
            'school_id' => $id,
            'limit' => 5,
            'username' => Users::username()
        ]);

        $visited = F::api('/cz/active/getVisited', ['uid' => Users::uid()]);
        if (isset($visited['errno'])) {
            $visited = [];
        }
        // var_dump($visited);
        //
        $picList = F::api('/Cz/Pic/listByCond', ['sid' => $id, 'limit' => 1]);

        //分组信息内容
        $infoList = F::com('SchoolInfo')->listCzInfo($info, $type, 'czinfo', array('article_area_type' => 1));

        // 是否关注
        $isFollow = F::api('cz/feed/isFollow', ['uid' => Users::uid(), 'school_id' => $id]);

        //关联高中
        $relGzUrl = '';
        if ($info['has_gz']) {
            $_tmp = F::api('/Gz/school/getSchools', array('q' => $info['oname']));
            if (!empty($_tmp['list'])) {
                $_tmp = array_values($_tmp['list']);
                if (count($_tmp) > 1) {
                    $relGzUrl = F::URL('/Gz/School/list', array('q' => $info['oname']));
                } else {
                    $relGzUrl = F::URL('/Gz/School/view', array('id' => $_tmp[0]['id']));
                }
            }
        }

        $model = NY('Cz_SchoolModel');

        /**
         * 推荐民校
         */
        $privateSchools = $model->getTopPrivateSchools();

        /**
         * 推荐公校
         */
        $govSchools = $model->getTopGovSchools();

        $districtList = CFG::school('location', 'city', $info['city'], 'district');

        $info['tags'] = $model->getTagByIds($info['tags']);

        $this->getView()->assign(compact([
            'actives',
            'visited',
            'info',
            'attypeList',
            'propertyList',
            'type',
            'infoList',
            'picList',
            'privateSchools',
            'govSchools',
            'isFollow',
            'relGzUrl',
            'districtList',
        ]));
    }

    public function detailAction()
    {
        $id = V('G:id');

        $info = F::api('/Cz/School/get', ['id' => $id, '_autoIncView' => true]);

        if (empty($info) || empty($info['cz_state']) || !empty($info['deleted_at'])) {
            F::err404('数据不存在', 'Cz');
        }

        $model = NY('Cz_SchoolModel');


        $this->getView()->assign(compact(['info']));
    }

    /**
     * 数据对比
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

        $sList = F::api('/Cz/School/getBatch', ['ids' => $ids]);
        $sList = array_filter($sList, function ($row) {
            return $row['cz_state'] == 1;
        });
        $sList = array_values($sList);

        $infoList = $this->cmpInfo($sList);

        $fieldOrder = [
            '高分网点评',
            '办学性质',
            '总浏览量',
            '学校地址',
            '中考平均分',
            '招生方式',
            '招生对象',
            '录取分数线',
            '分数优惠',
            '特长生招生',
            '学费',
            '奖学金',
            '住宿情况',
        ];


        $this->getView()->assign(compact(['fieldOrder', 'sList', 'infoList']));
    }

    public function ajaxSchoolsAction()
    {
        Yaf_Dispatcher::getInstance()->disableView();
        /**
         * 学校资料
         */
        $model = NY('Cz_SchoolModel');

        $schools = $model->getSchools(V('g'), V('g:page', 1));

        if (isset($schools['error'])) {
            F::ajaxRst(null, $schools['errno'], $schools['error']);
        }

        $string = F::TPL('school/school.html', ['schools' => $schools['list']], 'Cz', true);

        F::ajaxRst([
            'html' => $string,
            'count' => count($schools['list']),
            'total' => $schools['total'],
        ]);
    }

    /**
     * 拼装info对比数据
     * @return array
     */
    public function cmpInfo($sList)
    {
        $infoText = array();
        $extField = ['tags' => '高分网点评', 'cate' => '办学性质', 'views' => '总浏览量', 'address' => '学校地址'];

        $model = NY('Cz_SchoolModel');

        foreach ($sList as $row) {
            $infoText[$row['id']][$extField['tags']] = implode(',', $model->getTagByIds($row['tags']));

            $infoText[$row['id']][$extField['cate']] = $row['cate'] == '1' ? '公办' : '民办';
            $infoText[$row['id']][$extField['views']] = "共{$row['views']}次浏览";
            $infoText[$row['id']][$extField['address']] = @$row['ext']['address'];
        }

        $ids = array_column($sList, 'id');
        foreach ($ids as $_sid) {
            $infoList = F::api('/Cz/Info/listByCond', array('sid' => $_sid));//var_export($infoList);exit;
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

                                case 'admit_score':
                                    $_t = array();
                                    foreach ($_row['value'] as $_kk => $_vv) {
                                        if ($_kk > 2) {
                                            break;
                                        } //只显示3条记录
                                        $_memo = empty($_vv['memo']) ? '' : '(' . $_vv['memo'] . ')';
                                        $_t[] = $_vv['year'] . '年' . $_vv['score'] . $_memo;
                                    }
                                    $infoText[$_sid][$_row['name']] = implode('<br />', $_t);
                                    break;

                                case 'score':
                                    $_t = array();
                                    foreach ($_row['value'] as $_kk => $_vv) {
                                        if ($_kk > 2) {
                                            break;
                                        }//只显示3条记录
                                        $_memo = empty($_vv['attend_num']) ? '' : '(' . $_vv['attend_num'] . '人参加考试)';
                                        $_t[] = $_vv['year'] . '年' . $_vv['score_avg'] . $_memo;
                                    }
                                    $infoText[$_sid]['中考平均分'] = implode('<br />', $_t);
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
     */
    public function albumAction()
    {
        $sid = V('g:sid');

        if (empty($sid)) {
            F::err404('', 'Cz');
        }

        $info = F::api('/Cz/School/get', array('id' => $sid));

        if (empty($info) || empty($info['cz_state']) || !empty($info['deleted_at'])) {
            F::err404('学校不存在', 'Cz');
        }

        $picList = F::api('/Cz/Pic/listByCond', array('sid' => $sid));

        $this->getView()->assign(compact(['picList', 'info']));
    }

    /**
     * 排行榜
     */
    public function rankAction()
    {
        $school_type = 3;//中学

        //公立学校
        $list['gs'] = F::api('/Rank/top', array('school_type' => $school_type, 'district' => 0, 'cate' => 1));
        //私立学校
        $list['ps'] = F::api('/Rank/top', array('school_type' => $school_type, 'district' => 0, 'cate' => 2));

        $districtList = CFG::school('location', 'city', '289', 'district');

        $did = array_shift(array_keys($districtList));

        //公立学校才有区域排名
        $list['district'] = F::api('/Rank/top', array('school_type' => $school_type, 'district' => $did, 'cate' => 1));

        $this->getView()->assign(compact(['list', 'districtList', 'school_type']));
    }

    /**
     * 按区排名
     */
    public function rankPartOfDistrictAction()
    {
        $did = V('g:did');

        $districtList = CFG::school('location', 'city', 289, 'district');

        if (!isset($districtList[$did])) {
            F::ajaxRst(false, '10000', '');
        }

        $school_type = 3;//中学

        $rankOfDistrict = F::api('/Rank/top', array('school_type' => $school_type, 'district' => $did, 'cate' => 1));

        $this->getView()->assign('rankOfDistrict',
            empty($rankOfDistrict[$school_type]) ? array() : $rankOfDistrict[$school_type]);
        $html = $this->getView()->render('school/rankPartOfDistrict.html');

        F::ajaxRst($html);
    }

    /**
     * 升学指导
     */
    public function guideAction()
    {
        $type = (int)V('g:type'); //1特长生; 2民校推荐
        $step = (int)V('g:step');


        if (!in_array($type, range(0, 2)) || !in_array($step, range(0, 3))) {
            F::redirect(F::URL('/Cz/School/guide'));
        }

        $result = array();

        $form = DIBuilder::make('Html\Form', ['model' => V('g')]);

        if ($type == 1) { //特长生招生

            //第一步,显示筛选选项
            //区域列表
            $districtList = CFG::school('location', 'city', 289, 'district');

            //特长生选项
            $admitForteList = CFG::school('admit_forte');
            $this->getView()->assign(compact('districtList', 'admitForteList', 'form'));

            //第二步
            if ($step == 2) {
                $district = (int)V('p:district');
                $t = (int)V('p:t'); //type
                $c = (int)V('p:c'); //cate
                $rs = F::api('sphinx:/school/search/cz_school', array('district' => $district, 'count' => 100));
                $sids = !empty($rs['ids']) ? $rs['ids'] : array();

                //$rs = F::api('/Search/czAdmitForte', array('sid'=>$sids, 'type'=>$t, 'cate'=>$c));
                $rs = F::api('/Cz/Admitforte/listByCond', array('type' => $t, 'cate' => $c, 'limit' => 300));
                $schoolInfo = F::api('/Cz/School/getBatch', array('ids' => $sids));
                foreach ($rs['list'] as $_item) {
                    if (!in_array($_item['sid'], $sids)) {
                        continue;
                    }
                    $_item['sInfo'] = array(
                        'id' => $schoolInfo[$_item['sid']]['id'],
                        'name' => $schoolInfo[$_item['sid']]['name']
                    );
                    $result[$_item['year']][] = $_item;
                }

                $this->getView()->assign(compact('t', 'c'));

                asort($result);
            }
        } elseif ($type == 2) { //民校推荐
            //第一步，显示筛选选项
            $pstypeList = CFG::school('school', 'pstype');

            //第二步
            if ($step == 2) {
                $rid = V('p:rid', array());
                if (!is_array($rid)) {
                    $rid = explode(',', $rid);
                }

                $ridAllow = array_keys($pstypeList);
                $rid = array_intersect($rid, $ridAllow);
                if (!empty($rid)) {
                    $result = F::api('/Search/cz', array('cate' => 2, 'pstype' => implode(',', $rid)));
                }
            }

            $this->getView()->assign(compact(['pstypeList', 'form']));
        }

        if ($step == 2 && empty($result)) {
            //F::err404('', 'Cz');
        }

        $this->getView()->assign(compact(['type', 'step', 'result']));
    }
}
