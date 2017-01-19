<?php

use Modules\Huodong\Bestvoice\User;

class Weixin_AccountController extends Yaf_Controller_Abstract
{
    public function init() {
        $this->userObj = new User();
    }

    public function callbackAction() {

        $state  = V('g:state');
        $uid    = V('g:uid');
        $timestamp = V('g:timestamp');
        $ticket = V('g:ticket');
        $errno  = V('g:errno');
        $openid = V('g:openid');
        $message = V('g:message');
        $callback = V('g:callback');
        $catid     = V('g:catid');
        
        /*if(!Ticket::validTicket($ticket, $openid, $timestamp, CFG::teacher('catinfo', 'catkey'))) {
            F::err404('', 'Teacher');
            F::log($ticket.'-'.$openid.'-'.$timestamp, 'teacher', 'account');
        }*/

        if(empty($errno)) {
            $uInfo = F::api('auth:/Auth/Weixin/get', array('uid'=>$uid, 'catid'=>$catid?:CFG::huodong('default_catid')));
            if(!isset($uInfo['errno']) && !empty($uInfo)){
                $params = array(
                    'id'        => $uInfo['uid'],
                    'nickname'  => $uInfo['nickname'],
                    'headimgurl'=> $uInfo['headimgurl'],
                    'sex'       => $uInfo['sex'],
                    'openid'    => $openid,
                    'unionid'   => $uInfo['unionid'],
                );

                //创建为本地用户
                $rs = $this->userObj->save($params);

                if(!isset($uInfo['errno']) && !empty($uInfo)){
                    F::redirect($callback);
                }else{
                    $this->getView()->assign('errno', '100001'); //本地保存失败   
                    $this->getView()->assign('msg', '登录失败');
                }

            }else{
                $this->getView()->assign('errno', '100002'); //本地保存失败   
                $this->getView()->assign('msg', '微信授权登录失败');
            }                       
        }else{
            if($state=='order'){
                $this->getView()->assign('msg', '微信授权登录失败');
                $this->getView()->assign('errno', '100003'); //本地保存失败 
            }else{
                $this->getView()->assign('msg', '微信授权登录失败');                
                $this->getView()->assign('errno', '100004'); //本地保存失败 
            }
        }
        header('Content-Type:text/html; charset=UTF-8');
        $time = time();
        $debugInfo = [$time, $errno, $uid, $openid, $message];
        //$this->getView()->assign('rturl', F::URL('/Teacher/Teacher/list'));
        //$this->getView()->display('common/tips.html');
        F::log('微信授权登录失败:'.implode('_', $debugInfo));
        die("微信授权登录失败: {$errno}_{$time} 请与客服联系！");
        return false;
    }
}