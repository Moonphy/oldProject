<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/6/17
 * Time: 上午10:26
 */

namespace Adapters\Captcha;


Interface CaptchaInterface
{
    /**
     * 获取图片
     * @param array $options
     * @return mixed
     */
    public function getImage(array $options = []);

    /**
     * 获取验证码
     * @return string
     */
    public function getCode();

    /**
     * 验证用户输入的验证码
     * @param $inputCode 用户输入的验证码
     * @return bool
     */
    public function isValid($inputCode);

    /**
     * 重置验证码
     * @return mixed
     */
    public function resetCode();

}