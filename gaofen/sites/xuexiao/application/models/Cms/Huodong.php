<?php

/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/5/7
 * Time: 下午1:45
 */
class Cms_HuodongModel
{
    /**
     * @var \Repositories\Contracts\Repository $repo
     */
    private $repo;
    /**
     * @var SchoolType
     */
    private $schoolType;

    /**
     * @param \Repositories\Contracts\Repository $repo
     * @param SchoolType $schoolType
     */
    public function __construct(Repositories\Contracts\Repository $repo, SchoolType $schoolType)
    {
        $this->repo = $repo;
        $this->schoolType = $schoolType;
    }

    public function findByGrade($limit = 20)
    {
        $grades = $this->schoolType->toGrades();
        $repo = new \Modules\Cms\CacheHuodong($this->repo);

        return $repo->findBy(['count' => $limit, 'grade' => last($grades), 'show_with_form_id'=>0]);

    }

}