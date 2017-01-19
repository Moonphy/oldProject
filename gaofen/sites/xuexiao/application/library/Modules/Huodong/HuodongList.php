<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/8/20
 * Time: 上午10:53
 */

namespace Modules\Huodong;


use Modules\Cms\HuodongRepo;

class HuodongList
{
    /**
     * @var HuodongRepo
     */
    private $repo;

    public function __construct(HuodongRepo $repo)
    {
        $this->repo = $repo;
    }

    public function get($page = 1, $limit = 8)
    {
        return $this->repo->findBy(['page' => $page, 'count' => $limit, 'show_with_form_id'=>true]);
    }
}