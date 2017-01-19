<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/3/18
 * Time: 上午11:15
 */

namespace Traits;


trait Validator
{
    /**
     * @param array $raw_data 待验证的数据
     * @param array $rules    验证规则
     * @param array $message  错误提示的信息
     * @param string $connection 数据库连接
     */
    public function validate(array $raw_data = [], array $rules = [], array $message = [], $connection = '')
    {
        $validator = \Validation::make($raw_data, $rules, $message, $connection);

        if ($validator->fails()) {
            throw new \InvalidArgumentException($validator->getMessageBag()->first(), 1000);
        }
    }
}