<?php
namespace Modules\Huodong\Ny2016;

use F;

class Fav
{
    protected $_type = 0;
    protected $_api = '/Huodong/Bestvoice/Fav/';

    public function add($cardId, $userId)
    {
        $fav = $this->get($cardId, $userId);

        if (!isset($fav) || empty($fav)) {
            $fav = F::api($this->_api.'create', [
                'mid' => $cardId,
                'uid' => $userId,
                'type' => $this->getType(),
            ]);
        }
        return $fav;
    }

    public function get($cardId, $userId)
    {
        $fav = F::api($this->_api.'listByCond', [
            'mid' => $cardId, 
            'uid' => $userId, 
            'type' => $this->getType(),
        ]);

        if (empty($fav['list'])) {
            return null;
        }
        return $fav['list'][0];
    }

    public function getList($cardId)
    {
        $fav = F::api($this->_api.'listByCond', [
            'mid' => $cardId,
            'type' => $this->getType(),
            'limit' => 40,
        ]);

        $userIds = array_map(function($c) {
            return $c->uid;
        }, $fav['list']);

        if (empty($userIds)) {
            return [];
        }

        $users = F::api('/Huodong/Bestvoice/User/getBatch', ['ids' => $userIds]);

        $headImgUrls = array_map(function($c) {
            return ['headimgurl' => empty($c->headimgurl)?GAOFEN_STATIC.'/html/weixin/bainian/img/dummies/avatar_48x48.png':$c->headimgurl];
        }, $users);

        return $headImgUrls;
    }

    public function setType($type) 
    {
        $this->_type = $type;
    }

    public function getType()
    {
        return $this->_type;
    }
}
