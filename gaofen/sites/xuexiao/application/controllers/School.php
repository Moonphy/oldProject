<?php

/**
 * Class SchoolController
 */
class SchoolController extends Yaf_Controller_Abstract
{
    /**
     * 新版学校首页
     */
    public function indexAction()
    {
        /**
         * 初中库查找推荐的学校，3间民校，3间公办
         */
        $public_schools = NY('Cz_SchoolModel')
            ->getSpecificSchools(['top' => 1, 'cate' => 1], 3);

        $private_schools = NY('Cz_SchoolModel')
            ->getSpecificSchools(['top' => 1, 'cate' => 2], 3);

        /**
         * 大学库和高中库使用静态数据
         */
        $high_schools = NY('Gz_SchoolModel')->getSpecificSchools();
        $colleges = NY('Dx_SchoolModel')->getSpecificSchools();

        $this->getView()
            ->assign(compact('public_schools', 'private_schools',
                'high_schools', 'colleges'));
    }
}
