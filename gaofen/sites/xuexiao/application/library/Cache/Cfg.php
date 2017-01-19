<?php
namespace Cache;

class Cfg
{
    protected $_cache;
    protected $_cacheOpt;
    protected $_ccfg;

    public function __construct(Api $cache, array $cacheOpt)
    {
        $this->_cache = $cache;
        $this->_cacheOpt = $cacheOpt;
        $this->_ccfg = $this->_cache->cfg($this->_cacheOpt['kname']);
    }

    public function isZet()
    {
        return (isset($this->_cacheOpt['isSet']) && $this->_cacheOpt['isSet']) ? true : false;
    }

    public function isList()
    {
        return (isset($this->_cacheOpt['isList']) && $this->_cacheOpt['isList']) || $this->_ccfg['n'];
    }

    public function getTTL()
    {
        return isset($this->_cacheOpt['t']) ? $this->_cacheOpt['t'] : $this->_ccfg['t'];
    }
}
