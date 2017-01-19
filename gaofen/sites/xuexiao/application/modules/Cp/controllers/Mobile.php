<?php

/**
 * 移动版CP控制器
 * User: timsims
 * Date: 15/4/14
 * Time: 下午5:32
 */
use Cache\Redis;

class MobileController extends Yaf_Controller_Abstract
{
    protected $_model;
    protected $_schoolType;

    private $redis_prefix='cp_';
    private $common_cache_time=300;

    use \Traits\BackwardTrait;

    protected function init()
    {

//        \F::setEnv('product');
        $this->_schoolType = schoolType();

        $repo = DIBuilder::make('Modules\Cp\PostRepo');

        $this->_model = DIBuilder::make('Cp_PostModel',
            ['repo' => $repo, 'schoolType' => $this->_schoolType]);
    }


    public function indexAction()
    {
        // 学段新闻
        $posts = $this->_model->getHotNews();

        // 学段活动
        $repo = DIBuilder::make('Modules\Cms\HuodongRepo');
        $huodongModel = DIBuilder::make('Cms_HuodongModel', ['repo' => $repo]);
        $huodongs = $huodongModel->findByGrade(2);

        $repo = DIBuilder::make('Modules\Baike\CategoryRepo');
        $baikeCategoryModel = DIBuilder::make('Baike_CategoryModel', ['repo' => $repo]);
        $baikeCateories = $baikeCategoryModel->findBySchoolType();

        // 初中库
        $schools = [
            [
                'id' => 764,
                'name' => '育才实验',
            ],
            [
                'id' => 314,
                'name' => '中应元小学'
            ],
            [
                'id' => 62,
                'name' => '广外'
            ],
            [
                'id' => 315,
                'name' => '六中珠江'
            ],
            [
                'id' => 91,
                'name' => '省实附中'
            ],
            [
                'id' => 308,
                'name' => '白云广雅'
            ],
        ];
        $schools = sub_array_to_orm($schools, 'ORM\CZ\School');

        $this->getView()->assign(compact('posts', 'huodongs', 'schools', 'baikeCateories'));
        $this->getView()->assign('backwardLink', $this->backwardLink('mobi:/mobile/index', []));

        $this->getView()->assign('detail_url',F::URL('huodong_m:/huodong/mobileactivity_lectures_detail/index'));
    }

    /**
     * 资讯首页
     */
    public function listAction()
    {
        $page = V('G:page', 1);

        $posts = $this->_model->getList($page, 20);

        $this->getView()->assign(compact('posts'));
        $this->getView()->assign('backwardLink',
            $this->backwardLink('cp:/cp/mobile/index', ['school_type' => $this->_schoolType->toValue()]));
    }

    /**
     * 资讯详情页
     */
    public function viewAction()
    {
        $postId = V('G:id', 0);
        $page = V('G:page', 1);
        $this->getRequest()->setParam('page', $page);

        // 设置redis
        $redis_key = $this->redis_prefix.'cp_gf_data';
        $this->cache = Redis::getInstance('cp');

        try {

            $post = $this->_model->getArticle($postId, $page);

            $this->_schoolType->setSchoolType($post->_schoolType);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {

            $msg = '你所访问的文章不存在';

            F::err404(compact('msg', 'backwardLink'), 'cp');
        }

        // 高分家长入口数据
        $i_parents=$this->cache->get($redis_key);
        // F::dump(json_encode($i_parents));exit;

        if(!$i_parents||$i_parents=='false'){
            $i_parents=F::api('cp:/post/kwlink', ['kwname'=>'高分家长-资讯页推荐链接', 'limit'=>3])['rst'];
            $this->cache->setex($redis_key,$this->common_cache_time, json_encode(serialize($i_parents)));
        }else{
            $i_parents=unserialize(json_decode($i_parents));
            // F::dump($i_parents);
            if($i_parents==null){
                $msg = '你所访问的文章不存在';
                F::err404(compact('msg', 'backwardLink'), 'cp');
            }
        }

        $repo = DIBuilder::make('Modules\Cms\HuodongRepo');
        $huodongModel = DIBuilder::make('Cms_HuodongModel', ['repo' => $repo]);
        $huodongs = $huodongModel->findByGrade(2);

        $weixinCfg = DIBuilder::make('Modules\Cp\ShareObject');
        $backwardLink = $this->backwardLink('cp:/cp/mobile/list', ['school_type' => $this->_schoolType->toValue()]);

        $this->getView()->assign(compact('post', 'huodongs', 'backwardLink', 'weixinCfg','i_parents'));

    }


}
