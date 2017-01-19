<?php

/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/5/4
 * Time: 上午11:56
 */
class SchoolType
{
    static protected $items =
        [
            'school_types' => [3 => '小升初', 2 => '中考', 1 => '高考'],
            'schools' => [3 => '初中', 2 => '高中', 1 => '大学'],
            'alias' => [3 => 'xsc', 2 => 'zhongkao', 1 => 'gaokao'],
        ];

    static protected $grades = [
        3 => [1, 2, 3, 4, 5, 6],
        2 => [7, 8, 9],
        1 => [10, 11, 12]
    ];

    protected $index;

    protected $schoolType = 3;


    public function __construct($schoolType = 3, $index = 'school_types')
    {
        $this->schoolType = $this->translate($schoolType);
        $this->index = $index;
    }

    protected function translate($schoolType)
    {
        if (is_numeric($schoolType) && in_array($schoolType, range(1, 3))) {
            return $schoolType;
        }

        $alias = array_flip(self::$items['alias']);

        return isset($alias[$schoolType]) ? $alias[$schoolType] : 3;
    }

    public function setIndex($index)
    {
        $this->index = $index;

        return $this;
    }

    public function setSchoolType($schoolType)
    {
        $this->schoolType = $schoolType;
    }

    public function getItems()
    {
        return self::$items;
    }

    public function getItem($index)
    {
        return self::$items[$index];
    }

    public function toValue($schoolType = null)
    {
        if ($schoolType) {
            return $this->translate($schoolType);
        }

        return $this->schoolType;
    }

    public function toAlias($schoolType = null)
    {
        return self::$items['alias'][$this->toValue($schoolType)];
    }

    public function toName()
    {
        return self::$items[$this->index][$this->schoolType];
    }

    public function toGrades()
    {
        return self::$grades[$this->toValue()];
    }

    public function toFormatName($prefix = '', $postfix = '')
    {
        $name = $this->toName();

        return "{$prefix}{$name}{$postfix}";
    }

    public function isXsc()
    {
        return $this->toValue() == 3;
    }

    public function isZhongkao()
    {
        return $this->toValue() == 2;
    }

    public function isGaokao()
    {
        return $this->toValue() == 1;
    }
}