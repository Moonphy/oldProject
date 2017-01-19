<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/5/4
 * Time: 上午10:40
 */

namespace Modules\Cp;


use Repositories\Decorators\BaseDecorator;
use Repositories\Contracts\Repository;

class HotNews extends BaseDecorator
{
    /**
     * @var
     */
    private $school_type;

    protected $limit;

    /**
     * @param Repository $repo
     * @param $school_type
     * @param int $limit
     */
    public function __construct(Repository $repo, $school_type, $limit = 4)
    {
        parent::__construct($repo);
        $this->school_type = $school_type;
        $this->limit = $limit;
    }

    /**
     * 获取推荐新闻
     * @param array $conditions
     * 'column' => '1',  where column = 1
     * 'column2' => ['>', 1], where column2 > 1
     *
     * @param array $columns
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function findBy(array $conditions, array $columns = ['*'])
    {
        $p = ['flag' => 6, 'school_type' => $this->school_type, 'count' => $this->limit];

        return $this->repo->findBy($p, $columns);
    }

    /**
     * 第一页获取4个推荐新闻
     * @param int $page
     * @param int $limit
     * @param array $conditions
     * @param array $columns
     * @return \Pagination;
     */
    public function paginate($page = 1, $limit = 20, array $conditions, array $columns = ['*'])
    {
        if ($page == 1) {

            $hotnews = $this->findBy([], $columns);

            $hostIds = $hotnews->fetch('ID')->toArray();

            $conditions['noids'] = implode(',', $hostIds);

            $posts = $this->repo->paginate($page, $limit - $hotnews->count(), $conditions);

            $items = $posts->getItems();

            foreach ($hotnews->reverse() as $hotnew) {

                array_unshift($items, $hotnew);
            }

            $posts->setItems($items);

            return $posts;

        }

        return $this->repo->paginate($page, $limit, $conditions, $columns);
    }

}