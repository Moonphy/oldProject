<?php
use Modules\Teacher\TeacherClient;

class Teacher_TeacherModel
{
    //获取地区列表
    public function getLocation() {
        $params = func_get_args();
        $params = array_merge(['location'], $params);
        return CFG::teacherArgs($params);
    }

    public function getCurProvince($province='') {

        $default = 19; //默认省份

        if($province) {
            \F::setCookie('_goprovince', $province, time()+3600*24*30*12);
        }else{
            $province = \F::getCookie('_goprovince');
        }
        
        if(empty($this->getLocation('province', $province))) {
             $province = $default;
        }

        return $province;
    }

    public function getCurCity($city='') {
        $default = 80; //默认城市

        if($city) {
            \F::setCookie('_gocity', $city, time()+3600*24*30*12);
        }else{
            $city = \F::getCookie('_gocity');
        }        

        if(empty($this->getLocation('province',$this->getCurProvince(), 'city', $city))) {
            $city = $default;
        }

        return $city;
    }

    //获取科目列表
    public function explainSubject(array $subject) {
    	return array_exists_fetch($subject, CFG::teacher('subject'));
    }

    //获年级列表
    public function explainGrade(array $grade){
    	return array_exists_fetch($grade, CFG::teacher('grade'));
    }

    //学段
    public function explainSchoolTypes(array $school_types){
        return array_exists_fetch($school_types, CFG::teacher('school_types'));
    }

    //获取认证列表
    public function explainCert(array $cert){
    	return array_exists_fetch($cert, CFG::teacher('cert'));
    }

    //获年级列表
    public function explainTrainingCenter(array $trainingCenter){
        $cfg = CFG::teacher('trainingCenter');

        $result = array();
        foreach($trainingCenter as $v){
            $result[$v] = $cfg[$v]['TrainingCenterName'].'一对一';
        }

        return $result;
    }

    public function getFilters(array $except = [], $params = [])
    {
        static $list;

        if(empty($list)) {
            $province = empty($params['province']) ? 19 : $params['province'];
            $city = empty($params['city']) ? 80:$params['city'];
            // 所在区域
            $districtNormal = array(0=>'全部区域');
            $districtList = $this->getLocation('province', $province, 'city', $city, 'district');
            $districtList = $districtNormal+$districtList;

            // 学科
            $subjectNormal = array(0=>'全部学科');
            $subjectList = CFG::teacher('subject');
            $subjectList = $subjectNormal+$subjectList;
            

            // 年级
            $gradeNormal = array(0=>'全部年级');
            $gradeList = CFG::teacher('grade');
            $gradeList = $gradeNormal+$gradeList;
            

            //排序
            $sortNormal = array(0=>'智能排序');
            $sortList =  CFG::teacher('orderby');
            $sortList = $sortNormal+ $sortList;


            $list = [
             'district' => ['filter_name' => '所在区域', 'param_name' => 'district', 'list' => $districtList ],
             'subject' => ['filter_name' => '科目', 'param_name' => 'subject', 'list' => $subjectList ],
             'grade' => ['filter_name' => '年级', 'param_name' => 'grade', 'list' => $gradeList ],
             'orderby' => ['filter_name' => '排序', 'param_name' => 'orderby', 'list' => $sortList ],
            ];
        }

        return array_except($list, $except);
    }

    public function buildUrl(array $params, array $active=[], $uri = '/Teacher/Teacher/list') {
        $params = array_merge($active, $params);
        return F::URL($uri, $params);
    }

    /**
     * [filterFormat description]
     * @param  [string] $field 需要返回的项
     * @return [type]         [description]
     */
    public function filterFormat($field, $params) {
        $filters = $this->getFilters();

        if(!isset($filters[$field])) return false;

        $return = '';
        $fieldValue = (string)V('g:'.$field, '0');
        $params['page'] = 1;

        foreach($filters[$field]['list'] as $_k=>$_v){
            $class = ($fieldValue===(string)$_k)?'class="ui-option-selected"':'';
            //部份不需要坐标的排序值过滤掉Lat,lon，否则影响显示结果
            if($field=='orderby' && !in_array($_k, array('near', '', '0'))) {
                unset($params['lat'], $params['lon']);
            }
            $return .= '<li id="'.$field.'_'.$_k.'" '.$class.'><a href="'.$this->buildUrl([$field=>$_k], $params).'">'.$_v.'</a></li>'.PHP_EOL;
        }

        return $return;
    }

    public function fiterText($field){
        $filters = $this->getFilters();
        $fieldValue = V('g:'.$field);
        if($fieldValue){
            return isset($filters[$field]['list'][$fieldValue])?$filters[$field]['list'][$fieldValue]:$filters[$field]['filter_name'];
        }else{
            return isset($filters[$field]['filter_name'])?$filters[$field]['filter_name']:'';
        }
    }

    /**
     * 获取教师学科报价
     * @param  [type] $city    [description]
     * @param  [type] $grade   [description]
     * @param  [type] $subject [description]
     * $param   int $amount 数量
     * @return [type]          [description]
     */
    public function getPeriodPrices($city, $grade, $subject, $amount) {
        $client = new TeacherClient();
        $rs = $client->GetPeriodPricesByCityNid(
            [
                'cityNid'   => $city,
                'gradeNid'  => $grade,
                'subjectNid'=> $subject,
            ]
        );

        $result = ['perFee'=>0, 'totalFee'=>0, 'discountFee'=>0];

        if(!empty($rs->GetPeriodPricesByCityNidResult->PeriodPricesModel)) {
            $rs = $rs->GetPeriodPricesByCityNidResult->PeriodPricesModel;
            if(is_array($rs)){
                $rs = $rs[0];
            }

            $amount = (int)$amount;
            $perFee = $rs->PeriodPrice;
            $discountFee = floor($amount/20)*200;//每单优惠200 //$amount>=40?2*$perFee:0;
            $result['perFee'] = $perFee;
            $result['discountFee'] = $discountFee;
            $result['totalFee'] = $amount * $perFee - $discountFee;
        }

        return $result;
    }

}
