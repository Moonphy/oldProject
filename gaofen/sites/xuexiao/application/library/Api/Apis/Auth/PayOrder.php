<?php
namespace Api\Apis\Auth;

use Api\OpenApi;

class PayOrder extends \Api\Apis\Base
{
    private $_base = null;

    public function __construct(\Api\Base\Auth\PayOrder $base)
    {
        $this->_base = $base;
    }

    public function get($p = array())
    {
        $id = OpenApi::param($p, 'id');
        $useFormat = OpenApi::param($p, '_useFormat', false);

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
        $useFormat = OpenApi::param($p, '_useFormat', false);

        if (empty($ids) || !is_array($ids)) {
            return array();
        }

        $list = $this->_base->getBatch($ids, false, $useFormat);

        return $list;
    }

    /**
     * 创建订单
     * @param  int $catid 约定订单分类ID，每个项目都不同（必填）
     * @param  int $pid 商品ID（必填）
     * @param  int $uid 本地用户ID
     * @param  int $uname 本地用称或订单人姓名
     * @param  int $order_type 订单分类，按项目实际使用
     * @param  int $pay_type 2:线下支付 1:微信支付
     * @param  int $amount 数量
     * @param  float $fee 商品单价
     * @param  float $total_fee  总价格
     * @param  string $attach 附加数据,原样反回给notify_url
     * @param  int $order_status 订单状态 -1:取消 1:未处理 2:已处理 3进行中 4:订单完成
     * @return [type]    [description]
     */
    public function create($p = array())
    {

        if(empty($p['catid'])) {
            OpenApi::throwException(100001, '缺少catid');
        }

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

    /**
     * 获取条件订单数量
     * 订单查询接口：
     * 参数：
     * status:状态，格式："pay_status"-"order_status"-"refund_status"，多个用逗号隔开
     * @param  array  $p [description]
     * @return [type]    [description]
     */
    public function count(array $p=array()){

        $status = OpenApi::param($p, 'status');
        $uid    = OpenApi::param($p, 'uid');
        $catid  = OpenApi::param($p, 'catid');
        
        $total_number = [];
        $params['uid'] = $uid;
        $params['uids'] = $uid;
        $params['catid'] = $catid;        

        $total_number[] = count($this->_base->listIdsByCond($params));
        foreach($status as $cond){
            $cond = array_merge($cond, $params);
            $total_number[] = count($this->_base->listIdsByCond($cond));
        }

        $rs = ['total_number'=>$total_number];
       /*
       $cond = [];
       foreach($status as $k=>$row){
            $cond[$k] = (!empty($row['pay_status'])?$row['pay_status']:0).'-'.
                        (!empty($row['order_status'])?$row['order_status']:0).'-'.
                        (!empty($row['refund_status'])?$row['refund_status']:0);
       }

       $params['status'] = implode(',', $cond);
       $rs = \F::api('sphinx:/order/search', $params);
       */
       
        return $rs;
    }


    /**
     * SQL查询
     * @param  array  $p [description]
     * @return [type]    [description]
     */
    public function query($p = array()) {
        $sql = OpenApi::param($p, 'sql');
        $rs = $this->_base->query($sql, 'select');

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
