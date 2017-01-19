<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/6/9
 * Time: 上午11:05
 */

namespace Api\Apis\Form\Decorators;


use Repositories\Decorators\BaseDecorator;

class FieldsToJson extends BaseDecorator
{
    public function create(array $data)
    {
        return parent::create($this->convertFields($data));
    }

    public function update(array $data, $uuid, $attribute = 'id')
    {
        $data = isset($data['fields']) ? $this->convertFields($data) : $data;

        return parent::update($data, $uuid, $attribute);
    }

    public function convertFields(array $data)
    {
        $data['fields'] = isset($data['fields']) && is_array($data['fields']) ? json_encode($data['fields']) : json_encode([]);

        return $data;
    }

}