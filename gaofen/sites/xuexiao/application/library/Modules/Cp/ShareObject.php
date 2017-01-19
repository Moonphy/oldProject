<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/5/8
 * Time: 下午4:02
 */

namespace Modules\Cp;

use Illuminate\Support\Contracts\JsonableInterface;
use Service\ThirdParty\WeixinJssdk;

class ShareObject implements JsonableInterface
{
    /**
     * @var WeixinJssdk
     */
    private $jssdk;

    protected static $cfg;

    public function __construct(WeixinJssdk $jssdk)
    {
        $this->jssdk = $jssdk;
    }

    protected function getCfg()
    {
        if (!self::$cfg) {

            self::$cfg = $this->jssdk->getCfg();
        }

        return self::$cfg;
    }

    public function toJson($options = 0)
    {
        return json_encode($this->getCfg());
    }

    public function __get($name)
    {
        $cfg = $this->getCfg();

        return isset($cfg[$name]) ? $cfg[$name] : null;
    }


}