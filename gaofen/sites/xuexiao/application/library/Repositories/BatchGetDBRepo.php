<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/3/24
 * Time: 下午4:18
 */

namespace Repositories;


use Traits\Validator;

class BatchGetDBRepo extends BaseDBRepo
{
    use Validator;

    static protected $_rules = [
        'field' => 'required|string',
        'in' => 'required|array'
    ];
    static protected $_messages = [
        'field.required' => '必须提供搜索的字段(field)',
        'field.string' => '字段名(field)必须是字符串',
        'in.required' => '必须提供in',
        'in.array' => 'in',
    ];

    /**
     * 根据条件返回一个记录集合
     * @param array $conditions
     * @param array $columns
     * @return \Illuminate\Support\Collection
     */
    public function findBy(array $conditions, array $columns = ['*'])
    {
        $this->validate($conditions, self::$_rules, self::$_messages);

        $fields = $conditions['field'];
        $ids = $conditions['in'];

        $this->entry = $this->entry->whereIn($fields, $ids);

        $conditions = array_except($conditions, ['in', 'field']);
        return parent::findBy($conditions, $columns);
    }

}