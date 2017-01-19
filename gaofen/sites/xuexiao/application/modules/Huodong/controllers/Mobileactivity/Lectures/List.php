<?php 

use Modules\Huodong\Mobileactivity\Lectures\BaseController as Controller;
use Cache\Redis;

class Mobileactivity_Lectures_ListController extends Controller {

	public $title="高分活动 - 中小学活动平台";

    public $description="高分活动汇集来自顶尖辅导机构、名师大咖精彩活动";

    public function init() {
        $this->setSchoolType(V('G:school_type', 3));

        parent::init();

        $this->redis = 'lecture';
        $this->cache = Redis::getInstance('huodong');

        // 设置网站标题
        $this->getView()->assign('title',$this->title);
        // 设置网站description
        $this->getView()->assign('description',$this->description);
    }

    /**
     * [indexAction 活动列表页]
     * @return [type]     [description]
     * @author ken
     * @date   2016-07-17
     */
    public function indexAction() {

        $info=$this->getLectureListAction();
        // F::dump($info);exit;

        $this->getView()->assign('lectures_info',$this->getLectureListAction());

        $this->getView()->assign('self_link',F::URL("{$this->prefix}_list/index",['school_type'=>$this->school_type]));
    }


    /**
     * [getLectureListAction 获取小、初、高对应讲座信息]
     * @param  [type]     $lecture_id [description]
     * @return [type]                 [description]
     * @author ken
     * @date   2016-07-25
     */
    private function getLectureListAction(){
        if($this->school_type==1){
            $data=['grade'=>'10,11,12'];
        }else if($this->school_type==2){
            $data=['grade'=>'7,8,9'];
        }else{
            $data=['grade'=>'1,2,3,4,5,6'];
        }
        $data['count']=10;
       // 获取讲座列表信息
        $lectures=F::api('cms:/lectures/list',$data);

        foreach ($lectures['list'] as $val) {
            $lectures_info[]=[
                'id'=>$val['id'],
                'title'=>$val['title'],
                'cover'=>GAOFEN_STATIC.'/attachs/'.$val['cover'],
                'startime'=>$this->model->dateFormat($val, 'startime'),
                'endtime'=>$this->model->dateFormat($val, 'endtime'),
                'endtime_stamp'=>$val['endtime'],
                'expiration'=>$this->model->dateFormat($val, 'expiration'),
                'expiration_stamp'=>$val['expiration'],
                // 活动名额
                'quota'=>$val['quota'],
                // 已参加人数+虚拟参加人数
                'applynum'=>$this->model->getEnrollNum($val),
                // 剩余名额
                'delta_applynum'=>$this->model->getCanJoinNum($val),
                'detail_link'=>$this->model->getDetailLink($val, $this->school_type),
                'status'   => $this->model->getStatus($val),
                'status_class' => $this->model->getStatus($val, 'class'),
                'isEnd'   =>$this->model->isEnd($val),
                
            ];
        }

        return $lectures_info;
    }

    /**
     * [testAction description]
     * @return [type]     [description]
     * @author ken
     * @date   2016-07-26
     */
    public function testAction(){

        // echo $this->traitTest();

        exit;
    }
}