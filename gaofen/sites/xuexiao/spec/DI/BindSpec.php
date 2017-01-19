<?php

namespace spec\DI;

use PhpSpec\ObjectBehavior;
use Prophecy\Argument;

class BindSpec extends ObjectBehavior
{
    public function it_is_initializable()
    {
        $this->shouldHaveType('DI\Bind');
    }
}
