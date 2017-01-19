<?php
use Service\ThirdParty\WeixinJssdk;

class Teacher_CommonModel
{
    //获取地区列表
    public function getWeixinJsCfg() {
        $sdk = new WeixinJssdk();
        $cfg = $sdk->getCfg();
        return json_encode($cfg);
    }

}