<?php

namespace spec\Url\Rules;

use PhpSpec\ObjectBehavior;
use Prophecy\Argument;

class CzweixinSpec extends ObjectBehavior
{
    public function it_is_initializable()
    {
        $this->beConstructedWith('/Cz/School/view?id=310');
        $this->shouldHaveType('Url\Rules\Czweixin');
        $this->shouldHaveType('Url\RewriteRules');
    }
}
