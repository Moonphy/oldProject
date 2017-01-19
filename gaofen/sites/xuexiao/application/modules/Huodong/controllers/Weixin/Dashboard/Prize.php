<?php

class Weixin_Dashboard_PrizeController extends Yaf_Controller_Abstract
{

    function winnerAction() {
        $passwd = V('p:passwd');
        $type = V('G:type', 3);
        $phone = V('p:phone');
        $isLogin = false;
        $rs = NULL;
        $huang = NULL;
        if($passwd === 'zyp'.date('Ymd')) {
            if($phone) {
                $rs = F::api('/Huodong/Bestvoice/Prize/search', ['type'=>$type, 'phone'=>$phone, 'limit'=>200]);
            }
            $huang = F::api('/Huodong/Bestvoice/Prize/listByCond', ['type'=>$type, 'gift'=>'huangren', 'limit'=>230]);
            //echo '<pre>';
            //var_export($huang);
            $isLogin = true;
        }

        $this->getView()->assign('isLogin', $isLogin);
        $this->getView()->assign('rs', $rs);
        $this->getView()->assign('passwd', $passwd);
        $this->getView()->assign('huang', $huang);
    }
}