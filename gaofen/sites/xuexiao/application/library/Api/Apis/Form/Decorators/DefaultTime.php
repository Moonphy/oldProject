<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/8/17
 * Time: 下午2:02
 */

namespace Api\Apis\Form\Decorators;

use Carbon\Carbon;
use DateTime;
use Repositories\Contracts\Repository;
use Repositories\Decorators\BaseDecorator;

/**
 * Class DefaultTime
 * 为表单添加和转换默认参与和结束时间
 * @package Api\Apis\Form\Decorators
 */
class DefaultTime extends BaseDecorator
{
    protected $carbon;
    static protected $format = 'Y-m-d H:i:d';

    public function __construct(Repository $repo, Carbon $carbon)
    {
        parent::__construct($repo);
        $this->carbon = $carbon;
    }

    public function create(array $data)
    {
        $data['begin_at'] = $this->convertToDatetime($data, 'begin_at');
        $data['expired_at'] = $this->convertToDatetime($data, 'expired_at');

        return parent::create($data);
    }

    public function update(array $data, $uuid, $attribute = 'id')
    {
        $data['begin_at'] = $this->convertToDatetime($data, 'begin_at');
        $data['expired_at'] = $this->convertToDatetime($data, 'expired_at');

        return parent::update($data, $uuid, $attribute);
    }

    /**
     * 把符合datetime要求目标字段转换成datetime string
     * 如果不符合格式则转换成当前时间的datetime
     * @param array $data
     * @param $field
     * @return string
     */
    public function convertToDatetime(array $data, $field)
    {
        $datetime = isset($data[$field]) && static::verifyDate($data[$field])
            ? $this->carbon->createFromFormat(static::$format, $data[$field])
            : $this->carbon->now();

        return $datetime->toDateTimeString();
    }

    /**
     * 验证时间是否是timestamp格式
     * @param $date
     * @param bool|true $strict
     * @return bool
     */
    static public function verifyDate($date, $strict = true)
    {
        $dateTime = DateTime::createFromFormat(static::$format, $date);
        if ($strict) {
            $errors = DateTime::getLastErrors();
            if (!empty($errors['warning_count'])) {
                return false;
            }
        }

        return $dateTime !== false;
    }

}