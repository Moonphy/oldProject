<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/6/1
 * Time: 下午4:21
 */

namespace Modules\Form\Backend;


class DashboardModel
{
    /**
     * @var FormRepo
     */
    private $repo;

    public function __construct(FormRepo $repo)
    {
        $this->repo = $repo;
    }

    public function getMyForms($page = 1, $limit = 20)
    {
        return $this->repo->paginate($page, $limit, []);
    }

    public function create(array $data)
    {
        return $this->repo->create($data);
    }

}