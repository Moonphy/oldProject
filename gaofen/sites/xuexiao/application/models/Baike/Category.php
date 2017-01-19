<?php

/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/5/8
 * Time: 上午10:54
 */
class Baike_CategoryModel
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

    public function findBySchoolType($limit = 20)
    {
        return $this->repo->findBy([
            'count' => $limit,
            'parent_id' => 0,
            'school_type' => $this->schoolType->toValue()
        ]);
    }
}