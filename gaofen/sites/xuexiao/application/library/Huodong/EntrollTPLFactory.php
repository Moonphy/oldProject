<?php
/**
 * 自定义活动模板工厂类
 */
class Huodong_EntrollTPLFactory
{
    public static function make(stdClass $entroll)
    {
        $name = $entroll->name;
        //$title中前缀是否带有“是否”二字
        $title=mb_substr($entroll->title,0,2,'utf-8');

        $tplFilePath = BASEPATH.'/application/modules/Huodong/views/';

        $includePath = 'mobileactivity/lectures/common/form/'.$name.'.html';

        if (file_exists($tplFilePath.$includePath)) {
            return $includePath;
        }else if($title=='是否'){
            return 'mobileactivity/lectures/common/form/ext_select.html';
        }else{
            return 'mobileactivity/lectures/common/form/ext.html';
        }
    }
}