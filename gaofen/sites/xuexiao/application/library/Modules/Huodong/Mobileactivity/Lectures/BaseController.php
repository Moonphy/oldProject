<?php 

namespace Modules\Huodong\Mobileactivity\Lectures;

use Yaf_Controller_Abstract;
use Service\ThirdParty\WeixinJssdk;
use F;
use SchoolType;

class BaseController extends Yaf_Controller_Abstract{

	protected $school_type = null;

	protected $prefix = 'huodong_m:/huodong/mobileactivity_lectures';

	public function init(){
		// 微信jssdk
		$jsSdk = new WeixinJssdk();
		// 获取并输出微信config配置
		$this->wxConfig=$jsSdk->getCfg();
		$this->getView()->assign('wxConfig',json_encode($jsSdk->getCfg()));

		// 映射并实例化lectures模型
		$this->model=NY('Huodong_Mobileactivity_LecturesModel');  

        $this->assignNavLink();    
        
	}

    public function setSchoolType($schoolType=null) {
        $this->school_type= $schoolType;

        return $this;
    }

    public function assignNavLink($schoolType=null) {
        if($schoolType) {
            $nav_link=$this->model->getNav($schoolType);
        }else{
            $schoolType = $this->school_type;
            $nav_link=$this->model->getNav($schoolType);
        }

        $obj=new SchoolType;
        $type=$obj->toAlias($schoolType);

        $this->getView()->assign('nav_link',$nav_link)
             ->assign('school_type',$type);
        return $this;
    }

	/**
     * [err 错误结果返回]
     * @param  string     $err   [错误信息]
     * @param  integer    $errno [错误代码]
     * @param  [type]     $res   [查询结果]
     * @param  [type]     $need_exit   [是否需要终止]
     * @return [type]            [错误结果返回]
     * @author ken
     * @date   2016-08-03
     */
    protected function err($err='非法操作',$errno=400004,$res=null,$need_exit=false){
        $err=[
            'rst'=>['res'=>$res],
            'errno'=>$errno,
            'err'=>urlencode($err)
        ];
        echo urldecode(json_encode($err));
        if($need_exit){
            exit;
        }
    }

    /**
     * [getLeftOver 距离活动结束时间]
     * @param  [type]     $etime [description]
     * @return [type]            [description]
     * @author ken
     * @date   2016-08-03
     */
	protected function getLeftOver($etime) {
	  return $etime - time();
	}
}