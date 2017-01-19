<?php
namespace Presenters\Teacher;

use \Presenters\AbstractModelPresenter;

class User extends AbstractModelPresenter
{
    function __toString() {

    }

    //获取好评率
    public function headimgsize($size=0) {
        $allowSize = [0, 46, 64, 96, 132];
        
        if(substr($this->_model->headimgurl, strrpos($this->_model->headimgurl, '/')+1)!=$size && 
            in_array($size, $allowSize)){
            $this->_model->headimgurl = substr($this->_model->headimgurl, 0, -1).$size;
        }

        return $this->_model->headimgurl;
    }
}
