<?php
namespace Components;

use F;
/**
 * 面包屑
 */
class SchoolInfo
{
    function __construct(){
       
    }

    public function render($tplname, $data=array()) {
        if(!$tplname) {
            return 'templates\'s name can not empty!';
        }

        return (new \Yaf_View_Simple(BASEPATH. '/application/views'))
                ->render(str_replace('\\', '/', __CLASS__).'/'.$tplname.'.html', $data);
    }

    /**
     * 获取schoolinfo列表
     * @param  [type] $val  学校ID或学校/Cz/get的反回数据
     * @param  [type] $type [description]
     * @return [type] $tplparams      [模板用到的其它数据]
     */
    public function listCzInfo($val, $type, $tplname='czinfo', array $tplparams=[]) {
        if(is_numeric($val)) {
            $val = F::api('/Cz/School/get', array('id'=>$val));
        }

        if(empty($val['id']) || empty($val['name']) || !in_array($type, range(1,5))) {
            return false;
        }

        $info = F::api('/Cz/Info/listByCond', array('sid'=>$val['id'], 'type'=>$type));
        //组件名称
        $school_type = 3;

        $result = ['val', 'info', 'type', 'tplparams'];

        if($type==1) {//学校实力
            // 经验分享
            $tips = F::api('/cz/tip/getBatch', ['school_id' => $val['id'], 'page' => 1, 'limit' => 3]);
            $tips['list'] = sub_array_to_orm($tips['list'], 'ORM\CZ\Tip') ;

            array_push($result, 'tips');
        }elseif($type==2) {//招生信息
            //特长生数据处理
            $admitforte = array();//重组后的特长生数据
            if(!empty($info['list'][0]['data'])) {
                foreach($info['list'][0]['data'] as $_k=>$_v) {
                    if($_v['flag']=='admit_forte'){
                        foreach($_v['value'] as $_i=>$_o){
                            $admitforte[$_o['year']][$_o['type']][] = $_o['cate'];
                        }
                    }
                }
            }

            $admitforteList = \CFG::school('admit_forte');//$G_ADMIT_FORTE_LIST;
            array_push($result, 'admitforte', 'admitforteList');
        }elseif($type==3){//学生生活

           
        }elseif($type==4){//学校要闻
            $area_type = isset($tplparams['area_type'])?$tplparams['area_type']:0;
            $articleList = $this->getArticleList(array('schoolName'=>$val['oname'], 'school_type'=>$school_type, 'area_type'=>$area_type));
            array_push($result, 'articleList');
        }elseif($type==5){//资料推荐
            $docList = $this->getDocList(array('schoolName'=>$val['oname'], 'school_type'=>$school_type));
            $paperList = $this->getPaperList(array('schoolName'=>$val['oname'], 'school_type'=>$school_type), 50);
            
            array_push($result, 'docList', 'paperList');
        }

        return $this->render($tplname, compact($result));
    }

    /**
     * 获取schoolinfo列表
     * @param  [type] $val  学校ID或学校/Cz/get的反回数据
     * @param  [type] $type [description]
     * @return [type] $tplparams      [模板用到的其它数据]
     */
    public function listGzInfo($val, $type, $tplname='gzinfo', array $tplparams=[]) {
        if(is_numeric($val)) {
            $val = F::api('/Gz/School/get', array('id'=>$val));
        }

        if(empty($val['id']) || empty($val['name']) || !in_array($type, range(7,12))) {
            return false;
        }

        $info = F::api('/Gz/Info/listByCond', array('sid'=>$val['id'], 'type'=>$type));
        //组件名称
        $school_type = 2;

        $result = ['val', 'info', 'type', 'tplparams'];

        if($type==7) {//学校实力
            //录取批次
            $admitScore = array(); //录取批次数据重组
            if(!empty($info['list'][0]['data'])) {
                foreach($info['list'][0]['data'] as $_k=>$_v) {
                    if($_v['flag']=='gz_admit_score'){
                        foreach($_v['value'] as $_i=>$_o){
                            $admitScore[$_v['module_name']][$_o['year']][] = $_o;
                        }
                    }
                }
            }
            //krsort($admitScore);
            array_push($result, 'admitScore');
        }elseif($type==9) {//招生信息
            //特长生数据处理
            $admitforte = array();//重组后的特长生数据
            if(!empty($info['list'][0]['data'])) {
                foreach($info['list'][0]['data'] as $_k=>$_v) {
                    if($_v['flag']=='admit_forte'){
                        foreach($_v['value'] as $_i=>$_o){
                            $admitforte[$_o['year']][$_o['type']]['cate'][] = $_o['cate'];
                            $admitforte[$_o['year']][$_o['type']]['memo'][]= isset($_o['memo'])?$_o['memo']:'';
                        }
                    }
                }
            }

            
            $admitforteList = \CFG::school('admit_forte');//$G_ADMIT_FORTE_LIST;
            array_push($result, 'admitforte', 'admitforteList');
        }elseif($type==8){//高考成绩

           
        }elseif($type==11){//学校要闻
            $area_type = isset($tplparams['area_type'])?$tplparams['area_type']:0;
            $articleList = $this->getArticleList(array('schoolName'=>$val['oname'], 'school_type'=>$school_type, 'area_type'=>$area_type));
            array_push($result, 'articleList');
        }elseif($type==12){//资料推荐
            $docList = $this->getDocList(array('schoolName'=>$val['oname'], 'school_type'=>$school_type));
            $paperList = $this->getPaperList(array('schoolName'=>$val['oname'], 'school_type'=>$school_type), 50);
            
            array_push($result, 'docList', 'paperList');
        }

        return $this->render($tplname, compact($result));
    }

    //学校要闻
    /**
     * [_getArticleList description]
     * @param  array  $params array(  'schoolName'=>$schoolName, 'school_type'=>$school_type,
     *                                'area_type'=>$area_type (1.广州 2.深圳))
     * @param  integer $limit  [description]
     * @return [type]          [description]
     */
    public function getArticleList($params, $limit=8){

        $schoolName = $params['schoolName'];
        $school_type = $params['school_type'];
        $area_type = isset($params['area_type'])?:0;

        $key = 'art1:'.$school_type.':'.md5(__FILE__.':'.$schoolName);
        $articleList = \Cache::get($key);

        $getNum = $limit;//获取数据量
        if(empty($articleList)) {
            $_tmpAA = $_tmpAB = array('list'=>array(), 'total_number'=>0);
            $_tmpAA = F::api('cms:/search/article', array('relate_schools'=>1, 'school_type'=>$school_type, 'keyword'=>$schoolName, 'count'=>$getNum, 'area_type'=>$area_type, 'orderby'=>'post_date'));
            $noIds = array_column($_tmpAA['list'], 'ID');
            if($_tmpAA['total_number']<$getNum) {
                $leftNum = $getNum - $_tmpAA['total_number'];
                $_tmpAB = F::api('cms:/search/article', array('school_type'=>$school_type, 'keyword'=>$schoolName, 'count'=>$leftNum, 'area_type'=>$area_type, 'orderby'=>'post_date'));
                foreach($_tmpAB['list'] as $_k=>$_item) {
                    if(in_array($_item['ID'], $noIds)) {
                        unset($_tmpAB['list'][$_k]); //除掉推荐列表与默认列表重复数据
                    }
                }
            }
            $articleList = array('list'=>array_merge($_tmpAA['list'], $_tmpAB['list']),
                'total_number'=>($_tmpAA['total_number']+$_tmpAB['total_number']));
            \Cache::set($key, $articleList, 1800);
        }

        return $articleList;
    }

    //资料推荐
    public function getDocList($params, $limit=8) {

        $schoolName = $params['schoolName'];
        $school_type = $params['school_type'];

        $dockey = 'doc:'.$school_type.':'.md5(__FILE__.':'.$schoolName);
        $docList = \Cache::get($dockey);

        $getNum = $limit;//获取数据量
        if(empty($docList)) {
            $_tmpAA = $_tmpAB = array('list'=>array(), 'total_number'=>0);
            $_tmpAA = F::api('cms:/search/docs', array('relate_schools'=>1, 'school_type'=>$school_type, 'keyword'=>$schoolName, 'count'=>$getNum));
            $noIds = array_column($_tmpAA['list'], 'id');
            if($_tmpAA['total_number']<$getNum) {
                $leftNum = $getNum - $_tmpAA['total_number'];
                $_tmpAB = F::api('cms:/search/docs', array('school_type'=>$school_type, 'keyword'=>$schoolName, 'count'=>$leftNum));
                foreach($_tmpAB['list'] as $_k=>$_item) {
                    if(in_array($_item['id'], $noIds)) {
                        unset($_tmpAB['list'][$_k]); //除掉推荐列表与默认列表重复数据
                    }
                }
            }
            
            $docList = array('list'=>array_merge($_tmpAA['list'], $_tmpAB['list']),
                'total_number'=>($_tmpAA['total_number']+$_tmpAB['total_number']));
            \Cache::set($dockey, $docList, 1800);
        }

        return $docList;
    }

    //纸质试题
    public function getPaperList($params, $limit=8) {

        $schoolName = $params['schoolName'];
        $school_type = $params['school_type'];

        $paperkey = 'paper:'.$school_type.':'.md5(__FILE__.':'.$schoolName);
        $paperList = \Cache::get($paperkey);
        if(empty($paperList)) {
            $paperList = array();
            $_tmpBA = F::api('cms:/shop/paper/list', array('type'=>$school_type, 'count'=>$limit));
            //过滤未关联对应学校的纸质试题
            foreach($_tmpBA['list'] as $_k=>$_row) {
                if(empty($_row['ext'])) continue;
                $_ext = json_decode($_row['ext'], true);
                $rel_school = isset($_ext['rel_school'])?explode(',', $_ext['rel_school']):array();
                
                if(in_array($schoolName, $rel_school)) {
                    $paperList['list'][] = $_row;
                }
            }

            $paperList['total'] = !empty($paperList['list'])?count($paperList['list']):0;

            \Cache::set($paperkey, $paperList, 1800);
        }

        return $paperList;
    }

}