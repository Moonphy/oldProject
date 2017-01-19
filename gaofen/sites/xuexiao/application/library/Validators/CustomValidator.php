<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/4/28
 * Time: 下午3:17
 */

namespace Validators;


use Illuminate\Validation\Validator;
use Traits\AsteriskTrait;

class CustomValidator extends Validator
{
    use AsteriskTrait;

    /**
     * Validate the existence of an attribute value in a database table.
     *
     * @param  string $attribute
     * @param  mixed $value
     * @param  array $parameters
     * @return bool
     */
    protected function validateAsteriskExists($attribute, $value, $parameters)
    {
        $value = $this->isAsterisk($value) ? $this->removeAsterisk($value) : $value;

        return $this->validateExists($attribute, $value, $parameters);
    }

    protected function validateHashidExists($attribute, $value, $parameters)
    {
        $crypt = \DIBuilder::make('Adapters\Encrypt\EncryptInterface');

        return $this->validateExists($attribute, $crypt->decode($value), $parameters);
    }

}