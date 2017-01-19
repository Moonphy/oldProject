<?php

class SchoolController extends Yaf_Controller_Abstract {

    public function init() {
        $_cityCookieName = '_cty';
        $this->_city = V('g:city')?:V('c:'.$_cityCookieName, 289);
        if(empty(CFG::school('location', 'city', $this->_city, 'name'))) {
            $this->_city = 289;
        }
        F::setCookie($_cityCookieName, $this->_city);
    }

    /**
     * 首页
     * @return [type] [description]
     */
    public function indexAction() {
        /**
         * 初中库查找推荐的学校
         */
        $schools = NY('Cz_SchoolModel')
        ->getSpecificSchools(['top' => 1, 'city'=>$this->_city], 10);

        $city = $this->_city;

        $this->getView()->assign(compact('schools', 'city'));
    }

    /**
     * 列表页
     * @return [type] [description]
     */
    public function listAction()
    {
        $model = NY('Cz_SchoolModel');
        $property = V('g:property');
        $district = V('g:district');

        /**
         * 资料
         */
        $filters = $model->getFilters(['cate', 'attype'], ['city'=>$this->_city]);

        /**
         * 学校资料
         */
        $inputs = V('g');
        $inputs['city'] = $this->_city;
        $schools = $model->getSchools(array_except($inputs, ['page']));

        $this->getView()->assign(compact(['filters', 'schools', 'property', 'district']));
    }

    /**
     * 详细页
     * @return [type] [description]
     */
	public function viewAction() {
        $id = V('G:id');
        $display = V('g:display'); //分组信息内容,默认招生信息

        $info = F::api('/Cz/School/get', ['id'=>$id, '_autoIncView'=>true]);

        if(empty($info) || empty($info['cz_state']) || !empty($info['deleted_at']) || $this->_city!=$info['city']) {
            F::err404('数据不存在', 'Czweixin');
        }

        $info['tags'] = NY('Cz_SchoolModel')->getTagByIds($info['tags']);

        //入学途径选项列表
        $attypeList = CFG::school('school', 'attype');


        //分组信息内容
        $expertTitle = $display=='all'?[]:['招生对象','录取分数','升学成绩'];

        //入学途径
        $_attype = array();
        foreach($info['attype'] as $_at){
            $_attype[] = $attypeList[$_at];
        } 
        $attypeStr = implode('，', $_attype);

        $infoList = '';
        if($expertTitle) { //只显部份指定内容块
            $infoList .= F::com('SchoolInfo')->listCzInfo($info, 1, 'czinfo_mobi', array('expertTitle'=>$expertTitle, 'attypeStr'=>$attypeStr)); //学校实力
            $infoList .= F::com('SchoolInfo')->listCzInfo($info, 2, 'czinfo_mobi', array('expertTitle'=>$expertTitle, 'attypeStr'=>($infoList?'':$attypeStr))); //招生信息
        }else{
            $infoList .= F::com('SchoolInfo')->listCzInfo($info, 1, 'czinfo_mobi', array('attypeStr'=>$attypeStr)); //学校实力
            $infoList .= F::com('SchoolInfo')->listCzInfo($info, 2, 'czinfo_mobi', array('attypeStr'=>($infoList?'':$attypeStr))); //招生信息,attypeStr 冗余处理
            $infoList .= F::com('SchoolInfo')->listCzInfo($info, 3, 'czinfo_mobi', array('attypeStr'=>($infoList?'':$attypeStr))); //学生生活,attypeStr 冗余处理
        }

        // 是否关注
        // $isFollow = F::api('cz/feed/isFollow', ['uid' => Users::uid(), 'school_id' => $id]);

        $this->getView()->assign(compact(['info', 'attypeList', 'infoList', 'display']));
	}

    /**
     * 列表页ajax请求数据
     * @return [type] [description]
     */
    public function ajaxSchoolsAction()
    {
        Yaf_Dispatcher::getInstance()->disableView();
        /**
         * 学校资料
         */
        $model = NY('Cz_SchoolModel');

        $inputs = V('g');
        $inputs['city'] = $this->_city;
        $schools = $model->getSchools($inputs);

        if (isset($schools['error'])) {

            F::ajaxRst(null, $schools['errno'], $schools['error']);

        }

        $string = F::TPL('school/school.html', ['schools' => $schools['list']], 'Czweixin', true);

        if((int)V('g:page')<=1 && empty($schools['list'])) {
            $string = '<div class="tips-null">暂无学校，换个条件试试？</div>';
        }

        F::ajaxRst(['html' => $string,
                   'count' => count($schools['list']),
                   'total' => $schools['total']]);
    }

    /**
     * 图库
     * @return [type] [description]
     */
    public function albumAction() {
        $sid = V('g:sid');

        if(empty($sid)) {
            F::err404('', 'Czweixin');
        }

        $info = F::api('/Cz/School/get', array('id'=>$sid));

        if(empty($info) || empty($info['cz_state']) || !empty($info['deleted_at']) || $this->_city!=$info['city']) {
            F::err404('学校不存在', 'Czweixin');
        }
        $info['tags'] = NY('Cz_SchoolModel')->getTagByIds($info['tags']);

        $picList = F::api('/Cz/Pic/listByCond', array('sid'=>$sid));

        $this->getView()->assign(compact(['picList', 'info']));
    }


    /**
     * 资讯页
     * @return [type] [description]
     */
    public function articleAction() {
        $sid = V('g:sid');

        if(empty($sid)) {
            F::err404('', 'Czweixin');
        }

        $info = F::api('/Cz/School/get', array('id'=>$sid));

        if(empty($info) || empty($info['cz_state']) || !empty($info['deleted_at']) || $this->_city!=$info['city']) {
            F::err404('学校不存在', 'Czweixin');
        }

        $area_type = $this->_city==291?2:1;

        $articleList = F::com('SchoolInfo')->getArticleList(array('schoolName'=>$info['name'], 'school_type'=>1, 'area_type'=>$area_type));

        $this->getView()->assign(compact(['articleList', 'info']));
    }
}
