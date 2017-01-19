<?php
namespace Cache;
/**
* 项目名称:  高分CMS
* 建立日期:  2012年04月19日
*
* 文件缓存类
*
* @作者 heli <heli@gaofen.com>
* @版本 $Id:
**/

class File {
	private $baseDir	= '';
	private $pathLevel	= 3;
	private $nameLen	= 2;
	private $varName 	= '__cache_data';
	private $logType 	= 'cache';
	private $io = false;

	function __construct($config = array())
	{
		extract($config, EXTR_SKIP);
		$this->baseDir = isset($baseDir) ? $baseDir : FILE_CAHCE_DIR;

		if (isset($pathLevel)){
			$this->pathLevel	= $pathLevel * 1 ==0 ? 3 : $pathLevel * 1;
		}
		if (isset($nameLen)){
			$this->nameLen		= $nameLen * 1 ==0 ? 2 : $nameLen * 1;
		}
		if (isset($varName)){
			$this->varName		= $varName;
		}

		// 加载文件io操作类
		$CI = & get_instance();
		$CI->load->library('file_io');
		$this->io = $CI->file_io;
	}


	/**
	 * 获取指定一个key 或一批key的缓存
	 *
	 * @param string|array $key	缓存标识
	 * @param bool $clearStaticKey 清除静态缓存标示
	 *
	 * @return bool
	 */
	function get($key, $clearStaticKey = false)
	{
		if (is_array($key)) {
			$tmp = array();
			foreach ($key as $v) {
				$tmp[$v] = $this->_get($v, $clearStaticKey);
			}
			return $tmp;
		} else {
			return $this->_get($key, $clearStaticKey);
		}

	}

	/**
	 * 获取缓存数据
	 *
	 */
	function _get($key, $clearStaticKey = false)
	{
		$log_func_start_time = microtime(TRUE);

		static $data;
		// 提供给 SET 进行通知，清除静态缓存数据
		if ($clearStaticKey){
			unset($data[$key]);
			return false;
		}

		$p = $this->_getSavePath($key);


		if (isset($data[$key]) && file_exists($p['p'])){
			$this->_log($log_func_start_time, $key, $data[$key]);
			return $data[$key];
		}

		if ( !file_exists($p['p']) ) {
			$this->_log($log_func_start_time, $key, 'false');
			return false;
		}

		include($p['p']);
		$varName = $this->varName;
		if (!isset($$varName)){$this->_log($log_func_start_time, $key, 'false'); return false;}
		$d = $$varName;
		$d = $d[$key];
		if ( empty($d['ttl']) || $d['timeout'] > APP_LOCAL_TIMESTAMP ){
			$data[$key]=$d['data'];
			$this->_log($log_func_start_time, $key, $data[$key]);
			return $data[$key];
		}

		$this->_log($log_func_start_time, $key, 'false');
		return false;
	}


	/**
	 * 记录日志
	 *
	 * @param int $time
	 * @param string $key
	 * @param string|array|int $result
	 *
	 * @return
	 */
	function _log($time, $key, $result)
	{

	}


	/**
	 * 设置一个缓存数据
	 *
	 * @param string $key 缓存标示
	 * @param string|array|int $value 缓存值
	 * @param int $ttl 过期时间
	 *
	 * $return bool
	 */
	function set($key, $value, $ttl = 0)
	{
		$log_func_start_time = microtime(TRUE);

		$ttl = empty($ttl) ? 63072000 : $ttl;
		$vData		= array($key => array('data' => $value, 'timeout'=> ( APP_LOCAL_TIMESTAMP + $ttl), 'ttl' => $ttl));
		$vDataStr	= $this->_var_export($vData);
		$formatData = "<?php\n" .
					  "//This is a cache file, Don't modify me!\n" .
					  "//Created: " . date("M j, Y, G:i") . "\n" .
					  IS_IN_APPLICATION_CODE . "\n\n".
					  "\$".$this->varName . " = " . $vDataStr . ";\n" .
					  "?>";
		$p = $this->_getSavePath($key);

		//清除get中的静态缓存数据
		$this->get($key, true);
		$rsult = $this->io->write($p['p'],$formatData);

		return $rsult;
	}

	function increment($key, $value = 1)
	{
		$kvar = $this->get($key);
		if (empty($kvar)) {
			return false;
		}
		$value = (int)$value + (int)$kvar;

		return $this->set($key, $value);
	}

	function decrement($key, $value = 1)
	{
		$kvar = $this->get($key);
		if (empty($kvar)) {
			return false;
		}
		$value = (int)$kvar - (int)$value;
		return $this->set($key, $value);
	}


	function delete($key)
	{
		$log_func_start_time = microtime(TRUE);
		$p 		= $this->_getSavePath($key);
		$rsult 	= true;

		if (file_exists($p['p'])){
			$rsult = $this->io->rm($p['p']);
		}

		return $rsult;
	}


	function _getPriviteKey($key)
	{
		return md5($key);
	}

	function _getSavePath($key)
	{
		$sKey = $this->_getPriviteKey($key);
		$sArr = explode("\n",wordwrap(str_repeat($sKey,10), $this->nameLen, "\n", 1));
		$pArr = array_slice($sArr, 0,$this->pathLevel);
		$d = $this->baseDir.'/'.implode('/',$pArr);
		$f = $sKey.".cache.php";
		return array('f'=>$f , 'd'=>$d , 'p'=>$d.'/'.$f);
	}

	function _var_export($array, $level = 0)
	{
		if(!is_array($array)) {
			return "'".$array."'";
		}
		if(is_array($array) && function_exists('var_export')) {
			return var_export($array, true);
		}

		$space = '';
		for($i = 0; $i <= $level; $i++) {
			$space .= "\t";
		}
		$evaluate = "Array\n$space(\n";
		$comma = $space;
		if(is_array($array)) {
			foreach($array as $key => $val) {
				$key = is_string($key) ? '\''.addcslashes($key, '\'\\').'\'' : $key;
				$val = !is_array($val) && (!preg_match("/^\-?[1-9]\d*$/", $val) || strlen($val) > 12) ? '\''.addcslashes($val, '\'\\').'\'' : $val;
				if(is_array($val)) {
					$evaluate .= "$comma$key => ".$this->_var_export($val, $level + 1);
				} else {
					$evaluate .= "$comma$key => $val";
				}
				$comma = ",\n$space";
			}
		}
		$evaluate .= "\n$space)";
		return $evaluate;
	}
}
