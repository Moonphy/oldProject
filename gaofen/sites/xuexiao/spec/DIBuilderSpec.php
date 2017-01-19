<?php

namespace spec;

use PhpSpec\ObjectBehavior;
use Prophecy\Argument;

class DIBuilderSpec extends ObjectBehavior
{
    protected $_di;

    public function let(\DI\DI $di)
    {
        $this->beConstructedWith($di);
        $this->_di = $di;
    }

    public function it_is_initializable()
    {
        $this->shouldHaveType('DIBuilder');
    }
}
