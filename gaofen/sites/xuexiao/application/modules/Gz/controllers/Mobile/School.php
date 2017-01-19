<?php
/**
 * @author: timsims
 * @package gaofen\gz\mobile
 */
include __DIR__.'/../School.php';

class Mobile_SchoolController extends SchoolController
{
    use \Traits\BackwardTrait;

    protected $_schoolType;

    public function init()
    {
        $this->_schoolType = schoolType();
        $this->_schoolType->setSchoolType(2);
    }

    /*
     * 学校首页
     */
    public function indexAction()
    {
        $schoolModel = new Gz_SchoolModel();

        /**
         * 广州重点高中
         */
        $schools = $schoolModel->getKeySchool();

        $this->getView()->assign('backwardLink',
            $this->backwardLink('/mobile/index', ['school_type' => $this->_schoolType->toValue()]));

        $this->getView()->assign(compact('schools'));
    }

    /*
     * 学校搜索页
     */
    public function listAction()
    {
        $model = new Gz_SchoolModel();

        /**
         * 筛选类型
         */
        $filters = $model->getFilters();

        $inputs = V('g');
        $inputs['city'] = 289;
        $inputs['orderby'] = 'views';
        $inputs['count'] = 10;
        $schools = $model->getSchools(array_except($inputs, ['page']));

        $form = DIBuilder::make('Html\Form');


        $this->getView()->assign(compact('form', 'schools', 'filters'));
        $this->getView()->assign('backwardLink',
            $this->backwardLink('/gz/mobile_school/index', ['school_type' => $this->_schoolType->toValue()]));

    }

    /*
     * 学校详细页
     */
    public function viewAction()
    {
        $id = V('G:id');
        $display = V('g:display'); //分组信息内容,默认招生信息

        $info = F::api('/Gz/School/get', ['id'=>$id, '_autoIncView'=>true]);

        if(empty($info) || empty($info['gz_state']) || !empty($info['deleted_at'])) {
            F::err404('数据不存在', 'Gz', 'mobile_404');
        }


        //分组信息内容
        $expertTitle = $display=='all'?[]:['独立批','提前批', '第一批', '第二批提前批', '第二批', '第三批', '高考成绩'];


        $infoList = '';
        if($expertTitle) { //只显部份指定内容块
            $infoList .= F::com('SchoolInfo')->listGzInfo($info, 7, 'gzinfo_mobi', array('expertTitle'=>$expertTitle)); //学校实力
            $infoList .= F::com('SchoolInfo')->listGzInfo($info, 8, 'gzinfo_mobi', array('expertTitle'=>$expertTitle)); //招生信息
        }else{
            $infoList .= F::com('SchoolInfo')->listGzInfo($info, 7, 'gzinfo_mobi', array()); //学校实力
            $infoList .= F::com('SchoolInfo')->listGzInfo($info, 8, 'gzinfo_mobi', array()); //招生信息,attypeStr 冗余处理
            $infoList .= F::com('SchoolInfo')->listGzInfo($info, 9, 'gzinfo_mobi', array()); //学生生活,attypeStr 冗余处理
        }

        // 是否关注
        // $isFollow = F::api('gz/feed/isFollow', ['uid' => Users::uid(), 'school_id' => $id]);

        $this->getView()->assign(compact(['info', 'infoList', 'display']));
    }

    /**
     * 资讯页
     */
    public function articleAction() {
        $sid = V('g:sid');

        if(empty($sid)) {
            F::err404('', 'Gz', 'mobile_404');
        }

        $info = F::api('/Gz/School/get', array('id'=>$sid));

        if(empty($info) || empty($info['gz_state']) || !empty($info['deleted_at'])) {
            F::err404('学校不存在', 'Gz', 'mobile_404');
        }

        $area_type = 1;

        $articleList = F::com('SchoolInfo')->getArticleList(array('schoolName'=>$info['name'], 'school_type'=>1, 'area_type'=>$area_type));

        $this->getView()->assign(compact('articleList', 'info'));

        $this->getView()->assign('backwardLink',
            $this->backwardLink('/gz/mobile_school/list', ['school_type' => $this->_schoolType->toValue()]));
    }

    public function albumAction()
    {
        parent::albumAction();
        $this->getView()->assign('backwardLink',
            $this->backwardLink('/gz/mobile_school/list', ['school_type' => $this->_schoolType->toValue()]));
    }


    /**
     * 列表页ajax请求数据
     */
    public function ajaxSchoolsAction()
    {
        Yaf_Dispatcher::getInstance()->disableView();
        /**
         * 学校资料
         */
        $model = NY('Gz_SchoolModel');

        $inputs = V('g');
        $inputs['city'] = 289; //$this->_city;
        $inputs['property'] = $inputs['gz_property'];
        $page = $inputs['page'];
        $schools = $model->getSchools($inputs, $page);

        if (isset($schools['error'])) {

            F::ajaxRst(null, $schools['errno'], $schools['error']);

        }

        $string = F::TPL('mobile/school/school.html', ['schools' => $schools['list']], 'Gz', true);

        if((int)V('g:page')<=1 && empty($schools['list'])) {
            $string = '<div class="tips-null">暂无学校，换个条件试试？</div>';
        }

        F::ajaxRst(['html' => $string,
                   'count' => count($schools['list']),
                   'total' => $schools['total']]);
    }

}