<?php 

class Weixin_Everydayenglish_AdminController extends Yaf_Controller_Abstract {
    
    const ASSEMBLAGE_INTEGERAL = 1;//当前积分
    const ASSEMBLAGE_SIGN_IN = 2; //签到数
    const ASSEMBLAGE_CONTUINUE_SIGN_IN = 3; //连续签到次数

    public function init() {
        if(!$this->isLogin() && !in_array(Request::getActionName(), ['login', 'dologin'])) {
            F::redirect(F::URL('/huodong/weixin_Everydayenglish_admin/login'));
        }

        $this->type = CFG::huodong('everydayenglish', 'type');
    }


    public function doLoginAction() {
        $username = V('p:username');
        $password = V('p:password');

        $un = 'everydayenglish201610';
        $up = 'Qxw@*12UzYi';

        if($username===$un && $password===$up) {
            $this->sessData(['login'=>'yes']);
            F::redirect(F::URL('/huodong/weixin_Everydayenglish_admin/index'));
            exit;
        }

        F::redirect(F::URL('/huodong/weixin_Everydayenglish_admin/login', ['msg'=>'帐号或密码不正确！']));
    }

    public function loginAction() {

        $msg = V('g:msg');

        $this->getView()->assign('msg', $msg);
    }

    public function indexAction() {

        $page = max(1, V('g:page', 1));
        $term = (int)V('g:term'); //期数

        $currentTime = time();
        $startTime = strtotime(CFG::huodong('everydayenglish', 'begin_date'));

        $main_page = max((int)(($currentTime - $startTime)/(24*3600))+1, 1);

        $term = $term ?: $main_page;

        $tmp = F::api('/Huodong/Bestvoice/Material/listByCond', ['type'=>$this->type, 'sort'=>'fav_num', 'limit'=>1, 'inviter'=>0, 'page'=>$term]);

        $main = '';
        if(!empty($tmp['list'][0])) {
            $main = $tmp['list'][0];
        }

        $list = ['list'=>[], 'total'=>0];
        if(!empty($main)) {
            $list = F::api('/Huodong/Bestvoice/Material/listByCond', ['type'=>$this->type, 'sort'=>'fav_num', 'inviter'=>$main->id, 'limit'=>20, 'page'=>$page]);
        }

        $this->getView()->assign('main', $main);
        $this->getView()->assign('list', $list);
        $this->getView()->assign('main_page', $main_page);
        $this->getView()->assign('term', $term);
        $this->getView()->assign('startTime', $startTime);
    }

    /**
     * 回复
     * @return [type] [description]
     */
    public function commentAction() {
        $id         = V('p:id');
        $reply      = V('p:reply');

        $rs = F::api('/Huodong/Bestvoice/Material/update', ['id'=>$id, 'ext_data'=>['reply'=>$reply]]);

        $redirect = $_SERVER['HTTP_REFERER'] ?: F::URL('/huodong/weixin_Everydayenglish_admin/index');
        F::redirect($redirect);
    }

    /**
     * 删除
     * @return [type] [description]
     */
    public function deleteAction() {
        $id     = V('g:id');

        $info = F::api('/Huodong/Bestvoice/Material/get', ['id'=>$id]);
        $rs = F::api('/Huodong/Bestvoice/Material/delete', ['id'=>$id]);

        if($rs) {
            $assemblage = F::api('/Huodong/Bestvoice/Assemblage/listByCond',['uid' => $info->uid, 'type' => $this->type,]);

            if(!empty($assemblage['list'])) {
                foreach($assemblage['list'] as $row) {
                    switch($row->cond1) {
                        case static::ASSEMBLAGE_INTEGERAL:
                            F::api('/Huodong/Bestvoice/Assemblage/get', ['id'=>$row->id, '_autoIncView'=>-1]);
                        break;

                        case static::ASSEMBLAGE_CONTUINUE_SIGN_IN:
                            F::api('/Huodong/Bestvoice/Assemblage/setViews', ['id'=>$row->id, 'views'=>0]);
                        break;
                    }
                }
            }
        }

        $redirect = $_SERVER['HTTP_REFERER'] ?: F::URL('/huodong/weixin_Everydayenglish_admin/index');
        F::redirect($redirect);
    }


    /**
     * 是否登录
     * @return boolean [description]
     */
    private function isLogin() {
        if($this->sessData()) {
            return true;
        }

        return false;
    }

    /**
     * session 处理
     * @param  array  $data [description]
     * @return [type]       [description]
     */
    private function sessData($data=[]) {
        $key = "hudong_everydayenglish_admin_login";

        if(!session_id()) {
            session_start();
        }

        if($data) {
            $_SESSION[$key]['data'] = $data;
        }else{
            return isset($_SESSION[$key]['data']) ? $_SESSION[$key]['data']:false;
        }
    }
}