<?php 

use Modules\Huodong\Mobileactivity\Lectures\BaseController as Controller;
use Cache\Redis;

class Mobileactivity_Lectures_DetailController extends Controller {

	public $title;

    public function init() {
        $this->setSchoolType(V('G:school_type'));

        parent::init();

        $this->redis = 'lecture';
        $this->cache = Redis::getInstance('huodong');
    }

    /**
     * [indexAction 活动报名页]
     * @return [type]     [description]
     * @author ken
     * @date   2016-07-17
     */
    public function indexAction() {

        $lecture_id=V('g:id', null);

        // 获取讲座信息
        $lecture_info=$this->getLectureInfo($lecture_id);

        // school_type不存在时，判断内容年级对应导航
        if(!$this->school_type){
            if(in_array($lecture_info['grade'], range(10, 12))){
                $this->setSchoolType(1);
            }elseif(in_array($lecture_info['grade'], range(7, 9))){
                $this->setSchoolType(2);
            }else{
                $this->setSchoolType(3);
            }

            $this->assignNavLink();
        }

        // 获取虚拟用户
        if(!empty($this->join_user_cheat($lecture_info['init_join_users']))){
            $cheat_users=$this->join_user_cheat($lecture_info['init_join_users']);
        }else{
            $cheat_users=array();
        }

        // 获取实际参加的用户
        $true_users=$this->getLectureJoin($lecture_id);
        if(!empty($this->getLectureJoin($lecture_id))){
            $true_users=$this->getLectureJoin($lecture_id);
        }else{
            $true_users=array();
        }

        //合计后的用户
        $all_users=array_merge($true_users,$cheat_users);

        // 限制输出六个最近报名用户
        $join_user=array();
        foreach ($all_users as $key => $value) {
            if($key<6){
                $join_user[]=$value;
            }
        }
        // 参加用户
        $this->getView()->assign('join_user',$join_user);


        //判断名额是否已满或者是否已过期
        ($lecture_info['delta_applynum']<1 || $lecture_info['expiration_stamp']<time())?$apply_signup=0:$apply_signup=1;
        $this->getView()->assign('apply_signup',$apply_signup);

        // 讲座信息
        $this->getView()->assign('lecture_info',$lecture_info);

        // 设置网站链接
        $this->getView()->assign('links',[
            //http://dev.xuexiao.gaofen.com/huodong/mobileactivity_lecture_entry/index/?id=22
            'entry'=>F::URL("{$this->prefix}_entry/index",['id'=>$lecture_id,'school_type'=>$this->school_type]),
            'detail'=>F::URL("{$this->prefix}_detail/index",['id'=>$lecture_id,'school_type'=>$this->school_type]),
        ]);

        // 分享
        isset($lecture_info['ext_data']['wxshare_title'])?($share_title=$lecture_info['ext_data']['wxshare_title']):($share_title='');
        isset($lecture_info['ext_data']['wxshare_content'])?($share_content=$lecture_info['ext_data']['wxshare_content']):($share_content='');
        (isset($lecture_info['cover'])&&$lecture_info['cover']!='')?$share_image=$lecture_info['cover']:$share_image['cover']=GAOFEN_STATIC.'/html/mobile/images/wxartlogo.jpg';
        $share_link=F::URL("{$this->prefix}_detail/index",['id'=>$lecture_id,'school_type'=>$this->school_type]);
        $this->getView()->assign('share_data',[
            'title'=>$share_title,
            'desc'=>$share_content,
            'imgUrl'=>$share_image,
            'link'=>$share_link
        ]);

        // 设置网站标题
        $this->getView()->assign('title',$share_title);
        // 设置网站description
        $this->getView()->assign('description',$share_content);
    }

    /**
     * [getLectureInfo 获取讲座详情信息]
     * @param  [type]     $lecture_id [讲座id]
     * @return [type]                 [查询结果]
     * @author ken
     * @date   2016-07-20
     */
    private function getLectureInfo($lecture_id){
    	
    	$lecture_info=F::api('cms:/lectures/get', ['id'=>$lecture_id]);

        if(!isset($lecture_info['id'])){
            exit('非法操作');
        }

        if(!empty($lecture_info)){
            // 主办方数据
            $org=$lecture_info['org'];
            
            $resData=[
                'title'=>$lecture_info['title'],
                'cover'=>GAOFEN_STATIC.'/attachs/'.$lecture_info['cover'],
                'startime'=>$this->model->dateFormat($lecture_info, 'startime'),
                'endtime'=>$this->model->dateFormat($lecture_info, 'endtime'),
                'expiration'=>$this->model->dateFormat($lecture_info, 'expiration'),
                'expiration_stamp'=>$lecture_info['expiration'],
                // 活动名额
                'quota'=>$lecture_info['quota'],
                // 已参加人数+虚拟参加人数
                'applynum'=>$this->model->getEnrollNum($lecture_info),
                // 剩余名额
                'delta_applynum'=>$this->model->getCanJoinNum($lecture_info),
                // 主办方名称
                'agency'=>$org['agency'],
                'address'=>$lecture_info['address'],
                // 活动费用
                'cost'=>$lecture_info['cost']?$lecture_info['cost']:'免费',
                // 活动特点
                'feature'=>$lecture_info['feature'],
                // 活动内容
                'content'=>$lecture_info['content'],
                // 虚拟参加用户
                'init_join_users'=>$lecture_info['init_join_users'],
                'ext_data'=>$lecture_info['ext_data'],
                'grade' => array_shift(array_keys(\F::parseFlag($lecture_info['grade']))),
            ];
            return $resData;
        }
    }

    /**
     * [getLectureJoin 查询LectureJoin信息]
     * @return [type]     [参加讲座的用户列表]
     * @author ken
     * @date   2016-07-21
     */
    private function getLectureJoin($lecture_id){

        $field='`id`,`lecid`,`dateline`,`realname`';
        $where=" `state`=1 AND `lecid`={$lecture_id} ";
        $order_by='`dateline` desc ';
        $limit="6";

        $join_res=F::api('cms:/lectures/join_get',[
            'field'=>isset($field)?$field:'',
            'where'=>isset($where)?$where:'',
            'order_by'=>isset($order_by)?$order_by:'',
            'limit'=>isset($limit)?$limit:''
        ]);

        if(isset($join_res[0])){
            $join_info=$join_res[0];
        }else{
            $join_info=array();
        }

        //重构模板所需要的数组(多久前报名的用户)
        $join_user=array();
        if(!empty($join_info)){
            foreach ($join_info as $key => $val) {
                $join_user[$key]['realname']=mb_substr($val['realname'],0,1,'utf-8').'**';
                $join_user[$key]['join_time']=$this->joinTime($val['dateline']);
            }
        }

        return $join_user;
    }

    /**
     * [join_user_cheat 虚拟用户]
     * @param  [type]     $lecture_id [讲座id]
     * @return [type]                 [虚拟用户]
     * @author ken
     * @date   2016-07-25
     */
    private function join_user_cheat($init_join_users=0){
        $cheat_join_users=array();
        if($init_join_users){
            $init_join_users=explode(PHP_EOL, $init_join_users);
            foreach ($init_join_users as $key => $val) {
                $cheat_join_users[$key]['realname']=mb_substr(explode('|', $val)[0],0,1,'utf-8').'**';
                $cheat_join_users[$key]['join_time']=explode('|', $val)[1];
            }
        }
        return $cheat_join_users;
    }

    /**
     * [joinTime 报名时间]
     * @param  [type]     $join_time [报名时间]
     * @return [type]                [报名时间距现在时间的结果]
     * @author ken
     * @date   2016-07-21
     */
    private function joinTime($join_time){

        $d_time=time()-$join_time;
        
        $five_min=60*5;
        $one_hour=60*60;
        $one_day=60*60*24;

        if($d_time>$five_min&&$d_time<=$one_hour){
            return '5分钟前';
        }else if($d_time>$one_hour&&$d_time<=$one_day){
            return '1小时前';
        }else if($d_time>$one_day){
            return '1天前';
        }else{
            return '刚刚';
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