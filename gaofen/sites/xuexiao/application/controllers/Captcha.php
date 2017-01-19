<?php

/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/6/17
 * Time: 上午10:41
 */
class CaptchaController extends Yaf_Controller_Abstract
{
    private $captcha;
    use \Filters\ControllerFilterTrait;

    public function init()
    {
        header('Access-Control-Allow-Origin:*');
        $this->filters(['AuthAjaxRequest'], ['except' => ['getcode', 'auth']]);

        $this->filters(['DisableView']);

        $this->captcha = DIBuilder::make('Adapters\Captcha\CaptchaInterface');
    }

    public function authAction()
    {
        if ($this->captcha->isValid(V('g:code', 0))) {

            F::ajaxRst(0);

        } else {
            $this->captcha->resetCode();
            F::ajaxRst([], '711106', '验证码不正确');

        }

    }

    public function getCodeAction()
    {
        header('Content-type: image/jpeg');
        $this->captcha->getImage(['output' => true]);
    }

}