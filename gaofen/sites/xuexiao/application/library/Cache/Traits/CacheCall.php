<?php
namespace Cache\Traits;
use Api\OpenApi;
use Cache\Api;

trait CacheCall
{
    protected static $_apiCache = [];

    protected function _getApiCache($cfgName='')
    {
        if(!isset($this->_apiCache[$cfgName])){
            $this->_apiCache[$cfgName] = new Api($cfgName); //NY('Cache\Api', ['cfgName'=>$cfgName], true);
        }
        
        return $this->_apiCache[$cfgName];
    }

    public function useSetInNumber($bool = null)
    {
        //设为true时set用incrBy代替设一数值缓存（注：当开启SERIALIZER时，set的数值不能被incr || decr || incrBy)
        static $useNumberSet = false;
        if ($bool !== null) {
            $useNumberSet = $bool;
        }
        return $useNumberSet;
    }

    //isZet缓存返回数据方式
    private $_zetWithScore = 'm'; //m返回array(member1,member2,...) | ms返回格式:array(member1=>score1, member2=>score2,...)

    /**
     * 置设getMuti返回array('member'=>score)型式，让开发再二次score排序
     *
     * @param mixed $mode
     * @return cache_model
     */
    public function setZetWithScore($v)
    {
        $v = (bool) $v;
        $this->_zetWithScore = $v;
        return $this;
    }

    public function getZetWithScore()
    {
        return $this->_zetWithScore;
    }

    public function resetWithScore()
    {
        $this->setZetWithScore(false);
    }

    /**
     * 缓存调用，当缓存不存在时重建
     *
     * @param string $funcName 当前类的　非缓存数据获取方法
     * @param array  提供给　$funcName　的参数，数组的顺序即为　$funcName　的参数顺序
     * @param mixed $cacheOpt   缓存选项 两种组合如下
     *              $cacheOpt['kname']　+　$cacheOpt['kvar'] 内置的命名CACHE（见缓存列表）
     *              $cacheOpt['k'] 自定义的缓存KEY　　$cacheOpt['t']    缓存时间　将使用　custom　指定的服务集
     *              $cacheOpt['isList'] 不提供，则以配置中的　n　为准，提供，则参数优先 (自定义缓存无效)
     *
     *
     * @param mixed $reset　是否重置缓存
     * @return 具体的数据
     */
    public function cacheCall($funcName, $params, $cacheOpt, $reset = false)
    {
        if (API_IS_DEBUG) {
            $reset = true;
        }

        $data       = false;
        //缓存的使用
        $apiCache = $this->_getApiCache($this->getCfgName());
        $apiCfg = NY('Cache\Cfg', ['cacheOpt' => $cacheOpt]);

        $_zetMode = $this->getZetWithScore(); //是否返回array('member'=>score)型式，让开发再二次score排
        // 如果不需要重建，则尝试先从缓存获取
        if (!$reset) {
            if (isset($cacheOpt['kname']) && isset($cacheOpt['kvar'])) {
                if ($apiCfg->isZet()) {
                    $data = $apiCache->zSetGet($cacheOpt['kname'], $cacheOpt['kvar'], 'DESC', $_zetMode);
                } elseif ($apiCfg->isList()) {
                    $data = $apiCache->listGet($cacheOpt['kname'], $cacheOpt['kvar']);
                } else {
                    $data = $apiCache->get($cacheOpt['kname'], $cacheOpt['kvar']);
                }
            } else {
                // 自定义缓存
                $data = $apiCache->getCache('custom')->get($cacheOpt['k']);
            }
        }

        //需要重建，或者缓存获取失败
        if ($reset || $data === false) {
            $caller = $this;

            if (is_array($funcName)) {
                $caller = $funcName['model'];

                $funcName = $funcName['func'];
            }

            $data = call_user_func_array(array($caller, $funcName), $params);
            if (isset($cacheOpt['kname']) && isset($cacheOpt['kvar'])) {
                $data = $this->_setDataToCache($apiCfg, $cacheOpt['kname'], $cacheOpt['kvar'], $data);
            }

            // //缓存设置失败的日志处理
            // if (!$setSt) {
            //     //todo...
            // }
        }

        return $data;
    }

    /**
     * 把数据保存到缓存中
     * @param \Cache\Cfg $apiCfg 缓存配置
     * @param string     $kname  缓存名称
     * @param string     $kvar   缓存后缀
     * @param mixed     $data    需要保存到数据
     * @return array 集合的数据会返回格式化后的数据
     */
    protected function _setDataToCache(\Cache\Cfg $apiCfg, $kname, $kvar, $data)
    {
        $ttl = $apiCfg->getTTL();
        $apiCache = $this->_getApiCache($this->getCfgName());

        if ($apiCfg->isZet()) {
            $_zetMode = $this->getZetWithScore();
            $setSt = $apiCache->zSetAdd($kname, $kvar, $data);
            $data = $apiCache->zSetGet($kname, $kvar, 'DESC', $_zetMode);
            //$data = $this->formatZsetArray($data, $_zetMode);
        } elseif ($apiCfg->isList()) {
            $setSt = $apiCache->listSet($kname, $kvar, $data, $ttl);
        } else {
            if ($this->useSetInNumber()) {
                if(!$apiCache->exists($kname, $kvar)) { 
                //回为inc的第二个参数为步长值，只能在key不存在时才执行，否则会产生不正确的累加值
                    $setSt = $apiCache->inc($kname, $kvar, $data);
                }
            } else {
                $setSt = $apiCache->set($kname, $kvar, $data, $ttl);
            }
        }

        return $data;
    }


    /**
     * 批量性的缓存调用
     *
     * @param string $funcName 当前类的　非缓存数据获取方法
     *                           此方法返回的结果应该是用　$kvar 为索引的数组
     * @param array  提供给　$funcName　的参数，数组的顺序即为　$funcName　的参数顺序
     *                           第一个参数即　$params[0]  必须是　类 kvars 型
     * @param mixed $cacheOpt    缓存选项 只适用于内置命名缓存
     *               $cacheOpt['kname']　+　$cacheOpt['kvars'] 内置的命名CACHE（见缓存列表）
     *               $cacheOpt['t']  缓存时间,未指定时，将使用　缓存配置中的选项
     *
     *               $cacheOpt['isList'] 不提供，则以配置中的　n　为准，提供，则参数优先 (自定义缓存无效)
     *
     * @params array 传递给　$funcName　的参数，
     *
     *
     * @param mixed $reset　是否重置缓存
     * @return 具体的数据
     */
    public function mutiCacheCall($funcName, $params, $cacheOpt, $reset = false)
    {
        if (API_IS_DEBUG) {
            $reset = true;
        }

        $rnd_hit = "";

        //缓存的使用
        $apiCache = $this->_getApiCache($this->getCfgName());

        $apiCfg = NY('Cache\Cfg', ['cacheOpt' => $cacheOpt]);

        //需要物理查询的部分
        $query_kvars = $cacheOpt['kvars'];

        $data = array();
        $_zetMode = $this->getZetWithScore(); //是否返回array('member'=>score)型式，让开发再二次score排
        //非重建　尝试从缓存中获取数据
        if (!$reset) {
            if ($apiCfg->isZet()) {
                $mcData = $apiCache->getMuti($cacheOpt['kname'], $cacheOpt['kvars'], false, true, $_zetMode);
            } elseif($apiCfg->isList()) {
                $mcData = $apiCache->getMuti($cacheOpt['kname'], $cacheOpt['kvars'], true);
            } else {
                $mcData = $apiCache->getMuti($cacheOpt['kname'], $cacheOpt['kvars'], false);
            }

            if (is_array($mcData)) {
                $query_kvars = is_array($mcData['nohit_kvars']) ? $mcData['nohit_kvars'] : array();
                $data = $mcData['values'];
                unset($mcData);
            }
        }

        //有一部分数据在缓存中找不到
        if (!empty($query_kvars)) {
            $params[0] = $query_kvars;


            $caller = $this;

            if (is_array($funcName)) {
                $caller = $funcName['model'];

                $funcName = $funcName['func'];
            }


            $dbData = call_user_func_array(array($caller, $funcName), $params);

            if (!is_array($dbData)) {
                OpenApi::throwException('', '使用　mutiCacheCall　时　['.$funcName.'] 返回值有误！'.json_encode($dbData).'');
            }
            foreach ($dbData as $kvar => $value) {
                $value = $this->_setDataToCache($apiCfg, $cacheOpt['kname'], $kvar, $value);
                $data[$kvar] = $value;
            }

            if ($this->useSetInNumber()) {
                $this->useSetInNumber(false);
            }
        }

        //还原原来的顺序
        $rstData = array();
        foreach ($cacheOpt['kvars'] as $kid) {
            $kid = "".$kid;
            isset($data[$kid]) && $rstData[$kid] = $data[$kid];
        }
        unset($data);
        return $rstData;
    }

    /**
     *  将数据查询出来的单列结果，汇集成一维数组
     */
    public function formatArray($data)
    {
        if (empty($data)) {
            return array();
        }
        $rst = array();
        //var_dump($arr);
        foreach ($data as $k => $v) {
            $rst[] = $v[key($v)];
        }
        return $rst;
    }

    /**
     *  集合数据查询出来的单列结果，汇集成一维数组
     *
     *  @param array $data
     *
     *  @return array
     */
    public function formatZsetArray($data, $withScore = false)
    {
        if (empty($data)) {
            return array();
        }
        $rst = array();
        foreach ($data as $v) {
            if ($withScore) {
                $rst[$v['zMember']] = $v['zScore'];
            } else {
                $rst[] = $v['zMember'];
            }
        }
        return $rst;
    }

    /**
     *
     * 将一个数据库查询出来的结果，转换成　关键 key->row 的结构
     * @param mixed $data       原始数据
     * @param mixed $fieldName  需要取出来做索引key的字段名
     */
    public function formatKeyRows($data, $fieldName)
    {
        $rstData = array();

        if(is_object($data)) {
            foreach ($data as $r) {
                $rstData["{$r->$fieldName}"] = $r;
            }
        } else {
            foreach ($data as $r) {
                $rstData["{$r[$fieldName]}"] = $r;
            }
        }
        

        return $rstData;
    }
}
