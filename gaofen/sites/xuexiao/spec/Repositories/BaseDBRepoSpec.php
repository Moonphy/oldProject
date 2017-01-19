<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/3/13
 * Time: 下午5:16
 */

namespace spec\Repositories;

use ORM\CZ\School;
use PhpSpec\ObjectBehavior;
use Prophecy\Argument;
use Repositories\Criteria\Batch;
use spec\PrepareDatabase;


class BaseDBRepoSpec extends ObjectBehavior
{
    protected $_module = 'cz';
    use PrepareDatabase;

    public function let()
    {
        $school = new School;
        $this->beConstructedWith($school);
    }

    public function it_is_initializable()
    {
        $this->shouldHaveType('Repositories\BaseDBRepo');
        $this->shouldHaveType('Repositories\Contracts\Repository');
    }

    /**
     * @before prepareForDatabase
     */
    public function it_should_return_a_model()
    {
        $this->find(1)->shouldHaveType('\Illuminate\Database\Eloquent\Model');
        $this->find(5)->shouldBeNull();

        $this->find(1)->with('scores')->first()->shouldHaveType('\Illuminate\Database\Eloquent\Model');
    }

    public function it_should_return_collection()
    {
        $this->findBy(['id', '<', 10])->shouldHaveType('\Illuminate\Support\Collection');
    }

    public function it_should_work_with_criterion()
    {
        $criterion = new Batch('id', [1, 2, 3]);
        $this->pushCriteria($criterion);

        $this->findBy([])->shouldHaveType('\Illuminate\Support\Collection');

        $this->all([])->fetch('id')->toArray()->shouldEqual(['1', '2']);
    }

}