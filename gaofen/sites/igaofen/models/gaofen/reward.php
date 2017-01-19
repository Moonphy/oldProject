<?php
/**
 * gaofen_account金额操作日志
 */
if (!defined('IN_ANWSION'))
{
    die;
}

class gaofen_reward_class extends AWS_MODEL
{   

    //日志类型
    const RW_TYPE_RWARD     = 1; //收入
    const RW_TYPE_FREEZE    = 2; //冻结
    const RW_TYPE_DRAW      = 3; //提取申请
    const RW_TYPE_PAY       = 4; //支付用户提取

    const _TABLE    = 'user_gaofen_reward_log';
    

    /**
     * 添加日志
     * @param  [type] $uid    [description]
     * @param  [type] $op_uid [description]
     * @param  [type] $money  [description]
     * @param  [type] $type   [description]
     * @param  array  $ext    [description]
     * @return [type]         [description]
     */
    public function add($uid, $op_uid, $money, $type, array $ext=[]) {

        $data = ['uid'=>$uid, 'op_uid'=>$op_uid, 'money'=>$money, 'type'=>$type, 'data'=>is_array($ext)?json_encode($ext):$ext, 'add_time'=>time(), 'update_time'=>time()];
        return $this->insert(static::_TABLE, $data);
    }


    /**
     * 更新
     * @param  [type] $id   [description]
     * @param  array  $data [description]
     * @return [type]       [description]
     */
    public function save($data, $id) {
        $data['update_time'] = time();
        if(isset($data['data']) && is_array($data['data'])) {
            $data['data'] = json_encode($data['data']);
        }
        return $this->update(static::_TABLE, $data, "`id`='{$id}'");
    }

    /**
     * [get_answer 获取一条记录]
     * @param  [type]     $where [description]
     * @param  [type]     $field [description]
     * @return [type]            [description]
     * @author ken
     * @date   2016-08-24
     */
    public function get_reward($where = null,$field= null){
        $res=$this->fetch_field_row(static::_TABLE,$field,$where);
        $ext = json_decode($res['data'], true);
        $res['data'] = $ext?:$res['data'];
        return $res;
    }

    public function get_reward_by_id($id) {
        $id = (int)$id;
        $result = $this->get_reward("`id`='{$id}'");
        return $result;
    }

    /**
     * 获取日志列表
     * @param  array  $params['type']  日志类型
     * @param  array  $params['limit'] 获取条数
     * @param  array  $params['page']  页码
     * @param  bool  $count 是否返回总数
     * @return [type]         [description]
     */
    public function get_list($params=[], $count=false) {
        $type   = $params['type'];
        $limit  = (int)$params['limit'] ?: 20;
        $page   = max((int)$params['page'], 1);

        $fields = ['type', 'uid', 'op_uid'];

        $where = [];
        foreach($fields as $field) {
            if(isset($params[$field])) {
                $where[] = "`{$field}`='{$params[$field]}'";
            }
        }

        if($count) {
            return $this->count(static::_TABLE, implode(' AND ', $where));
        } else {
            $list = $this->fetch_all(static::_TABLE, implode(' AND ', $where), 'id DESC', $limit, ($page-1)*$limit);
            foreach($list as $key=>$row) {
                $ext = json_decode($row['data'], true);
                $list[$key]['data'] = $ext ?: $row['data'];
            }
            return $list;
        }
    }

    /**
     * 添加用户收入记录
     * @param  [type] $uid   [description]
     * @param  [type] $money [description]
     * @param  [type] $ext   [description]
     * @return [type]        [description]
     */
    public function reward_money($uid, $money, $ext){
        return $this->add($uid, 0, $money, static::RW_TYPE_RWARD, $ext);
    }

    /**
     * 提取现金申请
     * @param  [type] $uid   [description]
     * @param  [type] $money [description]
     * @return [type]        [description]
     */
    public function draw_money($uid, $money) {
        return $this->add($uid, 0, $money, static::RW_TYPE_DRAW);
    }

    /**
     * 支付现金
     * @param  [type] $applicant_uid [description]
     * @param  [type] $op_uid        [description]
     * @param  [type] $money         [description]
     * @return [type]                [description]
     */
    public function pay_money($applicant_uid, $op_uid, $money) {
        return $this->add($applicant_uid, $op_uid, $money, static::RW_TYPE_PAY);
    }

    /**
     * 获取提取申请记录
     * @return [type] [description]
     */
    public function draw_histroy($type, $uid, $page=1, $limit=20) {
        $params = ['type'=>$type, 'page'=>$page, 'limit'=>$limit];
        if($uid) {
            $params['uid'] = $uid;
        }
        
        $list   = $this->get_list($params);
        $total  = $this->get_list($params, true);
        return ['list'=>$list, 'total'=>$total];
    }

    
}
