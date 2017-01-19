<?php
namespace Modules\Huodong\BaseTask;

use F;

abstract class Material
{
    protected $_material;
    protected $_type;

    public function __construct($type)
    {
        $this->_type = $type;
        $this->_material = null;
    }

    public function __get($key) {
        if(!is_null($this->_material) && isset($this->_material[$key])){
            return $this->_material[$key];
        }
        return null;
    }

    public function setByMid($mid) {
        if (!$mid) {
            return false;
        }
        $item = F::api('/Huodong/Bestvoice/Material/get', [
            'id' => $mid,
            //'_autoIncView' => true
        ]);

        if (isset($item) && $item->type == $this->_type) {
            $this->_material = $item;
            return true;
        }

        return false;
    }

    public function setByUid($uid) {
        if (!$uid) {
            return false;
        }
        $items =  F::api('/Huodong/Bestvoice/Material/listByCond', [
            'type' => $this->_type,
            'uid' => $uid,
            'limit' => 1
        ]);

        if (!empty($items['list'][0]->id)) {
            $this->_material = $items['list'][0];
            return true;
        }

        return false;
    }

    public function getImageLink() {
        $link = '';
        if(\F::inEnv('develop')) {
            $link = '/data/uploads'.$this->path;
        } else {
            $link = GAOFEN_STATIC.$this->path;
        }
        return $link;
    }

}

