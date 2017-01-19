<?php

namespace spec;

use PhpSpec\ObjectBehavior;
use Prophecy\Argument;

class CFGSpec extends ObjectBehavior
{
    public function it_is_initializable()
    {
        $this->shouldHaveType('CFG');
    }

    public function it_should_return_config_value()
    {
        $this->getConfig('rewrite_rules', 'map', 'cz')->shouldReturn("Url\Rules\CzUrl");

        $this->getConfig('rewrite_rules', 'map', 'czweixin')->shouldReturn("Url\Rules\Czweixin");

        $this->getConfig('rewrite_rules', 'map', 'cascs')->shouldBeNull();

        $this->getConfig('database', 'map', 'cascs')->shouldBeNull();

        $this->getConfig('notexist', 'notexist', 'notexist')->shouldBeNull();

        $this->getConfig('database', 'connections', 'school')->shouldBeArray();

        $this->getConfig('database', 'connections', 'school', 'host')->shouldReturn('192.168.1.123');

        $this->getConfig('database', 'connections', 'school', 'driver')->shouldReturn('mysql');
    }
}
