<?php
namespace Presenters\Teacher;

use \Presenters\AbstractModelPresenter;

class Teacher extends AbstractModelPresenter
{

    function __toString() {

    }

    //获取教师状态
    public function getStatus() {
        $return = '';

        switch($this->_model->status) {
            case 0:
                $return = '正常';
            break;
            case 1:
                $return = '停用';
            break;
            case -1:
                $return = '封禁';
            break;
        }

        return $return;
    }

    //ID补足4位
    public function idPad() {
        return str_pad($this->_model->id, 6, '0', STR_PAD_LEFT);
    }
    
    //获取教授科目
    public function getSubject($tplid=''){
        $data = NY('Teacher_TeacherModel')->explainSubject($this->_model->subject);
        $data = $this->_dataRender($tplid, $data);
        return $data;
    }

    //获取教授年级
    public function getGrade($tplid='') {
        $data = NY('Teacher_TeacherModel')->explainGrade($this->_model->grade);
        $data = $this->_dataRender($tplid, $data);
        return $data;
    }

    //获取教授学段
    public function getSchoolTypes($tplid='') {
        $data = NY('Teacher_TeacherModel')->explainSchoolTypes($this->_model->school_types);
        $data = $this->_dataRender($tplid, $data);
        return $data;
    }

    //获取教师认证数据
    public function getCert($tplid='') {
        $data = NY('Teacher_TeacherModel')->explainCert($this->_model->cert);
        $data = $this->_dataRender($tplid, $data);
        return $data;
    }

    //获取教师标签数据
    public function getTags($tplid='') {
        $data = $this->_model->tags;
        $data = $this->_dataRender($tplid, $data);
        return $data;
    }

    public function getTrainingCenter($tplid='') {
        $data = NY('Teacher_TeacherModel')->explainTrainingCenter($this->_model->venue);
        $data = $this->_dataRender($tplid, $data);
        return $data;
    }

    //教师星级数据处理
    public function htmlStar(){
        $star_html = '<span class="iconfont"></span><span class="iconfont"></span><span class="iconfont"></span><span class="iconfont"></span><span class="iconfont"></span>';
        return $star_html;
    }

    //年级数据显示处理
    public function htmlGrade() {
        return implode('、', $this->getGrade());
    }

    //学段数据显示处理
    public function htmlSchoolTypes() {
        //return implode('、', $this->getSchoolTypes());
         return \CFG::teacher('school_types', (int)$this->_model->school_types);
    }

    //科目数据显示处理
    public function htmlSubject() {
        return implode('、', $this->getSubject());
    }

    public function getAddress() {
        return \CFG::teacher('trainingCenter', isset($this->_model->venue[0]) ? $this->_model->venue[0]:0, 'address');
    }


    private function _dataRender($tplid, $data) {
        $tmp = '';
        switch($tplid) {
            case 1:
                $tmp = $data ? '<li>'.implode('</li><li>', $data).'</li>':'';
            break;
            case 2:
                foreach($data as $id=>$name){
                    $tmp .= "<option value='{$id}'>{$name}</option>";
                }
            break;
            case 3:
                $tmp = implode('/', $data);
            break;
            default:
                $tmp = $data;
            break;

        }

        return $tmp;
    }

    //获取价评
    public function getEvaluate($evaluate){

        $return = '';
        switch($evaluate){
            case 1:
                $return = '差评';
            break;

            case 3:
                $return = '中评';
            break;

            case 5:
                $return = '好评';
            break;
        }
        return $return;
    }
}
