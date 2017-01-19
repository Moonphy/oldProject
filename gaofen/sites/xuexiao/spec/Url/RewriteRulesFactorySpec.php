<?php

namespace spec\Url;

use PhpSpec\ObjectBehavior;
use Prophecy\Argument;

class RewriteRulesFactorySpec extends ObjectBehavior
{
    public function it_is_initializable()
    {
        $this->shouldHaveType('Url\RewriteRulesFactory');
    }

    public function it_should_return_correct_rules()
    {
        // define('_SITE_ENV', 'develop');
        $this->make('/Cz/School/view?id=310')->shouldHaveType('Url\Rules\CzUrl');

        $this->make('/Cz/School/view?id=750')->shouldHaveType('Url\Rules\CzUrl');

        $this->make('/czweixin/school/view?id=310')->shouldHaveType('Url\Rules\Czweixin');
    }

    public function it_should_return_production_env()
    {
        \F::setEnv('product');
        $this->make('/czweixin/school/view?id=310')->shouldHaveType('Url\Rules\ProductionEnv');
    }
}
