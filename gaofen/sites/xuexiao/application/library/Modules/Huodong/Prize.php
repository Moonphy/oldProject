<?php
namespace Modules\Huodong;

class Prize {
	private $_luckynum 	= NULL;
	private $_rateMax	= 50; //中奖率 1/rateMax;
	private $_type		= NULL;
	private $_maxWinner = NULL; //总中奖数
	private $_maxDayWinner = null; //天中奖数
	private $_exceptThisUser = false; //当前用户是否可以中奖
	private $_gift = NULL; //奖品标识,字母或数字组成

	public function __construct() {
		$day = date('j');
		$this->_luckynum = $day;
	}


	/**
	 * 是否中奖
	 * @param string $gfit 奖品标识
	 * @return boolean [description]
	 */
	public function isBingo() {
		$rand = rand(0, $this->getWinningRate());
		//echo '/*'.$rand.':'.$this->getWinningRate().':'.$this->getLuckyNum().'*/';
		if($this->canBingo() && $rand==$this->getLuckyNum()) {
			return true;
		}

		$this->setGift(null);
		return false;
	}

	/**
	 * $gift 奖品标识,字母或数字组成
	 * @param [type] $gfit [description]
	 */
	public function setGift($gift) {
		$this->_gift = $gift;
		$this->_init();
		return $this;
	}

	/**
	 * 获取礼品标识
	 * @return [type] [description]
	 */
	public function getGift() {
		return $this->_gift;
	}

	/**
	 * 是否添足派奖条件
	 * @return [type] [description]
	 */
	private function canBingo() {
		$totalLimit = $this->_maxWinner;
		$dayLimit	= $this->_maxDayWinner;
		$exceptThisUser = $this->_exceptThisUser;

		//用户获奖限制
		if($exceptThisUser===true) {
			return false;
		}

		if(is_null($totalLimit) && is_null($dayLimit)) {
			return true;
		}

		//总量控制
		if(is_numeric($totalLimit)) {
			$data = $this->getData('', $withGift=true);
			if(!isset($data['total']) || $data['total']>=$totalLimit) {
				return false;
			}
		}

		//日量控制
		if(is_numeric($dayLimit)) {
			$data = $this->getData(date('Ymd'), $withGift=true);
			if(!isset($data['total']) || $data['total']>=$dayLimit) {
				return false;
			}
		}

		return true;
	}

	/**
	 * 初始化所有限制
	 * @return [type] [description]
	 */
	private function _init() {
		//不设置日上限
		$this->setMaxDayWinner(NULL);

		//不设置总上限
		$this->setMaxWinner(NULL);

		//中奖率1/50
		$this->setWinningRate(50);
	}

	/**
	 * 允许记录某字段值出现次数
	 * @param  [type]  $index logData 的索引值
	 * @param  [type]  $val       值
	 * @param  integer $times     允许出现次数
	 * @return [type]             [description]
	 */
	public function allowUidTimes($uid, $times=1) {
		$this->_exceptThisUser = false;
		$data = $this->getData('', $withGift=true, $uid);

		if(isset($data['total']) && $data['total']>=$times) {
			$this->_exceptThisUser = true;
		}

		return $this;
	}

	/**
	 * 设置最大总量获奖人数
	 * @param [type] $num [description]
	 */
	public function setMaxWinner($num) {
		$this->_maxWinner = $num;
		return $this;
	}

	public function setMaxDayWinner($num) {
		$this->_maxDayWinner = $num;
		return $this;
	}


	/**
	 * 获得幸运值
	 * @return [type] [description]
	 */
	public function getLuckyNum() {
		return min($this->_luckynum, $this->_rateMax);
	}

	/**
	 * 获取中奖率
	 * @return [type] [description]
	 */
	public function getWinningRate() {
		return $this->_rateMax;
	}

	/**
	 * 设置中奖率
	 * @param [type] $rate 中奖率的分母，如：1/$rate
	 */
	public function setWinningRate($rate) {
		$this->_rateMax = (int)$rate;
		return $this;
	}

	/**
	 * 获奖记录
	 * @param  string $data [description]
	 * @return [type]      [description]
	 */
	public function writeData(array $data) {
		$rs = NULL;

		$gift 	= $this->getGift();
		$ex = ['gift'=>$gift];
		$data = array_merge($ex, $data);

		if(empty($data['type'])) {
			throw new \Exception('缺少type参数', '100001');
		}

		$rs = \F::api('/Huodong/Bestvoice/Prize/create', $data);

		if(!empty($rs->id)) {
			return true;
		}else{
			return false;
		}
	}

	/**
	 * 获奖记录
	 * @param  string $date 日期
	 * @param  bool $withGift 是否带奖品查找
	 * @param  int $uid 用户ID
	 * @return [type]        [description]
	 */
	public function getData($date='', $withGift=false, $uid='') {
		$params=['type'=>$this->getType()];

		if($date) {
			$params['date'] = date('Ymd', strtotime($date));
		}

		if($withGift) {
			$gift = $this->getGift();
			$params['gift']	= $gift;
		}

		if($uid) {
			$params['uid']	= $uid;
		}

		$rs = \F::api('/Huodong/Bestvoice/Prize/listByCond', $params);
		return $rs;
	}

	/**
	 * 设置项目ID
	 * @param [type] $type [description]
	 */
	public function setType($type) {
		$this->_type = $type;
		return $this;
	}

	/**
	 * 获取项目ID
	 * @return [type] [description]
	 */
	public function getType() {
		return $this->_type;
	}
}
