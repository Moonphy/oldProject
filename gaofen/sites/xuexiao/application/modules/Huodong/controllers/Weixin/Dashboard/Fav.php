<?php

class Weixin_Dashboard_FavController extends Yaf_Controller_Abstract
{

    function usersAction() {
        $passwd = V('p:passwd');
        $type = V('G:type', 2);
        $html = '';
        header('Content-Type:text/html; charset=UTF-8');
        if($passwd === 'zyp'.date('Ymd')) {
            $rs = F::api('/Huodong/Bestvoice/Material/getFavUsers', ['type'=>$type]);
            $html .= '共'.count($rs).'条记录'.PHP_EOL;
            $html .= '<table>'.PHP_EOL;
            foreach($rs as $row) {
                $html .= "<tr><td>{$row['nickname']}</td><td>{$row['phone']}</td></tr>".PHP_EOL ;
            }

            $html .= '</table>';
        }else{
            $html = '<form method="post"><input type="password" name="passwd" placeholder="密码" /><input type="submit" value="确定"/></form>';
        }

        echo $html;
        return false;
    }
}