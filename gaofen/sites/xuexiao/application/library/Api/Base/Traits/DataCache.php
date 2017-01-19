<?php
namespace Api\Base\Traits;

Trait DataCache {

	/**
	 * 删除指定应用id信息 更新状态，逻辑删除不是物理删除
	 *
	 * @param string $id
	 * @param array $courseInfo app应用的信息
	 *
	 * @return bool
	 */
	public function delete($id) {
		if ($this->_setCache('delete', $id)) {
			$this->_model->delete($id);
			return $id;
		}
		return false;
	}

	/**
	 * 条件获取数据列表
	 *
	 * @param mixed $cond kv数组array('k'=>'v‘);
	 * @param mixed $page
	 * @param mixed $limit
	 * @param mixed $reset
	 */
	public function listIdsByCond(array $cond, $reset = false) {

		if (!$cond) {
			openApi::throwException(999994, '参数出错', 'cond必须为kv条件数组');
		}

		$cacheOpt = $this->_getCacheOpt(static::$_LIST_BY_TYPE_CACHE_KEY, $cond);
		$this->setZetWithScore(true);
		$ids = array();
		foreach ($cacheOpt as $o) {
			$_tmp = $this->cacheCall('listIdsByCond_db', array($o['cond']), array('kname' => $o['kname'], 'kvar' => $o['kvar'], 'isSet' => 1), $reset);
			$ids[] = $_tmp;
		}

		//取代循环单个过滤
		if (count($ids) > 1) {
			$aikObj = new \ReflectionFunction('array_intersect_key');
			$ids = $aikObj->invokeArgs($ids);
		} elseif(isset($ids[0])) {
			$ids = $ids[0];
		}

		asort($ids);
		return array_keys($ids);
	}
	
	/**
	 * 获取指定id的详细信息
	 *
	 * @param string $id
	 * @param bool $reset 是否重置缓存
	 *
	 * @return array|bool
	 */
	public function get($id, $reset = false, $useFormat = 1) {
		if (!is_numeric($id)) {
			OpenApi::throwException(10000, '$id应为数值', '');
		}
		if (empty($id)) {
			return array();
		}
		$rst = array();
		$rst = $this->cacheCall('get_db', array('id' => $id), array('kname' => static::$_GET_CACHE_KEY, 'kvar' => $id), $reset);
		$rst = $this->_rowDataFormat($rst, $useFormat);
		return $rst;
	}

	/**
	 * 提供获取指定id的详细信息的数据源
	 *
	 * @param string $id
	 *
	 * @return array|bool
	 */
	public function get_db($id) {
		$rst = $this->_model->get($id);
		return $rst;
	}

	/**
	 * 批量获取指定id的详细信息
	 *
	 * @param array $ids
	 *
	 * @return bool|array
	 */
	public function getBatch($ids, $reset = false, $useFormat = 1) {
		if (empty($ids)) {
			return array();
		}

		$rst = array();
		$rst = $this->mutiCacheCall('getBatch_db', array('id' => $ids), array('kname' => static::$_GET_CACHE_KEY, 'kvars' => $ids), $reset);
		$rst = $this->_rowDataFormat($rst, $useFormat);
		return $rst;
	}

	/**
	 * 提供批量获取指定id的详细信息数据源
	 *
	 * @param array $ids
	 *
	 * @return bool|array
	 */
	public function getBatch_db($ids) {
		$rst = $this->_model->getBatch($ids);
		return $this->formatKeyRows($rst, 'id');
	}

	/**
	 * 更新缓存
	 *
	 * @param mixed $opt update|add|delete
	 * @param mixed $id
	 * @param mixed $oldData
	 */
	public function _setCache($opt, $id, $oldData = array()) {
		$opt = strtolower($opt);
		if (!in_array($opt, array('update', 'insert', 'delete'))) {
			openApi::throwException(1, '缓存更新失败', '没相关操作标识');
		}

		//更新时，先删除旧数据
		if ($opt == 'update' && $oldData) {
			$cacheOpt = $this->_getCacheOpt(static::$_LIST_BY_TYPE_CACHE_KEY, $oldData);
			foreach ($cacheOpt as $o) {
				$this->cacheObj()->zSetDel($o['kname'], $o['kvar'], $id);
			}
		}

		if($opt === 'delete') {
            $data = $this->get($id);
        } else {
            $data = $this->get($id, true);
        }
        
		$cacheOpt = $this->_getCacheOpt(static::$_LIST_BY_TYPE_CACHE_KEY, $data);
		//缓存更新
		foreach ($cacheOpt as $o) {
			if ($opt == 'delete') {
				$this->cacheObj()->zSetDel($o['kname'], $o['kvar'], $id);
				continue;
			}

			if ($opt == 'insert' || $opt == 'update') {
				$val = array('zMember' => $id, 'zScore' => strtotime($data['created_at']));
				$this->cacheObj()->zSetPush($o['kname'], $o['kvar'], $val);
				continue;
			}
		}

		return true;
	}

	/**
	 * 生成cache kvar
	 *
	 * @param mixed $kname
	 * @param mixed $data
	 */
	public function _getCacheOpt($kname, $data) {
		$cond = $this->_getTableCondition();
		$opt = array();

		foreach ($cond['condition'] as $field => $c) {
			if (empty($data[$field])) {
				continue;
			}

			switch ($c) {
				case 'list':
					//按属性构建缓存KEY
					if (!is_array($data[$field])) {
						$item = explode(',', (string) $data[$field]);
					} else {
						$item = $data[$field];
					}

					if ($item) {
						foreach ($item as $val) {
							$kvar = $field . ':' . $val;
							$opt[] = array('field' => $field, 'type' => $c, 'kname' => $kname, 'kvar' => $kvar, 'cond' => array($field => $val), 'isList' => true);
						}
					} else {
						$kvar = $field . ':';
						$opt[] = array('field' => $field, 'type' => $c, 'kname' => $kname, 'kvar' => $kvar, 'cond' => array($field => ''), 'isList' => true);
					}
					break;
				case 'val':
					$kvar = $field . ':' . $data[$field];
					$opt[] = array('field' => $field, 'type' => $c, 'kname' => $kname, 'kvar' => $kvar, 'cond' => array($field => $data[$field]), 'isList' => true);
					break;
			}
		}

		$opt[] = array('field' => '', 'kname' => $kname, 'kvar' => '___all___', 'cond' => array(), 'isList' => true);

		return $opt;
	}

}