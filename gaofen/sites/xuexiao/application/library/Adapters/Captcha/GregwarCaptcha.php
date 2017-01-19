<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/6/17
 * Time: 上午10:31
 */

namespace Adapters\Captcha;

use Gregwar\Captcha\CaptchaBuilder;

class GregwarCaptcha implements CaptchaInterface
{
    /**
     * @var CaptchaBuilder
     */
    private $builder;

    public function __construct(CaptchaBuilder $builder)
    {
        $this->builder = $builder;
    }

    /**
     * 获取图片
     * @param array $options
     * @return mixed
     */
    public function getImage(array $options = [])
    {
        $this->builder->build();
        $this->storeToSession();

        if (isset($options['output']) && $options['output']) {

            return $this->builder->output();
        }
        return $this->builder->inline();
    }

    /**
     * 获取本次验证码
     * @return string
     */
    public function getCode()
    {
        return $this->builder->getPhrase();
    }

    /**
     * 验证用户输入的验证码
     * @param $inputCode 用户输入的验证码
     * @return bool
     */
    public function isValid($inputCode)
    {
        $phrase = isset($_SESSION['phrase']) ?  $_SESSION['phrase'] : null;
        return $phrase == $inputCode;
    }

    /**
     * 重置验证码
     * @return mixed
     */
    public function resetCode()
    {
        $builderClass = get_class($this->builder);
        $this->builder = new $builderClass;
        $this->builder->build();
        $this->storeToSession();
    }

    protected function storeToSession()
    {
        $_SESSION['phrase'] = $this->getCode();
    }

}