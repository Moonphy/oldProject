<?php

namespace spec\Api\Apis\Gz;

use PhpSpec\ObjectBehavior;
use Prophecy\Argument;
use Api\Base\Gz\Admitscore as AdmitScoreApiBase;

class AdmitscoreSpec extends ObjectBehavior
{
    protected $_base;

    public function let(AdmitScoreApiBase $base)
    {
        $this->_base = $base;
        $this->beConstructedWith($base);
    }

    public function it_is_initializable()
    {
        $this->shouldHaveType('Api\Apis\Gz\Admitscore');
    }

    public function it_should_return_history(\Api\Apis\Gz\Search $search, \Api\Base\Gz\School $school)
    {
        $p = ['year' => '2011','batch_id' => 1,'range_id' => 0,'luqu_id' => 4];
        $this->history($search, $school, $p)->shouldBeArray();
    }
}
