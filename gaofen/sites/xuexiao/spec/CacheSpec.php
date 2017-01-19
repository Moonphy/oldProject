<?php

namespace spec;

use PhpSpec\ObjectBehavior;
use Prophecy\Argument;

class CacheSpec extends ObjectBehavior
{
    protected $_cache;

    public function let(\Cache\Redis $cache)
    {
        $this->_cache = $cache;
        $this->beConstructedWith($cache);
    }

    public function it_is_initializable()
    {
        $this->shouldHaveType('Cache');
    }

    public function it_should_be_call_cache_methods()
    {
        $key = 'somekey';
        $hashKey = 'somehashKey';
        $value = 'somevalue';

        $this->_cache->get($key)->shouldBeCalled();
        $this->_cache->del($key)->shouldBeCalled();
        $this->_cache->hSet($hashKey, $key, $value)->shouldBeCalled();
        $this->_cache->hGet($hashKey, $key)->shouldBeCalled();
        $this->_cache->hIncrBy($hashKey, $key, $value)->shouldBeCalled();
        $this->_cache->listq_push($key, $value)->shouldBeCalled();
        $this->_cache->listq_pop($key)->shouldBeCalled();

        $this->get($key);
        $this->del($key);
        $this->hSet($hashKey, $key, $value);
        $this->hGet($hashKey, $key);
        $this->hIncrBy($hashKey, $key, $value);
        $this->listq_push($key, $value);
        $this->listq_pop($key);
    }
}
