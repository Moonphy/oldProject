<?php
/**
 * 项目名称:  高分CMS
 * 建立日期:  2013年03月20日
 *
 * 实例化rpc对象
 *
 * @作者 yangyouchang <yangyouzhang@gaofen.com>
 * @版本 $Id:
 **/

require 'phprpc/phprpc_client.php';
class Phprpc
{
    public function rpc_dzxclient($server_url = false)
    {
        $server_url = $server_url ? $server_url : 'http://bbs.gaofen.com/api/live/rpc_server.php';
        $rpc = new PHPRPC_Client($server_url);
        return $rpc;
    }
}
