<?php
/**
 * 此standard APi是快捷评价插件API，与Comment互不相通，是一个独立存在
 */
namespace Api\Apis\Comment;

use Api\OpenApi;


class Standard extends \Api\Apis\Base
{
    private $_base = null;

    public function __construct(\Api\Base\Comment\Standard $base)
    {
        $this->_base = $base;
    }

    public function get($p = array())
    {
        $id = OpenApi::param($p, 'id');
        $useFormat = OpenApi::param($p, '_useFormat', true);

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

        return $info;
    }

    public function getBatch($p = array())
    {
        $ids = OpenApi::param($p, 'ids');
        $useFormat = OpenApi::param($p, '_useFormat', true);

        if (empty($ids) || !is_array($ids)) {
            return array();
        }

        $list = $this->_base->getBatch($ids, false, $useFormat);

        return $list;
    }

    public function create($p = array())
    {
        $p['ip'] = \F::ip();
        $rs = $this->_base->save($p);

        if (!$rs) {
            OpenApi::throwException(100000, '创建失败');
        }
        return $rs;
    }

    public function update($p = array())
    {
        $id = OpenApi::param($p, 'id');

        if (empty($id)) {
            OpenApi::throwException(100000, '缺少参数');
        }

        $rs = $this->_base->save($p, $id);
        if (!$rs) {
            OpenApi::throwException(100000, '更新失败');
        }

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
            $list = $this->getBatch(array('ids' => $ids, '_useFormat' => $useFormat));
        }
        return array('list' => array_values($list), 'total' => $total);
    }


    public function delete(array $p = array())
    {
        $id = OpenApi::param($p, 'id');

        $rs = $this->_base->delete($id);
        if (!$rs) {
            OpenApi::throwException(10000, '删除失败');
        }

        return $rs;
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
}
