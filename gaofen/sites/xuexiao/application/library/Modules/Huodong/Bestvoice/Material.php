<?php
namespace Modules\Huodong\Bestvoice;

class Material {

	protected $_type = 1;

	public function setType($type) {
		$this->_type = $type;
		return $this;
	}

	public function getType() {
		return $this->_type;
	}
	
	/**
	 * 获取获奖ID
	 * @return [type] [description]
	 */
	public function getPreRoundInfo($id) {
		$type = $this->getType();
		//已知期数
		$conf = $this->getConf($type);
		$round = array_reverse($conf['roundData']);
		$rs = [];
		foreach($round as $_d=>$_r) {
			if(time()<strtotime($_d)) continue; 

			$data = $this->getRoundData(['id'=>$id, 'date'=> $_d]);
			if($data) {
				$rs[$_r['round']]['date'] = $_d;
				$rs[$_r['round']]['data'] = $data;
				break;
			}
		}

		return $rs;
	}

	/**
	 * 获取活动每期数据
	 * @param  [type] $type  活动ID
	 * @param  [type] $limit 获取条数
	 * @param  [type] $date  当期统计的年-月-日 时
	 * @return [type]        [description]
	 */
	public function getRoundData($param) {
		if(empty($param['date']) || time()<strtotime($param['date'])) return false;
		$param['type'] = $this->getType();
		return \F::api('/Huodong/Bestvoice/Material/getRoundData', $param);
	}

	/**
	 * 获取新手将文件保存地址
	 * @param  [type]  $type          [description]
	 * @param  boolean $date [description]
	 * @return [type]                 [description]
	 */
	public function getDayWinnerFilePath($date=false) {
		$type = $this->getType();
		$file = '';
		if($date) {
			$date = date('Y-m-d', strtotime($date));
			$file = DATA_PATH."/inform/dayWinner_{$type}_{$date}";
			
		} else {
			$file = DATA_PATH."/inform/dayWinner_{$type}";
		}

		return $file;
	}

	/**
	 * 保存新奖者名单
	 * @param  array $data [format:fav_num=>[uid,uid,uid]]
	 * @return int $type       [description]
	 */
	public function saveTopNewUserIds($data) {
		if(empty($data)) return ;

		krsort($data);
		$winnerGroup = array_slice($data, 0, 1, true);

		foreach($winnerGroup as $fav_num=>$uids) {
			if($fav_num<1) continue;
			//每日获奖总表
			file_put_contents($this->getDayWinnerFilePath(), ','.implode(',', $uids), FILE_APPEND);

			//每日获奖日表
			file_put_contents($this->getDayWinnerFilePath(date('Y-m-d')), 'fav_num:'.$fav_num.';'.implode(',', $uids));
		}

		return true;
	}

	/**
	 * 获取获奖新手数据
	 * @param  boolean $date 日期
	 * @return [type]                 [description]
	 */
	public function getTopUserIds($date=false){
		$path = $this->getDayWinnerFilePath($date);
		
		$result = [];
		if(is_file($path)) {
			$data = file_get_contents($path);
			$spIndex = strpos($data, ';');
			$data = $spIndex!==false ? substr($data, $spIndex+1):$data;
			$result = explode(',', trim($data, ", "));
		}

		return $result;
	}

	/**
	 * 是否获奖新手
	 * @return [type] [description]
	 */
	public function isDayTopNewUser($uid) {
		$type = $this->getType();
		$key = md5(__CLASS__.__METHOD__.$type).date('Ymd');
		$uids = \Cache::get($key);

		if(empty($uids)) {
			$uids = $this->getTopUserIds();
			\Cache::set($key, $uids, 3600);
		}
		
		return in_array($uid, $uids);
	}

	/**
	 * 弹出日胜出者提示
	 * @param  [type] $uid [description]
	 * @return [type]      [description]
	 */
	public function notifyTopNewUser($uid) {
		$type = $this->getType();
		$message = '亲，恭喜获得<br />豆娃好声音大赛<br />新人奖<br />长按下方二维码识别<br />添加微信客服（gaofenwang）领取';
		$localKey = "voiceDayWinner-{$type}-{$uid}";
		if($uid && is_numeric($uid) && $this->isDayTopNewUser($uid)) {
			return $this->inform($localKey, $message).PHP_EOL;
			//return "<script>Gaofen.FN.popup('{$localKey}', '{$message}');</script>".PHP_EOL;
		}
	}

	/**
	 * 获取每天新人奖用户信息
	 * @return [type] [description]
	 */
	public function getDayTopNewUserInfo() {
		$result = [];
		for($i=0; $i<7; $i++) {
			$date = date('Y-m-d', strtotime("-{$i} day"));
			$ids = $this->getTopUserIds($date);
			if($ids) {
				$users = \F::api('/Huodong/Bestvoice/User/getBatch', ['ids'=>$ids]);
				$result['date'] = date('m月j日', strtotime($date));
				foreach($users as $k=>$v) {
					$result['users'][$k] = $v->toArray();
				}
				break;
			}
		}
		
		return $result;
	}

	/**
	 * 活动是否已开始
	 * @return boolean [description]
	 */
	public function isStart() {
		$type = $this->getType();
		$conf = $this->getConf($type);

		$rt = true;
		if(isset($conf['start']['time']) && time()<strtotime($conf['start']['time'])) {
			$rt = false;
		}
		return $rt;
	}

	/**
	 * 活动是否已结束
	 * @return boolean [description]
	 */
	public function isEnd() {
		$type = $this->getType();
		$conf = $this->getConf($type);

		$rt = false;
		if(isset($conf['end']['time']) && time()>strtotime($conf['end']['time'])) {
			$rt = true;
		}
		return $rt;
	}

	/**
	 * 获取出错信息
	 * @param  [type] $flag [description]
	 * @return [type]       [description]
	 */
	public function getConfMessage($flag, $field='errmsg') {
		$type = $this->getType();
		$conf = $this->getConf($type);
		$msg = '';
		if(isset($conf[$flag][$field])) {
			$msg = $conf[$flag][$field];
		}

		return $msg;
	}

	/**
	 * 弹出提示
	 * @param  [type]  $key     JS缓存KEY,如果js检测到已存在就不会提示
	 * @param  [type]  $message 提示内容
	 * @param  boolean $always  为true时会忽略key的存在
	 * @return [type]           [description]
	 */
	public function inform($key, $message, $always=false) {
		$always = $always?'true':"''";
		return "<script>Gaofen.FN.popup('{$key}', '{$message}', {$always});</script>";
	}

	/**
	 * 获取活动的配置信息
	 * @return [type] [description]
	 */
	public function getConf($type='') {
		$type = $type?$type:$this->getType();
		//已知期数
		$round = [
			1=>[
				'roundData'=>[
					'2015-11-21' 	=> ['round'=>1],
					'2015-11-28' 	=> ['round'=>2],
					'2015-12-5'	 	=> ['round'=>3],
					'2015-12-12'	=> ['round'=>4],
				],
				'start'=>[
					'time'	=> '2015-11-21',
					'errmsg'=> '活动还没开始',
				],
				'end'=>[
					'time'	=> '2015-12-12',
					'errmsg'=> '活动已结束',
					'userendmsg' => '<b>第一季豆娃好声音圆满结束</b><br />亲，你的大赛总得分是{fav_num_total}，排在第{final_rank}位<br />第二季度将有更走心的玩法，更多神秘大奖！<br />感谢你的参与！',
					'userendmsg2'=> '第一季度你的大赛总得分是{fav_num_total}，排在第{final_rank}位',
				],
			],
		];

		return isset($round[$type]) ? $round[$type]:[];
	}

	/**
	 * 消息模板数据代入
	 * @param  [type] $msgTpl 消息模板
	 * @param  array  $data   模板数据
	 * @return [type]         [description]
	 */
	public function msgExplain($msgTpl, array $data) {
		preg_match_all('#{(.*?)}#sim', $msgTpl, $pickVar);

		if(isset($pickVar[1]) && !empty($pickVar)) {
			foreach($pickVar[1] as $item) {
				$var = '{'.$item.'}';
				if(isset($data[$item])) {
					$msgTpl = str_replace($var, $data[$item], $msgTpl);
				}
			}
		}

		return $msgTpl;
	}

}
