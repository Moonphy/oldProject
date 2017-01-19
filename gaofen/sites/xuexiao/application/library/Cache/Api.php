<?php
namespace Cache;

use Api\OpenApi;
use Cache\Redis;

/**
 * 项目名称:  高分CMS
 * 建立日期:  2013年03月04日
 *
 * api接口数据缓存操作类
 *
 * @作者 heli <heli@gaofen.com>
 * @版本 $Id:
 **/
class Api {

	private $_cache = false;
	private $_config = array();
	private $_prefix = false;
	private $_cfgName = '';

	function __construct($cfgName='')
	{
		// 获取配置信息
		global $G_CACHE_CONFIG;
		$this->_config = $G_CACHE_CONFIG;
		$this->_cfgName = $cfgName;
	}

	/**
	 * 获取一个缓存
	 *
	 * @param mixed $kname	缓存标识
	 * @return cache 实例
	 */
	function getCache($kname)
	{

		$_cacheObj = NULL;
		$_adp = $this->_config['cache_adapter'];

		
		if($_adp == 'redis') {
			$this->_prefix = API_CACHE_PREFIX;
			$_cacheObj = Redis::getInstance($this->_cfgName);//NY('Cache\Redis', array('cfgName'=>$this->_cfgName), true);
		} elseif ($_adp == 'mc') {
			$_cacheObj = $this->getMcCache($kname);
		} else {
			$this->_prefix = API_CACHE_PREFIX;
			$_cacheObj = NY('Cache\File');
		}		
		return $_cacheObj;
	}

	/**
	 * 获取mc缓存
	 *
	 * @param mixed $kname	缓存标识
	 * @return cache 实例
	 */
	function getMcCache($kname)
	{
		static $cacheServers = array();
		$cfg = $this->cfg($kname);

		//根据缓存配置，寻找缓存服务器
		$cache_serv = isset($this->_config['cache_servers'][$cfg['cs']]) ? $this->_config['cache_servers'][$cfg['cs']] : false;
		if (empty($cache_serv)) {
			OpenApi::throwException('110006', '无法找到缓存服务器['.$cfg['cs'].']');
		}

		$this->_prefix = $cache_serv['keyPre'];
		if (isset($cacheServers[$cfg['cs']])) {
			return $cacheServers[$cfg['cs']];
		}

		//根据缓存配置获取缓存实例
		$cacheServers[$cfg['cs']] = new \Memcache;
		$servers = explode(' ', trim($cache_serv['servers']));
		$connect = false;

		foreach ($servers as $server) {
			if (empty($server)) {
				continue;
			}

			$param = explode(':', $server);

            $connect_result = @$cacheServers[$cfg['cs']]->addServer($param[0], $param[1], $cache_serv['pconnect']);
			$connect = $connect || $connect_result;

            /// 记录mc_oapi连接失败日志
            if(false === $connect) {
            }
		}
		return $cacheServers[$cfg['cs']];
	}


	/**
	 * 批量获取缓存
	 *
	 * @param mixed $kname
	 * @param mixed $kvars
	 * @param int   $isList 　是否 list
	 * @return array | false;
	 * 			array['values']=array(kvar=>val) 	成功获取的缓存数据
	 * 			array['hit_kvars'] 					命中的缓存　kvars
	 * 			array['nohit_kvars']				未命中的缓存　kvars
	 */
	function getMuti($kname, $kvars, $isList=false, $isZet = false, $zetWithScore=false)
	{
		$keys = array();
		$cache = $this->getCache($kname);
		foreach($kvars as $v){
			$kk	= $this->_key($kname, $v);
			$keys[] = $kk;
		}

		return $cache->getMuti($keys, $kvars, $isList, $isZet, $zetWithScore=false);
	}

	/**
	 * 根据缓存标识获取实际的KEY
	 *
	 * @param mixed $kname
	 * @param mixed $kvar
	 */
	function _key($kname, $kvar=null)
	{
		if (is_array($kname)) {
			$kname = $kname['kname']."_".$kname['kpre'];
		}
		$key = $kvar===null ? $kname : $kname.":".$kvar;
		$key = $this->getPrefix().$key;
		return $key;
	}

   /**
	* 获取缓存前缀
    *
    * @return string
	*/
	function getPrefix()
	{
		return $this->_prefix;
	}

   /**
	* 获取缓存配置项的信息
	*
	* @param string $kname 配置项key
	*
	* @return string
	*/
	public function cfg($kname)
	{
		if (isset($this->_config['api_cache_cfg'][$kname])) {
			return $this->_config['api_cache_cfg'][$kname];
		}
		OpenApi::throwException('110005', '无法找到缓存配置['.$kname.']');
	}

    /**
     * 魔术方法
     *
     * @param string $method 方法名
     * @param array $args 参数
     *
     * @return bool|array|string
     */
    public function __call($method, $args)
    {
        $kname = isset($args[0]) ? $args[0] : '';
        $kvar = isset($args[1]) ? $args[1] : '';
        if (empty($kname) || empty($kvar)) {
            //todo...
        }
        array_shift($args);
        array_shift($args);

        $cache	= $this->getCache($kname);
        $key = $this->_key($kname, $kvar);
        array_unshift($args, $key);

        $cfg	= $this->cfg($kname);
        if ('set' == $method) {
            $ttl = (isset($args[2]) && $args[2]) ? $args[2] : (isset($cfg['t']) && $cfg['t'] ? $cfg['t'] : null);
            if ($ttl) {
                array_push($args, $ttl);
            }
        }

        if (in_array($method, array('listPush', 'zSetPush'))) {
            array_push($args, $cfg['n']);
        }

        return call_user_func_array(array($cache, $method), $args);
    }
}
