<?php
namespace Presenters\Teacher;

use \Presenters\AbstractModelPresenter;

class Stat extends AbstractModelPresenter
{
    function __toString() {

    }

    //获取好评率
    public function getFavRate() {
        $favRate = 0;
        if($this->_model->cmt_all_num>0) {
            $favRate = round($this->_model->cmt_fav_num/($this->_model->cmt_all_num*5)*100, 0);
        }
        

        return $this->_model->cmt_all_num?(int)$favRate.'%':'暂无评论';
    }
}
