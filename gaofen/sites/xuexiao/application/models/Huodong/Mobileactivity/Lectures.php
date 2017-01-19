<?php 

class Huodong_Mobileactivity_LecturesModel {

	/**
	 * 获取已报名人数
	 * @param  [type] $info [description]
	 * @return [type]       [description]
	 */
	public function getEnrollNum($info) {
		return $info['applynum'] + $info['cheat_applynum'];
	}

	/**
	 * 获取可报名人数
	 * @param  [type] $info [description]
	 * @return [type]       [description]
	 */
	public function getCanJoinNum($info) {
		$canJoinNum = $info['quota'] - $this->getEnrollNum($info);
		return $canJoinNum > 0 ? $canJoinNum:0;
	}

	/**
	 * 是否可以参加
	 * @param  [type] $info [description]
	 * @return [type]       [description]
	 */
	public function canJoin($info) {
		if($this->getCanJoinNum($info) && $this->isEnrollStart($info) && !$this->isEnrollEnd($info)) {

			return true;
		}

		return false;
	}


	/**
	 * 是否报名已结束
	 * @param  [type]  $info [description]
	 * @return boolean       [description]
	 */
	public function isEnrollEnd($info) {
		if(time()>$info['expiration']) {
			return true;
		}
		return false;
	}
	
	/**
	 * 是否报名已开始
	 * @param  [type]  $info [description]
	 * @return boolean       [description]
	 */
	public function isEnrollStart($info) {
		if(time()>$info['begintime']) {
			return true;
		}

		return false;
	}

	/**
	 * 是否活动已结束
	 * @param  [type]  $info [description]
	 * @return boolean       [description]
	 */
	public function isEnd($info) {
		if(time()>$info['endtime']) {
			return true;
		}
		return false;
	}

	/**
	 * 是否活动已开始
	 * @param  [type]  $info [description]
	 * @return boolean       [description]
	 */
	public function isStart($info) {
		if(time()>$info['startime']) {
			return true;
		}

		return false;
	}

	/**
	 * 计算价络
	 * @param  [type]  $info     [description]
	 * @param  [type]  $childNum [description]
	 * @param  integer $adultNum [description]
	 * @return [type]            [description]
	 */
	public function calcPrice($info, $childNum=0, $adultNum=0) {
		$child_cost = $childNum * $info['child_cost'];
		$adult_cost = $adultNum * $info['adult_cost'];

		return $child_cost + $adult_cost;
	}

	/**
	 * 是否需要在线支付
	 * @param  [type]  $info [description]
	 * @return boolean       [description]
	 */
	public function isOnlinePay($info) {
		if($info['pay_type']==2) return true;

		return false;
	}

	/**
	 * 格式化日期
	 * @param  [type] $info  [description]
	 * @param  [type] $field [description]
	 * @param  string $type  [description]
	 * @return [type]        [description]
	 */
	public function dateFormat($info, $field, $type='') {
		$return = '';
		switch($field.$type) {
			case 'startime':
				$return = date('m月d日 H:i', $info['startime']);
			break;
			case 'endtime':
				$return = date('m月d日 H:i', $info['endtime']);
			break;
			case 'expiration':
				$return = date('m月d日 H:i', $info['expiration']);
			break;
		}

		return $return;
	}


	/**
	 * 获取活动状态
	 * @param  [type] $info [description]
	 * @return [type]       [description]
	 */
	public function getStatus($info, $flag='text') {
		$return = '';

		if($this->isEnrollStart($info) && !$this->isEnrollEnd($info)) {
			$return = $flag=='text' ? '报名中':'label-green';
		}elseif($this->isStart($info) && !$this->isEnd($info)){
			$return = $flag=='text' ? '进行中':'label-orange';
		}
		return $return;
	}

	/**
	 * 获取详细面链接地址
	 * @param  [type] $info [description]
	 * @return [type]       [description]
	 */
	public function getDetailLink($info, $school_type) {
		return F::url('huodong_m:/huodong/mobileactivity_lectures_detail/index', ['id'=>$info['id'], 'school_type'=>$school_type]);
	}

	/**
	 * 导航菜单配置
	 * @param  [type] $school_type [description]
	 * @return [type]              [description]
	 */
	public function getNav($school_type){
		switch ($school_type) {
            case '3':
                $nav_link=[
                    '小升初首页'=>['nav_class'=>'nav-home','link'=>F::URL('huodong_m:/list/xsc')],
                    '小升初资讯'=>['nav_class'=>'nav-post','link'=>F::URL('huodong_m:/list/listxsc')],
                    '小升初活动'=>['nav_class'=>'nav-activity','link'=>F::URL('huodong_m:/jiangzuo', ['school_type'=>3])],
                    '小升初百科'=>['nav_class'=>'nav-wiki','link'=>F::URL('huodong_m:/xxbk')],
                    '广州初中库'=>['nav_class'=>'nav-library','link'=>F::URL('huodong_m:/xuexiao/chuzhong')],
                    '高分家长'=>['nav_class'=>'nav-parent','link'=>F::getLink('jiazhang')],
                ];
                break;

            case '2':
                $nav_link=[
                    '中考首页'=>['nav_class'=>'nav-home','link'=>F::URL('huodong_m:/list/zhongkao')],
                    '中考资讯'=>['nav_class'=>'nav-post','link'=>F::URL('huodong_m:/list/listzhongkao')],
                    '中考活动'=>['nav_class'=>'nav-activity','link'=>F::URL('huodong_m:/jiangzuo/', ['school_type'=>2])],
                    '中考百科'=>['nav_class'=>'nav-wiki','link'=>F::URL('huodong_m:/czbk')],
                    '广州高中库'=>['nav_class'=>'nav-library','link'=>F::URL('huodong_m:/xuexiao/gaozhong')],
                    '高分家长'=>['nav_class'=>'nav-parent','link'=>F::getLink('jiazhang')],
                ];
                break;

            case '1':
                $nav_link=[
                    '广州高中库'=>['nav_class'=>'nav-home','link'=>F::URL('huodong_m:/list/gaokao')],
                    '高考资讯'=>['nav_class'=>'nav-post','link'=>F::URL('huodong_m:/list/listgaokao')],
                    '高考活动'=>['nav_class'=>'nav-activity','link'=>F::URL('huodong_m:/jiangzuo/', ['school_type'=>1])],
                    '高考百科'=>['nav_class'=>'nav-wiki','link'=>F::URL('huodong_m:/gzbk')],
                    '高分家长'=>['nav_class'=>'nav-parent','link'=>F::getLink('jiazhang')],
                ];
                break;
            
            default:
                $nav_link=[];
                break;
        }

        return $nav_link;
	}
}