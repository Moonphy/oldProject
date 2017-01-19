<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/6/23
 * Time: 下午5:01
 */

namespace Filters;


use Adapters\Captcha\CaptchaInterface;
use F;
use Filters\Contracts\ControllerFilter;
use Yaf_Request_Http;

class AuthCaptcha extends ControllerFilterBase implements ControllerFilter
{
    /**
     * @var CaptchaInterface
     */
    private $captcha;

    public function __construct(CaptchaInterface $captcha, ControllerFilter $nextFilter = null)
    {
        parent::__construct($nextFilter);

        $this->captcha = $captcha;
    }

    /**
     * 执行过滤器的主方法
     * @param Yaf_Request_Http $request
     * @return mixed
     */
    public function handle(Yaf_Request_Http $request)
    {
        if ($this->shouldExecute($request->getActionName())) {

            $fields = $request->getRequest('fields');
            if (!isset($fields['extData']['captcha']) || !$this->captcha->isValid($fields['extData']['captcha'])) {

                $this->captcha->resetCode();

                if ($request->isXmlHttpRequest()) {

                    F::ajaxRst([], '711106', '验证码不正确');

                } else {

                    print_r(json_decode(F::ajaxRst([], '711106', '验证码不正确', true)));
                    exit;
                }
            }
        }

        $this->next($request);
    }

}