<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/6/17
 * Time: 下午2:20
 */

return [

    /**
     * 设置别名
     */
    'aliases' => [
        'paginator' => 'Pagination\Factory',
        'events' => 'Illuminate\Events\Dispatcher',
        'captcha' => 'Adapters\Captcha\CaptchaInterface',
        'encrypt' => 'Adapters\Encrypt\EncryptInterface',
        'logger' => 'Psr\Log\LoggerInterface',
    ],
    /**
     * 指定需要单例的类,接口或别名
     */
    'singleton' => [
        'events' => 'Illuminate\Events\Dispatcher',
        'Adapters\Captcha\CaptchaInterface' => 'Adapters\Captcha\GregwarCaptcha',
        'Psr\Log\LoggerInterface' => 'Adapters\Log\MonologAdapter',
        'Adapters\Encrypt\EncryptInterface' => 'Adapters\Encrypt\HashidAdapter',
        'SchoolType' => function () {
            return new SchoolType(V('R:school_type', 3));
        },
        'Cache\Redis' => function () {
            return \Cache\Redis::getInstance();
        },
        'Hashids\Hashids' => function () {
            return $hashids = new \Hashids\Hashids(DES_KEY);
        },
        'Monolog\Logger' => function () {
            return new \Monolog\Logger(current_modules());
        },
        'Yaf_Dispatcher' => function () {
            return \Yaf_Dispatcher::getInstance();
        },
        'Yaf_Request_Http' => function () {
            return \Yaf_Dispatcher::getInstance()->getRequest();
        }
    ],
    /**
     * 设置绑定
     * 1.指定interface对应要创建的实际类
     * 2.对于在创建时有特殊要求的类,可通过闭包方式来指定创建的方式
     */
    'bind' => [
    ],
];
