<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/4/15
 * Time: 下午2:23
 */

namespace Modules\Cp;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use ORM\CP\Post;
use Repositories\BaseDBRepo;
use Repositories\Contracts\Repository;

class PostRepo extends BaseDBRepo implements Repository
{

    public function __construct(Post $entry)
    {

        parent::__construct($entry);
    }

    /**
     * 根据唯一标示符返回一条记录
     * @param $uuid          唯一标示符, 譬如id
     * @param array $columns 需要返回的字段
     * @return \Illuminate\Database\Eloquent\Model
     */
    public function find($uuid, array $columns = ['*'])
    {
        $p = ['postid' => $uuid];
        $post = \F::api('cp:/post/post', $p);

        if (!$post['rst']['id']) {
            $exception = new ModelNotFoundException;
            $exception->setModel(get_class($this->entry));
            throw $exception;
        }

        $entry = get_class($this->entry);

        return new $entry($post['rst']);
    }

    /**
     * 根据条件返回一个记录集合
     *
     * @param array $columns
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function findBy(array $conditions, array $columns = ['*'])
    {
        $posts = \F::api('cp:/post/search', $conditions);

        if ($posts['rst']['data']) {
            $posts['rst']['data'] = sub_array_to_orm($posts['rst']['data'], get_class($this->entry));
        }

        return new Collection($posts['rst']['data']);
    }

    /**
     * 和findBy一样,不过会带上总记录条数
     * @param int $page
     * @param int $limit
     * @param array $conditions
     * @param array $columns
     * @return \Pagination;
     */
    public function paginate($page = 1, $limit = 20, array $conditions, array $columns = ['*'])
    {
        $conditions['page'] = $page;
        $conditions['count'] = $limit;

        $posts = \F::api('cp:/post/search', $conditions);

        if ($posts['rst']['data']) {
            $posts['rst']['data'] = sub_array_to_orm($posts['rst']['data'], get_class($this->entry));
        }

        $factory = \DIBuilder::make('Pagination\Factory');

        return $factory->make($posts['rst']['data'], $posts['rst']['count'], $limit);
    }

}