<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/3/20
 * Time: 上午11:07
 */

namespace spec\Repositories\Decorators;

use ORM\CZ\School;
use PhpSpec\ObjectBehavior;
use Prophecy\Argument;
use Repositories\BaseDBRepo;
use spec\PrepareDatabase;

class WithSpec extends ObjectBehavior
{
    protected $_module = 'cz';
    use PrepareDatabase;

    public function let()
    {
        $school = new School();
        $repo = new BaseDBRepo($school);

        $this->beConstructedWith($repo, $school, ['scores']);
    }

    public function it_should_throw_relation_not_found_excetpion()
    {
        $this->shouldThrow('\Repositories\Exceptions\RelationNotFoundException')
            ->duringvalidateRelation();
    }
}