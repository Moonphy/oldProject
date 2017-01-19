<?php
namespace Api\Apis\Huodong\Bestvoice;

use Api\OpenApi;

class Material extends \Api\Apis\Base
{
    private $_base = null;

    public function __construct(\Api\Base\Huodong\Bestvoice\Material $base)
    {
        $this->_base = $base;
    }

    public function get($p = array())
    {
        $id = OpenApi::param($p, 'id');
        $useFormat = OpenApi::param($p, '_useFormat', true);
        $autoIncView = OpenApi::param($p, '_autoIncView', false); //是否自动增加流览数

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

        //浏览数+1
        if ($info && $autoIncView) {
            $this->_base->incrUnit('views', $id, $autoIncView);
        }


        return $info;
    }

    /**
     * [getDataById 获取一条记录]
     * @param  array      $p [description]
     * @return [type]        [description]
     * @author ken
     * @date   2016-10-09
     */
    public function getDataById($p = array()){
        $id = OpenApi::param($p, 'id');
        $useFormat = OpenApi::param($p, '_useFormat', true);

        if (empty($id)) {
            return array();
        }

        $info = $this->_base->get($id, true, $useFormat);

        return $info;
    }

    /**
     * [getData 条件获取多条material数据]
     * @param  array      $p [description]
     * @return [type]        [description]
     * @author ken
     * @date   2016-10-10
     */
    public function getData($p = array()){
        $where = OpenApi::param($p, 'where');
        $page = OpenApi::param($p, 'page', 1);
        $limit = OpenApi::param($p, 'limit', 10);

        $page    = max($page, 1);
        $offset = ($page-1)*$limit;

        if(empty($where)) {
            $where = 1;
        }

        $sql = "SELECT * FROM `bestvoice_material` WHERE $where ORDER BY `created_at` DESC LIMIT $offset,$limit";

        $rs = $this->_base->query($sql, 'select');

        return $rs;
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
        $sortBy = OpenApi::param($p, 'sort', 'updated_at');
        $fromIndex = (int)OpenApi::param($p, 'fromIndex', 0);
        $useFormat = OpenApi::param($p, '_useFormat', true);

        $ids = $this->_base->listIdsByCond($p, $sortBy);

        if (empty($ids)) {
            return array('list' => array(), 'total' => 0);
        }

        $total = count($ids);

        $page    = max($page, 1);
        $offset = ($page-1)*$limit;
        $ids    = array_slice($ids, $offset+$fromIndex, $limit);
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

    /**
     * 获取作品排行值
     * @param  array  $p [description]
     * @return [type]    [description]
     */
    public function getRankById(array $p= array()) {
        $id     = OpenApi::param($p, 'id');
        $type   = OpenApi::param($p, 'type');
        $field  = OpenApi::param($p, 'field', 'fav_num');

        return $this->_base->getRankById($id, $type, $field);
    }

    /**
     * 每轮数据备份
     * @param  [type] $type 活动ID
     * @return [type]     [description]
     */
    public function finishRound(array $p= array()) {

        $type = OpenApi::param($p, 'type');

        if(empty($type)) {
            OpenApi::throwException(20000, '缺少参数');
        }

        $date = date('YmdH');
        $sql = sprintf('CREATE TABLE `bestvoice_material_%d_%s` SELECT * FROM `bestvoice_material` WHERE `type`=%d', $type, $date, $type);
        $rs = $this->_base->query($sql);
        if( $rs===true ) {
            $ids = $this->_base->listIdsByCond(['type'=>$type]);

            /**
             * 更新排行值
             */
            foreach($ids as $_id) {
                $this->update(['id'=>$_id, 'pre_rank'=>$this->getRankById(['id'=>$_id, 'type'=>$type])]);
            }

            /**
             * 初始化投票数
             */
            foreach($ids as $_id) {
                $this->_base->setUnit('fav_num', $_id, 0);
            }
            return true;
        }

        return false;
    }

    /**
     * 获取活动投票用户信息
     * @param  array  $p[type] 活动ID
     * @return [type]    [description]
     */
    public function getFavUsers(array $p=array()) {
        $type = (int)OpenApi::param($p, 'type');

        if(empty($type)) {
            OpenApi::throwException(20000, '缺少参数');
        }

        $sql = sprintf('SELECT DISTINCT f.uid ,u.phone, u.nickname FROM `bestvoice_fav` AS f INNER JOIN `bestvoice_material` AS m ON m.id=f.mid INNER JOIN `bestvoice_user` AS u ON u.id=f.uid WHERE m.`type`=%d AND u.phone IS NOT NULL;', $type);
        $rs = $this->_base->query($sql, 'select');

        return $rs;
    }


    /**
     * 获取每轮活动结束时数据
     * @param  array  $p[type] 活动ID
     * @param  array  $p[date] 当轮数据日期，格式:年-月-日 时,
     * @param  array  $p[id]    作品ID
     * @param  array  $p[limit] 获取数据条数
     * @return [type]    [description]
     */
    public function getRoundData(array $p=array()) {
        $type   = (int)OpenApi::param($p, 'type');
        $date   = OpenApi::param($p, 'date');
        $limit  = (int)OpenApi::param($p, 'limit', 5);
        $id     = (int)OpenApi::param($p, 'id');

        if(empty($type) || empty($date)) {
            OpenApi::throwException(20000, '缺少参数');
        }

        $date = date('YmdH', strtotime($date));

        if(empty($date)) {
            OpenApi::throwException(20000, 'date格式不正确');
        }

        if($id) {
            $sql = sprintf('SELECT `id`, `uid`, `fav_num`, `views` FROM `bestvoice_material_%d_%s` WHERE `id`="%d" LIMIT %d;', $type, $date, $id, 1);
        }else{
            $sql = sprintf('SELECT `id`, `uid`, `fav_num`, `views` FROM `bestvoice_material_%d_%s` ORDER BY `fav_num` DESC LIMIT %d;', $type, $date, $limit);
        }
        $rs = [];
        try{
            $rs = $this->_base->query($sql, 'select');
        }catch(\Exception $e) {
            \F::log('error:'.$sql);
        }

        return $rs;
    }

    //match活动搜索
    public function matchSearch(array $p=array()) {
        $keyword = htmlentities(OpenApi::param($p, 'keyword'));
        $limit   = OpenApi::param($p, 'limit', 5);
        $type    = OpenApi::param($p, 'type');
        $rs = [];

        if($keyword) {
            $sql = sprintf('SELECT m.id,m.uid, u.nickname, u.name FROM `bestvoice_material` AS m LEFT JOIN `bestvoice_user` AS u ON (m.uid=u.id) WHERE m.type="%d" AND (u.nickname LIKE "%s" OR u.name LIKE "%s") LIMIT %d;', $type, "$keyword%", "$keyword%", $limit);
            $rs = $this->_base->query($sql, 'select');
        }

        return $rs;
    }

    public function incr(array $p=array()) {
        $field  = OpenApi::param($p, 'field');
        $num    = (int)OpenApi::param($p, 'num', 1);
        $id     = openApi::param($p, 'id');

        if(!in_array($field, ['cmt_num', 'views', 'fav_num_total', 'fav_num'])) {
            OpenApi::throwException(10000, '不允许该字段incr');
        }

        return $this->_base->incrUnit($field, $id, true, $num);
    }

    public function decr(array $p=array()) {
        $field  = OpenApi::param($p, 'field');
        $num    = (int)OpenApi::param($p, 'num', 1);
        $id     = openApi::param($p, 'id');

        if(!in_array($field, ['cmt_num', 'views', 'fav_num_total', 'fav_num'])) {
            OpenApi::throwException(10000, '不允许该字段decr');
        }

        return $this->_base->decrUnit($field, $id, true, $num);
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
