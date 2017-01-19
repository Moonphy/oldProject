<?php
namespace Api\Apis\Form\Decorators;

use Api\Repositories\Decorators\HashidDecorator as ParentHashidDecorator;

/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/6/2
 * Time: 下午4:20
 */
class HashidDecorator extends ParentHashidDecorator
{
    public function create(array $params)
    {
        $params['form_id'] = $this->hashidToid($params['form_id']);

        return parent::create($params);
    }

    public function paginate($page = 1, $limit = 1, array $conditions, array $columns = ['*'])
    {
        if (isset($conditions['form_id'])) {

            $conditions['form_id'] = $this->hashidToid($conditions['form_id']);
        }

        return $this->repo->paginate($page, $limit, $conditions, $columns);
    }
}