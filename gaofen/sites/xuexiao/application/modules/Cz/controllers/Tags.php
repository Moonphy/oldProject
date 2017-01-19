<?php

class TagsController extends Yaf_Controller_Abstract
{

    public function listAction()
    {
        $model = NY('Cz_SchoolModel');
        
        $inputs['city'] = 289;
        $inputs['page'] = (int)V('g:page', 1);
        $inputs['tags'] = (int)V('g:tagid');

        $tagname = '';
        if(empty($inputs['tags']) || empty($tagname = $model->getTagName($inputs['tags']))) {
            F::err404('参数不正确');
        }

        //学校列表
        $schools = $model->getSchools(array_except($inputs, ['page']));

        //相关标签列表
        $relTags = $model->getTags($model->getGidByTid($inputs['tags']), [$inputs['tags']]);

        $this->getView()->assign(compact(['schools', 'tagname', 'relTags']));
    }
}
