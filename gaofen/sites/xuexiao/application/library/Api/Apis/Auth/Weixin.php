<?php
namespace Api\Apis\Auth;

use Api\OpenApi;

class Weixin extends \Api\Apis\Base
{
    private $_base = null;
    private $_token = null;

    public function __construct(\Api\Base\Auth\Weixin $base, \Api\Base\Auth\WeixinToken $token)
    {
        $this->_base = $base;
        $this->_token = $token;
    }

    public function get($p = array())
    {
        $id         = OpenApi::param($p, 'uid');
        $catid      = (int)OpenApi::param($p, 'catid'); //catid 与 appid 作用一样二选一即可
        $appid      = OpenApi::param($p, 'appid'); //catid 与 appid 作用一样二选一即可
        $useFormat  = OpenApi::param($p, '_useFormat', true);

        if (empty($id)) {
            return array();
        }

        //随机性更新缓存
        //解决每周排名更新排名号不对问题
        $_autoFresh = false;
        if (5 == rand(1, API_CACHE_MAX_REFRESH_NUM)) { //1/20机会更新缓存
            $_autoFresh = true;
        }
        
        $info = $this->_base->get($id, $_autoFresh, $useFormat);

        if(empty($info)) {
            OpenApi::throwException(100000, '数据不存在');
        }
        $this->assignToken($info, $catid, $appid);

        return $info;
    }

    public function getBatch($p = array())
    {
        $ids        = OpenApi::param($p, 'uids');
        $catid      = (int)OpenApi::param($p, 'catid'); //catid 与 appid 作用一样二选一即可
        $appid      = OpenApi::param($p, 'appid'); //catid 与 appid 作用一样二选一即可
        $useFormat  = OpenApi::param($p, '_useFormat', true);

        if (empty($ids) || !is_array($ids)) {
            return array();
        }

        $list = $this->_base->getBatch($ids, false, $useFormat);

        if(empty($list)) {
            OpenApi::throwException(100000, '数据不存在');
        }
        
        foreach($list as $info) {
            $this->assignToken($info, $catid, $appid);
        }

        return $list;
    }

    public function create($p = array())
    {
        $rs = $this->_base->save($p);

        if (!$rs) {
            OpenApi::throwException(100000, '创建失败');
        }

        $this->saveToken($p);

        return $rs;
    }

    public function update($p = array())
    {
        $id = OpenApi::param($p, 'uid');

        if (empty($id)) {
            OpenApi::throwException(100000, '缺少参数');
        }

        $rs = $this->_base->save($p, $id);
        if (!$rs) {
            OpenApi::throwException(100000, '更新失败');
        }

        $this->saveToken($p);

        return $rs;
    }

    public function listByCond(array $p = array())
    {
        $page = OpenApi::param($p, 'page', 1);
        $limit = OpenApi::param($p, 'limit', 30);
        $useFormat = OpenApi::param($p, '_useFormat', true);

        $ids = $this->_base->listIdsByCond($p);

        if (empty($ids)) {
            return array('list' => array(), 'total' => 0);
        }

        $total = count($ids);

        $page    = max($page, 1);
        $offset = ($page-1)*$limit;
        $ids    = array_slice($ids, $offset, $limit);
        $list    = array();
        if ($ids) {
            $list = $this->getBatch(array('uids' => $ids, '_useFormat' => $useFormat));
        }
        return array('list' => array_values($list), 'total' => $total);
    }


    public function delete(array $p = array())
    {
        $id = OpenApi::param($p, 'uid');

        $rs = $this->_base->delete($id);
        if (!$rs) {
            OpenApi::throwException(10000, '删除失败');
        }

        return $rs;
    }

    /**
     * 补充token信息
     * @param  [type] &$info [description]
     * @param  string $catid [description]
     * @param  string $appid [description]
     * @return [type]        [description]
     */
    private function assignToken( &$info , $catid='', $appid='') {
        //现在允许多微信公众号同时使用，所以openid等也会同一用户有多个的情况，适配对应的openid
        $tokenData = ['openid'=>'', 'access_token'=>'', 'refresh_token'=>'', 'expires_in'=>'', 'appid'=>''];

        if( $info && ($catid || $appid) ) {
            $userTokenIds = [];
            if( $catid ) {
                $userTokenIds    = $this->_token->listIdsByCond(['uid'=>$info->uid, 'catid'=>$catid]);
            }elseif( $appid ) {
                $userTokenIds    = $this->_token->listIdsByCond(['uid'=>$info->uid, 'appid'=>$appid]);
            }

            $userTokenId = array_shift($userTokenIds);

            $tmpToken = $tokenData = [];
            if($userTokenId) {
                $tmpToken = $this->_token->get($userTokenId);
            }            
            
            if($tmpToken) { 
                $tmpToken   = $tmpToken->toArray();
                $tokenData  = array_intersect_key($tmpToken, $tokenData);
            }
        }

        if($tokenData) {
            $info->openid       = $tokenData['openid'];
            $info->access_token = $tokenData['access_token'];
            $info->refresh_token= $tokenData['refresh_token'];
            $info->expires_in   = $tokenData['expires_in'];
            $info->appid        = $tokenData['appid'];
        }
        
        return true;

    }

    /**
     * 保存/更新token信息
     * @param  array  $data [description]
     * @return [type]       [description]
     */
    private function saveToken( array $data ) {
        $tokenData  = ['uid'=>'', 'catid'=>'', 'appid'=>'', 'openid'=>'', 'access_token'=>'', 'refresh_token'=>'', 'expires_in'=>''];
        $tokenData  = array_intersect_key($data, $tokenData);
        $userTokenIds    = $this->_token->listIdsByCond(['uid'=>$data['uid'], 'catid'=>$data['catid']]);
        $userTokenId= array_shift($userTokenIds);

        if ($userTokenId) {
            $this->_token->save($data, $userTokenId);
        } else {
            $this->_token->save($data);
        }        

        return true;
    }

///////==============================后台API=================================>

    public function listByCondForAdmin($p = array())
    {
        $page = OpenApi::param($p, 'page', 1);
        $limit = OpenApi::param($p, 'limit', 30);

        $rst = $this->_base->listIdsByCond_db($p, $page, $limit);
        $total = $this->_base->countByCond_db($p);

        $list = $this->getBatch(array('ids' => array_column($rst, 'zMember')));

        return array('list' => $list, 'total' => $total);
    }

    /**
     * 强制更新单元数据
     * @param  [type] $p [description]
     * @return [type]    [description]
     */
    public function saveUnitToDbForAdmin($p)
    {
        $field = OpenApi::param($p, 'field');
        $city = OpenApi::param($p, 'city');

        if (empty($field)) {
            OpenApi::throwException(10000, '缺少参数');
        }

        $rs = $this->_base->saveUnitToDb($field, $city);

        if ($rs) {
            return $rs;
        } else {
            OpenApi::throwException(10000, '没更新到任何数据');
        }
    }
}
