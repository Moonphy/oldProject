<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/4/28
 * Time: 下午3:23
 */

namespace Traits;


trait AsteriskTrait
{
    static protected $asterisk = ['-*', '*'];

    public function isAsterisk($value)
    {
        return is_string($value) && ends_with($value, self::$asterisk);
    }

    public function removeAsterisk($value)
    {
        return $this->replaceAsteriskTo($value, '');
    }

    public function replaceAsteriskTo($value, $replace)
    {
        return str_replace(self::$asterisk, $replace, $value);
    }

    public function replaceAsteriskToQuery($value)
    {
        return $this->replaceAsteriskTo($value, '%');
    }

}