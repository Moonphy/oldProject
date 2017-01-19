<?php
namespace Service\ThirdParty;
use Service\ThirdParty\Base\WeixinJssdk as sdk;

class WeixinJssdk {

  public function __construct($catid='') {
    $catid = $catid?$catid:\CFG::auth('default_catid');
    $this->app_id = \CFG::auth('cat_list', $catid, 'app_id');
    $this->app_secret = \CFG::auth('weixin_cfg', $this->app_id, 'app_secret');

    $this->sdk = new sdk($this->app_id, $this->app_secret);
  }

  public function __toString(){

  }

  /**
   * 获取配置
   * @param  string $url [description]
   * @return [type]      [description]
   */
  public function getCfg($url='') {
      $cfg = $this->sdk->getSignPackage($url);
      return array_only($cfg, ['appId', 'timestamp', 'nonceStr', 'signature']);
  }

  /**
   * 获取票据
   * @return [type] [description]
   */
  public function getTicket() {
    return ['ticket'=>$this->sdk->getJsApiTicket()];
  }

}
