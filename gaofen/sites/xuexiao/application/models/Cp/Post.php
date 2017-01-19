<?php


class Cp_PostModel
{
    /**
     * @var \Repositories\Contracts\Repository $repo
     */
    private $repo;
    /**
     * @var SchoolType
     */
    private $school_type;

    /**
     * @param \Repositories\Contracts\Repository $repo
     * @param SchoolType $schoolType
     */
    public function __construct(Repositories\Contracts\Repository $repo, SchoolType $schoolType)
    {
        $this->repo = $repo;
        $this->school_type = $schoolType;
    }

    /**
     * @param int $limit
     * @return \Illuminate\Database\Eloquent\Collection
     * @throws Exception
     */
    public function getHotNews($limit = 4)
    {
        $repo = new \Modules\Cp\CacheHotNews($this->repo);

        $repo = new \Modules\Cp\HotNews($repo, $this->school_type->toValue(), $limit);

        return $repo->findBy([]);
    }

    /**
     * @param $page
     * @param $limit
     * @return \Pagination
     * @throws Exception
     */
    public function getList($page = 1, $limit = 20)
    {
        $p = ['school_type' => $this->school_type->toValue()];

        $repo = new \Modules\Cp\CachePostsAfterWork($this->repo);

        return $repo->paginate($page, $limit, $p);
    }

    /**
     * @param $id
     * @param $page
     * @return \Illuminate\Database\Eloquent\Model
     * @throws Exception
     */
    public function getArticle($id, $page = 1)
    {
        $repo = new \Modules\Cp\CachePostsAfterWork($this->repo);
        $repo = new \Modules\Cp\RelateArticle($repo, 6);

        $post = $repo->find($id);

        $factory = \DIBuilder::make('Pagination\Factory');
        $post = new Pagination\ORMPaginator($factory, $post, 'post_content', $page);

        return $post;
    }

}