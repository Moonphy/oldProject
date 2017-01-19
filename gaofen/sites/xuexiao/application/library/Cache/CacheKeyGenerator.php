<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/3/16
 * Time: 上午11:14
 */

namespace Cache;


use Traits\Validator;

class CacheKeyGenerator implements Contracts\KeyGenerator
{
    use Validator;

    static protected  $_rules = [
        'table' => 'required',
        'type' => 'required|in:entry,query,persist',
        'uuid' => 'required_if:type,entry',
    ];

    static protected $_message = [
        'table.required' => '必须填写{table}',
        'type.required' => '必须填写{type} cache类型名称',
        'type.in' => 'cache类型只能是persist,entry或者query',
        'uuid.required_if' => '查询实体对象缓存必须提供uuid',
    ];

    protected $_params = [];

    /**
     * @param array $params {
     * @option string|array table @required 数据表的名称
     * @option string type (entry|query) @required 数据类型 (目前只有entry, query两种)
     * }
     *
     * @return string
     */
    public function getCacheKey(array $params)
    {
        $this->_params = $params;

        $this->validate($this->_params, self::$_rules, self::$_message);

        $type = ucfirst($params['type']);

        $method = "_generate{$type}Key";

        return $this->$method($params);
    }

    protected function _generateEntryKey()
    {
        $table = $this->_params['table'];
        $uuid = $this->_params['uuid'];

        return "entry.{$table}.{$uuid}";
    }

    protected function _generateQueryKey()
    {
        $table = $this->_params['table'];

        $params = array_except($this->_params, ['table', 'type']);
        ksort($params);

        $queryKey = "query.{$table}.";

        $p = [];
        foreach ($params as $k => $v) {
            $p[] = "{$k}.{$v}";
        }

        $queryKey .= implode('.', $p);
        return $queryKey;
    }
}