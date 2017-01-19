<?php

class Dx_SchoolModel
{
    public function getSpecificSchools()
    {
        $school_tj = array(
                          '10558'=>array('name'=>'中山大学','cover'=>'sina/10558.jpg', 'zs'=>'广东', 'pid'=>'19'),
                          '10384'=>array('name'=>'厦门大学','cover'=>'sina/10384.jpg', 'zs'=>'福建', 'pid'=>'13'),
                          '10486'=>array('name'=>'武汉大学','cover'=>'sina/10486.jpg', 'zs'=>'湖北', 'pid'=>'17'),                          
                          '10001'=>array('name'=>'北京大学','cover'=>'sina/10001.jpg', 'zs'=>'北京', 'pid'=>'1'),
                          '11945'=>array('name'=>'华中科技大学','cover'=>'sina/11945.jpg', 'zs'=>'湖北', 'pid'=>'17'),
                          '11942'=>array('name'=>'中南大学','cover'=>'sina/11942.jpg', 'zs'=>'湖南', 'pid'=>'18'),
                          '10559'=>array('name'=>'暨南大学','cover'=>'sina/10559.jpg', 'zs'=>'广东', 'pid'=>'19'),
                          '10294'=>array('name'=>'河海大学','cover'=>'sina/10294.jpg', 'zs'=>'江苏', 'pid'=>'10'),
                          '11901'=>array('name'=>'四川大学','cover'=>'sina/11901.jpg', 'zs'=>'四川', 'pid'=>'23'),);
        $ds = array(
                    '1' => '北京',
                    '9' => '上海',
                    '6' => '辽宁',
                    '19' => '广东',
                    '10' => '江苏',
                    '11' => '浙江',
                    '23' => '四川',
                    '17' => '湖北',
                    '18' => '湖南',
                    '13' => '福建',
                    '15' => '山东',
                    '45056' => '港澳台',
                    );

        return ['ds' => $ds, 'school_tj' => sub_array_to_orm($school_tj, 'ORM\CZ\School')];
    }
}