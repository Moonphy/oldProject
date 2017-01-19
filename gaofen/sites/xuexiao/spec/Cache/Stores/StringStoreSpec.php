<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/3/17
 * Time: 下午1:58
 */

namespace spec\Cache\Stores;

use Cache\Redis;
use ORM\CZ\School;
use PhpSpec\ObjectBehavior;
use Prophecy\Argument;

class StringStoreSpec extends ObjectBehavior
{
    public function let()
    {
        \F::setEnv('TDD');
        $redis = new Redis();
        $this->beConstructedWith($redis);

    }

    public function it_is_initializable()
    {
        $this->shouldHaveType('Cache\Stores\StringStore');
        $this->shouldHaveType('Cache\Contracts\Store');
    }

    public function it_should_caching_string()
    {
        $this->put('somekeys', '12345', 1);
        $this->get('somekeys')->shouldEqual('12345');

        $this->put('somekeys', '', 1);
        $this->get('somekeys')->shouldNotEqual(false);
    }
    public function it_should_caching_array()
    {
        $this->put('somekeys', [1, 2, 3], 1);
        $this->get('somekeys')->shouldEqual([1, 2, 3]);

        $this->put('somekeys', [], 1);
        $this->get('somekeys')->shouldNotEqual(false);
    }

    public function it_should_caching_orm()
    {
        $entry = new School(['id' => 123, 'name' => 'abc']);
        $this->put('somekeys', $entry, 1);
        $this->get('somekeys')->shouldHaveType('ORM\CZ\School');
        $this->get('somekeys')->getAttribute('name')->shouldEqual('abc');
    }

    public function it_should_set_multile_keys()
    {
        $this->put(['somekeys1', 'somekeys2', 'somekeys3', 'somekeys4', 'somekeys5',],[1, 2, 3, 4, 5], 1);
        $this->get(['somekeys1', 'somekeys2', 'somekeys3', 'somekeys4', 'somekeys5',])->shouldBeArray();
    }

    public function it_should_get_multile_keys()
    {
        $this->put('somekeys1', '12345', 1);
        $this->put('somekeys2', '12345', 1);
        $this->put('somekeys3', '12345', 1);
        $this->put('somekeys4', '12345', 1);
        $this->put('somekeys5', '', 1);

        $this->get(['somekeys1', 'somekeys2', 'somekeys3', 'somekeys4', 'somekeys5',])->shouldBeArray();
        $this->get(['somekeys1', 'somekeys2', 'somekeys3', 'somekeys4', 'somekeys5', 'somekeys6'])->shouldHaveCount(5);
    }

    public function it_should_forever_set_keys()
    {
        $this->forever('somekeys', '98765');
        $this->get('somekeys')->shouldEqual('98765');

        $this->forever(['somekeys1', 'somekeys2', 'somekeys3', 'somekeys4', 'somekeys5',],[1, 2, 3, 4, 5]);
        $this->get(['somekeys1', 'somekeys2', 'somekeys3', 'somekeys4', 'somekeys5',])->shouldBeArray();
    }

    public function it_should_remove_cache()
    {
        $this->put('somekeys', '12345', 1);
        $this->remove('somekeys');
        $this->get('somekeys')->shouldEqual(false);
    }

    public function it_should_calculable()
    {
        $this->put('somekeys', '1', 10);
        $this->increment('somekeys')->shouldEqual(2);

        $this->put('somekeys', '10', 10);
        $this->increment('somekeys', 20)->shouldEqual(30);

        $this->put('somekeys', '40', 10);
        $this->decrement('somekeys')->shouldEqual(39);

        $this->forever('somekeys', '190', 10);
        $this->decrement('somekeys', 20)->shouldEqual(170);
    }

    public function it_should_flush_all_cache()
    {
        $this->put('somekeys1', '12345', 1);
        $this->put('somekeys2', '12345', 1);
        $this->put('somekeys3', '12345', 1);
        $this->put('somekeys4', '12345', 1);
        $this->put('somekeys5', '12345', 1);

        $this->flush();

        $this->get('somekeys1')->shouldEqual(false);
        $this->get('somekeys2')->shouldEqual(false);
        $this->get('somekeys3')->shouldEqual(false);
        $this->get('somekeys4')->shouldEqual(false);
        $this->get('somekeys5')->shouldEqual(false);
    }

    public function it_should_be_call_redis_method(Redis $redis)
    {
        $this->beConstructedWith($redis);

        $redis->listGet('ffss')->shouldBeCalled();

        $this->listGet('ffss');
    }

    public function it_should_be_get_null()
    {
       $this->get(new \stdClass())->shouldBeNull();
    }

}