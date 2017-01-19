<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/3/16
 * Time: 上午11:17
 */

namespace spec\Cache;

use PhpSpec\ObjectBehavior;
use Prophecy\Argument;

class CacheKeyGeneratorSpec extends ObjectBehavior
{

    public function it_is_a_key_generator()
    {
        $this->shouldHaveType('\Cache\Contracts\KeyGenerator');
    }

    public function it_should_throw_exception_when_missing_required_key()
    {
        $this->shouldThrow('\InvalidArgumentException')->duringGetCacheKey(['uuid' => 42]);
        $this->shouldThrow('\InvalidArgumentException')->duringGetCacheKey(['type' => 42]);
    }

    public function it_should_generate_entry_key()
    {
        $parameters = [
            'entry.xuexiao_cz_school.42' => ['table' => 'xuexiao_cz_school', 'type' => 'entry', 'uuid' => 42],

        ];
        foreach ($parameters as $keyName => $parameter) {

            $this->getCacheKey($parameter)->shouldReturn($keyName);
        }
    }

    public function it_should_generate_query_key()
    {
        $parameters = [
            'query.cz_school.id.42' => ['table' => 'cz_school', 'type' => 'query', 'id' => 42],
            'query.cz_school.city.123.limit.21.order.views.page.4.top.5' => [
                'table' => 'cz_school',
                'type' => 'query',
                'top' => 5,
                'city' => 123,
                'page' => 4,
                'order' => 'views',
                'limit' => 21
            ],

        ];
        foreach ($parameters as $keyName => $parameter) {

            $this->getCacheKey($parameter)->shouldReturn($keyName);
        }

    }
}