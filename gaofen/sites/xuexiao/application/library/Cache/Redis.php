<?php
namespace Cache;

use Api\OpenApi;

/**
 * 项目名称:  高分CMS
 * 建立日期:  2013年03月04日
 *
 * redis 缓存操作类
 *
 * @作者 heli <heli@gaofen.com>
 * @版本 $Id:
 **/
class Redis
{

    static protected $instance;
    static private $caches;
    private $_config = array();
    private $_connectionName = '';

    function __construct($connectionName = null)
    {
        $connectionName = $this->getConnectionName($connectionName);
        $this->_db = \CFG::cache('connections', $connectionName)?: \CFG::cache('connections', 'default');
        // 获取redis servers配置信息
        $this->_config = \CFG::cache('drivers', 'redis');
        $this->_connectionName = $connectionName;
    }

    static public function getInstance($connectionName = 'default')
    {
        $connectionName = static::getConnectionName($connectionName);
        if (!isset(self::$instance[$connectionName])) {
            self::$instance[$connectionName] = new static($connectionName);
        }

        return self::$instance[$connectionName];
    }

    static public function getConnectionName($connectionName = null)
    {
        if (!$connectionName) {
            $module = strtolower(\Yaf_Dispatcher::getInstance()->getRequest()->getModuleName());
            $connectionName = \CFG::cache('modules', $module);
        }else{
            $connectionName = \CFG::cache('modules', $connectionName) ?: $connectionName;
        }

        return $connectionName;
    }

    /**
     * 获取一个缓存实例
     *
     * @param string $type
     * @return object 实例
     */
    function _getCache($type)
    {

        $this->caches[$type][$this->_connectionName] = empty($this->caches[$type][$this->_connectionName])
                            ? $this->_getSpeficCache($type) : $this->caches[$type][$this->_connectionName];

        return $this->caches[$type][$this->_connectionName];
    }

    function _getSpeficCache($server)
    {
        $cache_serv = isset($this->_config[$server]) ? $this->_config[$server] : false;

        if (empty($cache_serv)) {
            die('无法找到缓存服务器');
        }

        $redis = new \Redis();
        $redis->connect($cache_serv['server'], $cache_serv['port']);
        $redis->select($this->_db['database']);
        //$redis->setOption(\Redis::OPT_SERIALIZER, \Redis::SERIALIZER_PHP);

        return $redis;
    }

    /**
     * 是否启用序列化
     * @param  [type]  $cacheObj [description]
     * @param  boolean $open     [description]
     * @return [type]            [description]
     */
    function _serializer($cacheObj, $open=true){
        if($open) {
            $cacheObj->setOption(\Redis::OPT_SERIALIZER, \Redis::SERIALIZER_PHP);
        }else{
            $cacheObj->setOption(\Redis::OPT_SERIALIZER, \Redis::SERIALIZER_NONE);
        }

        return $cacheObj;
    }

    /**
     * 获取缓存的keys 列表
     * @param string $key
     *
     * @return array
     */
    function keys($key)
    {
        $cache = $this->_getCache('slave');
        $ret = $cache->keys($key);

        return $ret;
    }

    function setTimeout($key, $seconds)
    {
        $cache = $this->_getCache('master');

        return $cache->setTimeout($key, $seconds);
    }

    /**
     * 批量获取缓存
     *
     * @param mixed $keys
     * @param mixed $kvars
     * @param int $isList 　是否 list
     * @return array | false;
     *                    array['values']=array(kvar=>val)    成功获取的缓存数据
     *                    array['hit_kvars']                  命中的缓存　kvars
     *                    array['nohit_kvars']                未命中的缓存　kvars
     */
    function getMuti($keys, $kvars, $isList = false, $isZet = false, $zetWithScore = false)
    {
        $kmap = array();
        $data = array();
        $cache = $this->_getCache('slave');
        $i = 0;
        foreach ($kvars as $k => $v) {
            $kmap[$keys[$i]] = $v;
            if ($isZet) {
                $data[] = $this->zSetGet($keys[$i], 'DESC', $zetWithScore = false);
            } elseif ($isList) {
                $data[] = $this->listGet($keys[$i]);
            }
            $i++;
        }

        if (!$isList && !$isZet) {
            $cache = $this->_serializer($cache);
            $data = $cache->mGet($keys);
            $cache = $this->_serializer($cache, false);
        }

        //获取失败
        if ($data === false) {
            //\F::log('Muti:'.var_export($keys, true), 'cache_false');
            return false;
        }
        if (empty($data)) {
            return array('values' => array(), 'hit_kvars' => array(), 'nohit_kvars' => $kvars);
        }

        $new_data = array();
        foreach ($data as $key => $val) {
            $new_data[$keys[$key]] = $val;
        }

        $rst = array();
        $rst['values'] = $rst['hit_kvars'] = array();
        foreach ($new_data as $k => $v) {
            if ($v) {
                $rst['values'][$kmap[$k]] = $v;
                $rst['hit_kvars'][] = $kmap[$k];
            }
        }

        $rst['nohit_kvars'] = array_diff($kvars, $rst['hit_kvars']);

        return $rst;
    }

    /**
     * 获取一个　API　缓存
     *
     * @param mixed $kname 缓存标识（KEY　前缀）
     * @param mixed $kvar  缓存关联的变量，通常是 $uid $mid
     */
    function get($key)
    {
        $cache = $this->_getCache('slave');
        $cache = $this->_serializer($cache);
        $ret = $cache->get($key);
        $cache = $this->_serializer($cache, false);
        if($ret===false) {
            //\F::log('Get:'.$key, 'cache_false');
        }
        return $ret;
    }

    /**
     * 设置一个缓存
     *
     * @param mixed $key
     * @param mixed $value
     * @param mixed $ttl
     * @return 失败返回
     */
    function set($key, $value, $ttl = null)
    {
        $cache = $this->_getCache('master');
        $cache = $this->_serializer($cache);
        if ($ttl) {
            $tmp = $cache->setex($key, (int)$ttl, $value);
        } else {
            $tmp = $cache->set($key, $value);
        }
        $cache = $this->_serializer($cache,false);
        // 记录失败日志
        if (!$tmp) {
        }

        return $tmp;
    }

    /**
     * 增加元素的值　记数器+1操作
     *
     * @param mixed $kname
     * @param mixed $kvar
     */
    function inc($key, $value = null)
    {
        $cache = $this->_getCache('master');

        if (!is_null($value)) {
            return $cache->incrBy($key, (int)$value);
        } else {
            return $cache->incr($key);
        }

        //return $rst;
    }

    /**
     * 减少元素的值　记数器-1操作
     *
     * @param mixed $kname
     * @param mixed $kvar
     */
    function dec($key, $value = 1)
    {
        $cache = $this->_getCache('master');
        if ($value > 1) {
            return $cache->decrBy($key, $value);
        } else {
            return $cache->decr($key);
        }
    }

    /**
     * 删除一个api缓存
     *
     * @param mixed $key
     *
     * @return 失败返回
     */
    function del($key)
    {
        $cache = $this->_getCache('master');

        return $cache->delete($key);
    }


    /**
     * 获取一个列表缓存
     *
     * @param mixed $kname
     * @param mixed $kvar
     */
    function listGet($key)
    {
        $cache = $this->_getCache('slave');
        $listSize = $cache->lSize($key);
        if (!$listSize) {
            return false;
        }
        $listArr = $cache->lRange($key, 0, $listSize - 1);
        if ($listArr === false) {
            //\F::log('lRange:'.$key, 'cache_false');
            return false;
        }

        return $listArr;
    }

    /**
     * 设置一个LIST缓存
     *
     * @param mixed $kname
     * @param mixed $kvar
     * @param mixed $listArr
     */
    function listSet($key, $listArr, $ttl = 0)
    {
        if (!is_array($listArr)) {
            die('LIST-SET　方法存储的值必须为数组(内容为IDS,NAMES)');
        }
        $cache = $this->_getCache('master');
        $cache->delete($key);

        $redis = $cache->multi(\Redis::PIPELINE);
        foreach ($listArr as $val) {
            //$cache->rPush($key, $val);
            $redis->rPush($key, $val);
        }
        $redis->exec();
        //设置过期时间
        $cache->setTimeout($key, $ttl);

        return true;
    }

    /**
     * 向某个列表缓存中推进一个节点id
     *
     * @param mixed $key      缓存标识
     * @param mixed $node     只能是ID
     * @param int $limit      list max length
     * @param mixed $order    ID列表，排序方式 DESC|ASC，默认为 DESC ，降序，新数据 往左插, ASC 往右插
     * @param mixed $isNnique 插入时，是否排重(检查原ID 列表中是否存在此节点，存在刚删除)
     * @return true|flase
     */
    function listPush($key, $node, $limit = false, $order = 'DESC', $isNnique = false)
    {
        //获取当前队列的长度
        $cache = $this->_getCache('slave');
        $listSize = $cache->lSize($key);

        $cache = $this->_getCache('master');
        $ret = false;
        if ($order == 'DESC') {
            if ($limit) {
                //判断是否超出规定的队列长度
                $poor = $listSize - $limit;
                if (0 <= $poor) {
                    for ($i = 0; $i <= $poor; $i++) {
                        //把多的元素抛出队列
                        $cache->rPop($key);
                    }
                }
            }
            //把新的元素压入队列
            $ret = $cache->lPush($key, $node);

        } else {
            if ($limit) {
                $poor = $listSize - $limit;
                if (0 <= $poor) {
                    for ($i = 0; $i <= $poor; $i++) {
                        $cache->lPop($key);
                    }
                }
            }
            $ret = $cache->rPush($key, $node);
        }

        return $ret;

        /*
        $listArr = $this->listGet($key);
        if (!$listArr) {
            $listArr = array();
        }

        //如果需要排重，则先去重
        if ($isNnique && !empty($listArr) ) {
            $listArr = array_diff($listArr, array($node));
        }

        if ($order == 'DESC') {
            array_unshift($listArr, $node);
            if ($limit) {
                if (count($listArr) > $limit) {
                    array_pop($listArr);
                }
            }

        } else {
            $listArr[] = $node;
            if ($limit) {
                if (count($listArr) > $limit) {
                    array_shift($listArr);
                }
            }
        }

        return $this->listSet($key, $listArr);
         */
    }

    /**
     * 从某个列表缓存中删除一个节点ID
     *
     * @param mixed $key  缓存标识
     * @param mixed $node 需要删除的节点ID值 可以是数组
     * @return true|flase
     */
    function listDel($key, $node)
    {
        $node = is_array($node) ? $node : array($node);

        /*
        $listArr= $this->listGet($key);
        if($listArr === false) {
            return false;
        }
         */

        $cache = $this->_getCache('master');
        foreach ($node as $val) {
            $cache->lRem($key, $val, 1);
        }

        return true;

        /*
        $listArr = array_diff($listArr, $node);
        return $this->listSet($key, $listArr);
         */
    }

    /**
     * 向某个列表缓存中推进一个节点ID
     *
     * @param mixed $key   缓存标识
     * @param mixed $value 节点ID值
     * @return true|flase
     */
    function listq_push($key, $val)
    {
        $cache = $this->_getCache('master');

        return $cache->rPush($key, $val);
    }

    /**
     * 从某个列表缓存中取出最左节点值
     *
     * @param mixed $key 缓存标识
     * @return string
     */
    function listq_pop($key)
    {
        $cache = $this->_getCache('master');

        return $cache->lPop($key);
    }

    /**
     * 添加一个VALUE到HASH中。如果VALUE已经存在于HASH中，则返回FALSE
     *
     * @param mixed $hash_key hash存储结构的key
     * @param mixed $key      缓存标识
     * @param mixed $value    缓存的值
     *
     * @return bool
     */
    function hSet($hash_key, $key, $value)
    {
        $cache = $this->_getCache('master');

        return $cache->hSet($hash_key, $key, $value);
    }

    /**
     * 批量填充HASH表。不是字符串类型的VALUE，自动转换成字符串类型。使用标准的值。NULL值将被储存为一个空的字符串
     *
     * @param mixed $hash_key  hash存储结构的key
     * @param array $key_value 缓存的值 为一个数组 key => value
     *
     * @return bool
     */
    function hMset($hash_key, $key_values = array())
    {
        $cache = $this->_getCache('master');

        return $cache->hMset($hash_key, $key_values);
    }

    /**
     * 根据HASH表的KEY，为KEY对应的VALUE自增参数VALUE
     *
     * @param mixed $hash_key hash存储结构的key
     * @param mixed $key      缓存标识
     * @param int $value      自增值 默认为1
     *
     * @return int
     */
    function hIncrBy($hash_key, $key, $value = 1)
    {
        $cache = $this->_getCache('master');

        return $cache->hIncrBy($hash_key, $key, $value);
    }

    /**
     * 取得HASH中的VALUE，如何HASH不存在，或者KEY不存在返回FLASE
     *
     * @param mixed $hash_key hash存储结构的key
     * @param mixed $key      缓存标识
     *
     * @return mixed
     */
    function hGet($hash_key, $key)
    {
        $cache = $this->_getCache('slave');

        return $cache->hGet($hash_key, $key);
    }

    /**
     * 批量取得HASH表中的VALUE
     *
     * @param mixed $hash_key hash存储结构的key
     * @param array $keys     缓存标识key 数组
     *
     * @return mixed
     */
    function hMget($hash_key, $keys = array())
    {
        $cache = $this->_getCache('slave');

        return $cache->hMget($hash_key, $keys);
    }

    /**
     * 取得HASH表中的KEYS，以数组形式返回
     *
     * @param mixed $hash_key hash存储结构的key
     *
     * @return array
     */
    function hKeys($hash_key)
    {
        $cache = $this->_getCache('slave');

        return $cache->hKeys($hash_key);
    }

    /**
     * 取得HASH表中所有的VALUE，以数组形式返回
     *
     * @param mixed $hash_key hash存储结构的key
     *
     * @return array
     */
    function hVals($hash_key)
    {
        $cache = $this->_getCache('slave');

        return $cache->hVals($hash_key);
    }

    /**
     * 取得整个HASH表的信息，返回一个以KEY为索引VALUE为内容的数组
     *
     * @param mixed $hash_key hash存储结构的key
     *
     * @return array
     */
    function hGetAll($hash_key)
    {
        $cache = $this->_getCache('slave');

        return $cache->hGetAll($hash_key);
    }

    /**
     * 添加一个VALUE到SET容器中，如果这个VALUE已经存在于SET中，那么返回FLASE
     *
     * @param mixed $skey  set集合的key
     * @param mixed $value 缓存的值
     *
     * @return bool
     */
    function sAdd($skey, $value)
    {
        $cache = $this->_getCache('master');

        return $cache->sAdd($skey, $value);
    }

    /**
     * 随机返回一个元素，并且在SET容器中移除该元素
     *
     * @param mixed $skey set集合的key
     *
     * @return mixed
     */
    function sPop($skey)
    {
        $cache = $this->_getCache('master');

        return $cache->sPop($skey);
    }

    /**
     * 返回SET集合中的所有元素
     *
     * @param mixed $skey set集合的key
     *
     * @return mixed
     */
    function sMembers($skey)
    {
        $cache = $this->_getCache('slave');

        return $cache->sMembers($skey);
    }

    /**
     * 随机返回SET集合中指定个数元素
     *
     * @param mixed $skey  set集合的key
     * @param mixed $count 返回元素个数
     *
     * @return mixed
     */
    function sRandMember($skey, $count)
    {
        $cache = $this->_getCache('slave');

        return $cache->sRandMember($skey, $count);
    }

    /**
     * 返回存储在key对应的有序集合中的元素的个数
     *
     * @param string $zkey 有序集合的key
     *
     * @return int
     */
    function zSize($zkey)
    {
        $cache = $this->_getCache('slave');

        return $cache->zSize($zkey);
    }

    /**
     * 返回key对应的有序集合中member的score值。如果member在有序集合中不存在，那么将会返回nil
     *
     * @param string $zkey 有序集合的key
     *
     * @return int|bool
     */
    function zScore($zkey)
    {
        $cache = $this->_getCache('slave');

        return $cache->zScore($zkey);
    }

    /**
     * 从某个有序集合Set缓存中删除一个节点
     *
     * @param string $key 缓存标识
     * @param mixed $node 需要删除的节点ID值 可以是数组
     *
     * @return true|flase
     */
    function zSetDel($key, $node)
    {
        $node = is_array($node) ? $node : array($node);

        $cache = $this->_getCache('master');
        $rs = false;
        foreach ($node as $val) {
            $rs = $cache->zRem($key, $val);
            //由于可能出现rds里list的值类型与$val不一致导致删除失败，所以做以下容错处理！
            //例:list是一个int集合{1,2,3}，但$val是一个string数值"3",就会删除失败
            if (!$rs) {
                $rs = $cache->zRem($key, (int)$val);
            }
        }

        return true;
    }

    /**
     * 获取一个有序集合Set缓存
     *
     * @param string $key     缓存标识
     * @param string $orderby 集合的排序，默认是降序 'DESC' 'ASC'是升序
     *
     * @return array|bool
     */
    function zSetGet($key, $orderby = 'DESC', $withScore = false)
    {
        $cache = $this->_getCache('slave');

        if (!$this->exists($key)) {
            return false;
        } //

        $zSetArr = array();
        if ('DESC' == $orderby) {
            //降序
            $zSetArr = $cache->zRevRange($key, 1, -1,
                $withScore); //$zSetArr = $cache->zRevRange($key, 0, -1, $withScore);
        } else {
            //升序
            $zSetArr = $cache->zRange($key, 0, -2, $withScore); //$zSetArr = $cache->zRange($key, 0, -1, $withScore); 
        }

        /*
        因为cacheCall允许空数组，如果把array()等义为false则使无法缓存数据
        if(empty($zSetArr) || $zSetArr === false) {
            return false;
        }*/

        return $zSetArr;
    }

    /**
     * 设置一个有序集合缓存Set
     *
     * @param string $key 缓存标识
     * @param array $zSetArr
     *
     * @return bool
     */
    function zSetAdd($key, $zSetArr)
    {
        if (!is_array($zSetArr)) {
            die('ZSET-SET　方法存储的值必须为数组(内容为IDS,NAMES)');
        }

        $cache = $this->_getCache('master');
        $cache->delete($key);
        //echo $key;
        $redis = $cache->multi(\Redis::PIPELINE);

        //为使$zSetArr为空时缓存初始化能生效，强制插入一条大score且与现有数据无关数据，再在zSetGet利用有序截取过滤该数据
        $zSetArr[] = array('zScore' => 9999999999, 'zMember' => 9999999999);

        foreach ($zSetArr as $val) {
            $redis->zAdd($key, $val['zScore'], $val['zMember']);
        }
        $redis->exec();

        return true;
    }

    /**
     * 向某个有序集合缓存中添加一个节点
     *
     * @param mixed $key  缓存标识
     * @param array $node array('zMember' => '', 'zScore' => '')
     * @param int $limit  zSet max length
     *
     * @return true|flase
     */
    function zSetPush($key, $node, $limit = false)
    {
        //获取当前队列的长度
        $cache = $this->_getCache('slave');
        $zSetSize = $cache->zSize($key);

        $cache = $this->_getCache('master');
        $ret = false;
        if ($limit) {
            //判断是否超出规定的队列长度
            $poor = $zSetSize - $limit;
            if (0 <= $poor) {
                $zSetArray = array();
                $zSetArray = $this->zSetGet($key);
                for ($i = 0; $i <= $poor; $i++) {
                    $popValue = array_pop($zSetArray);
                    //把多的元素抛出队列
                    $cache->zRem($key, $popValue);
                }
            }
        }

        //把新的元素压入队列
        $ret = $cache->zAdd($key, $node['zScore'], $node['zMember']);

        return $ret;
    }

    /**
     * 获取某个member在zset时里的索引值
     * @param  [type] $key  [description]
     * @param  [type] $val  [description]
     * @param  string $sort asc:按score从小到大排序 desc:按score从大到小排序
     * @return [type]       [description]
     */
    function zRank($key, $val, $sort='asc') {
        $cache = $this->_getCache('slave');
        if($sort==='asc') {
            $index = $cache->zRank($key, $val);
            //因为zadd时添加了个额外值，现在作补尝处理
            return ($index===false?$index:$index+1);
        }elseif($sort==='desc') {
            return $cache->zRevRank($key, $val);
        }
    }

    /**
     * 检查键是否存在
     * @param  $key 需要检查的键
     * @return boolean
     */
    public function exists($key)
    {
        $cache = $this->_getCache('slave');

        return $cache->exists($key);
    }

    public function __call($name, $arguments)
    {
        return call_user_func_array([$this->_getCache('master'), $name], $arguments);
    }
}
