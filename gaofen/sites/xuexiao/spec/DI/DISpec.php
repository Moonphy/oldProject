<?php

namespace spec\DI;

use Illuminate\Container\Container;
use PhpSpec\ObjectBehavior;
use Prophecy\Argument;

/**
 * DI\DI类的测试
 */
class DISpec extends ObjectBehavior
{
    public function let()
    {
        $this->beConstructedWith(new Container(), new \CFG());
    }

    public function it_is_initializable()
    {
        $this->shouldHaveType('DI\DI');
        $this->getApplication()->forgetInstances();
    }

    /**
     * 在没有绑定的前提下make的产生的对象不应该相同
     */
    public function it_should_not_be_the_same_object()
    {
        $this->getApplication()->offsetUnset('Cache\Api');
        $this->make('Cache\Api')->shouldNotBeEqualTo($this->make('Cache\Api'));
    }

    /**
     * 在没有绑定的前提下singleton产生的对象应该都相同
     */
    public function it_should_get_the_same_singleton_object()
    {
        $this->singleton('Cache\Api')->shouldNotBeNull();
        $this->singleton('Cache\Api')->shouldHaveType('Cache\Api');
        $this->singleton('Cache\Api')->shouldBeEqualTo($this->make('Cache\Api'));
    }

    /**
     * 在bindShare绑定后，无论make还是singleton产生的对象应该都相同
     */
    public function it_should_bind_share_to_the_same_object()
    {
        $this->getApplication()->offsetUnset('Cache\Api');
        $this->make('Cache\Api')->shouldNotBeEqualTo($this->make('Cache\Api'));

        $this->singleton('Cache\Api')->shouldBeEqualTo($this->make('Cache\Api'));
    }

    /**
     * 绑定后可以生成接口对象
     */
    public function it_should_create_interface_object()
    {
        // 备注: Url\RewriteRules 是接口interface

        $this->bind('Url\RewriteRules', 'Url\Rules\CzUrl');
        $url = 'http://www.google.com';
        $this->make('Url\RewriteRules', ['url' => $url])->shouldHaveType('Url\RewriteRules');
    }
}
