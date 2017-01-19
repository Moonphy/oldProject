<?php 

use Modules\Huodong\Mobileactivity\Lectures\BaseController as Controller;
use Cache\Redis;

class Mobileactivity_Lectures_EntryController extends Controller {

  protected $surplus;

  public $lecture_id;

  public $title="高分网移动版-活动报名页";

  public $description='';

  public function init() {

      // 获取年级段类型（小、初、高）
      $this->setSchoolType(V('G:school_type', 3));

      parent::init();

      $this->redis = 'lecture';
      $this->cache = Redis::getInstance('huodong');

      $this->lecture_id=V('g:id', null);

      //设置网页title
      $this->getView()->assign('title',$this->title);
      // 设置网站description
      $this->getView()->assign('description',$this->description);

  }

  /**
   * [indexAction 活动报名页]
   * @return [type]     [description]
   * @author ken
   * @date   2016-07-17
   */
  public function indexAction() {

    $from=(string)V('g:from','mobile');
    // 获取enroll信息
    $lectures_info=$this->getLecturesInfo($this->lecture_id);
    // F::dump($lectures_info);exit;
    // 显示模板
    $enrolls=$lectures_info['enroll'];
    // echo $enrolls;exit;
    
    // 剩余名额
    $this->surplus_num=$lectures_info['quota']-($lectures_info['applynum']+$lectures_info['cheat_applynum']);

    //加载表单模板
    $this->getView()->assign('enrolls',$this->tmplData($enrolls));

    $this->getView()->assign('info', $lectures_info);

    $this->getView()->assign('from', $from);

    $this->getView()->assign('detail_link',F::URL($this->prefix.'_detail/index',['id'=>$this->lecture_id,'school_type'=>$this->school_type]));
  }

  /**
   * [tmplData 加载表单模板的数据]
   * @param  [type]     $enroll [description]
   * @return [type]             [description]
   * @author ken
   * @date   2016-07-20
   */
  protected function tmplData($enrolls){

    //由于此处添加了自定义字段，导致模板添加的表单在费用表单下面，需要重构数组将费用的表单移到最后
    $enrolls_cost=array();
    $enrolls_data=array();
    $enrolls = json_decode($enrolls);
    foreach ($enrolls as $val) {
      if($val->title!='费用'){
        $enrolls_data[]=$val;
      }else{
        $enrolls_cost[]=$val;
      }
    }

    return array_merge($enrolls_data,$enrolls_cost);
  }

  /**
   * [getLecturesInfo 查询lectures信息]
   * @param  [type]     $lecture_id [id]
   * @return [type]                 [description]
   * @author ken
   * @date   2016-07-20
   */
  protected function getLecturesInfo($lecture_id){
    $lecture_info=F::api('cms:/lectures/get', ['id'=>$lecture_id]);
    // return $lecture_info['enroll'];
    return $lecture_info;
  }

  /**
   * [sign_up 报名]
   * @return [type]     [description]
   * @author ken
   * @date   2016-07-17
   */
  public function signUpAction(){
    $lecture_id=V('p:id',null);

    //大人参加人数
    $parentNum = (int)V('p:parentNum');

    //小孩参加人数
    $childNum = (int)V('p:childNum');

  	// 参加人数
  	$applynum = max($parentNum+$childNum, 1);
  	// 联系人
  	$realname=V('p:realname', null);
  	// 联系电话
    $phone=V('p:phone',null);
  	// 场次
  	$changci=V('p:changci', null);

    $from = V('p:from', 'mobile');

    //扩展属性
    $registration = V('p:registration', array());
  	
    if (empty($lecture_id)) {
      $this->err('活动id不能为空',100001,null,true);
    }

    if (empty($applynum)) {
      $this->err('请选择参加人数',100001,null,true);
    }

  	if (empty($realname)) {
      $this->err('联系人不能为空',100001,null,true);
    }
  	
  	if (!preg_match('/^1[3-9]\d{9}$/',$phone)) {
      $this->err('请填写正确的手机号码',100001,null,true);
    }

    $lecture_info = $this->getLecturesInfo($lecture_id);

    if(!$this->model->canJoin($lecture_info)) {
        $this->err('报名失败', 100001, null, true);
    }

  	// 参加讲座
  	$data=[
  		'id'=>$lecture_id,
  		'realname'=>$realname,
  		'applynum'=>$applynum,
  		'phone'=>$phone,
      'enroll'  => $registration,
      'from' => $from
  	];

    if(isset($changci)){
      $data['changci']=$changci;
    }

  	$insert_join=F::api('cms:/lectures/join', $data);

		if(isset($insert_join['id'])){
			echo F::ajaxRst([
				'res'=>'success'
			]);
		}else{
      $this->err('提交失败，请检查提交信息',100002,'fail',true);
    }
  }

  /**
   * [testAction 测试]
   * @return [type]     [description]
   * @author ken
   * @date   2016-07-18
   */
  public function testAction(){
  	$lecture_info=F::api('cms:/lectures/get', ['id'=>22]);
    $init_join_users=explode(PHP_EOL, $lecture_info['init_join_users']);
    $arr=array();
    foreach ($init_join_users as $key => $val) {
        $arr[$key]['realname']=explode('|', $val)[0];
        $arr[$key]['join_time']=explode('|', $val)[1];
    }

    echo '<pre>';
    print_r($lecture_info['ext_data']);exit;
  }
}