<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/8/20
 * Time: 下午2:20
 */

namespace Modules\Huodong;

use Modules\Cms\HuodongRepo;

class SpecifyHuodong
{
    /**
     * @var HuodongRepo
     */
    private $repo;

    public function __construct(HuodongRepo $repo)
    {
        $this->repo = $repo;
    }

    public function get($id)
    {
        return $this->repo->find($id);
    }
}