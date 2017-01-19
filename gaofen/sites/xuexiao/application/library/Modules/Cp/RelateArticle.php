<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/5/4
 * Time: 上午11:30
 */

namespace Modules\Cp;

use Repositories\Decorators\BaseDecorator;
use Illuminate\Database\Eloquent\Collection;

class RelateArticle extends BaseDecorator
{

    /**
     * 获取一篇文章,并返回扩展阅读
     * @param $uuid          唯一标示符, 譬如id
     * @param array $columns 需要返回的字段
     * @return \Illuminate\Database\Eloquent\Model
     */
    public function find($uuid, array $columns = ['*'])
    {
        $post = $this->repo->find($uuid, $columns);

        $post->relate_post = sub_array_to_orm($post->relate_post->toArray(), get_class($post));

        if (($need = 6 - $post->relate_post->count()) > 0) {
            $noids = $post->relate_post->fetch('ID')->toArray();
            $params = [
                'cat' => $post->categorys->first(),
                'q' => $post->post_title,
                'postdate' => date("Y-m-d H:i:s", time() - 60 * 60 * 24 * 180),
                'noids' => implode(',', $noids),
                'num' => $need,
            ];

            $posts = $this->findBy($params, $columns);

            $relate_post = $post->relate_post;
            foreach ($posts as $p) {
                $relate_post->add($p);
            }

            $post->relate_post = $relate_post;

        }

        return $post;
    }

    /**
     *
     * @param array $columns
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function findBy(array $conditions, array $columns = ['*'])
    {
        $posts = \F::api('cp:/post/arclist', $conditions);

        if ($posts['rst']['data']) {
            $posts['rst']['data'] = sub_array_to_orm($posts['rst']['data'], 'ORM\CP\Post');
        }

        return new Collection($posts['rst']['data']);
    }

}