<?php

if (!defined('IN_ANWSION'))
{
    die;
}

class gaofen_account_class extends AWS_MODEL
{   

    const _TABLE = 'users_gaofen';

    /**
     * 高分网微信uid与高分家长uid做一个映射表
     * @param  [type] $uid               [description]
     * @param  [type] $gaofen_uid [description]
     * @return [type]                    [description]
     */
    function map_uid_to_gaofen_uid($uid, $gaofen_uid) {
        $rs = $this->fetch_row(static::_TABLE, 'uid='.(int)$uid);
        $time = time();
        if(!$rs) {
            $this->insert(static::_TABLE, ['uid'=>$uid, 'gaofen_uid'=>$gaofen_uid, 'add_time'=>$time, 'update_time'=>$time]);
        }else{
            $this->update(static::_TABLE, ['gaofen_uid'=>$gaofen_uid, 'update_time'=>$time], 'uid='.(int)$rs['uid']);
        }

        return true;
    }

    /**
     * 获取映射表数据
     * @param  [type] $uid [description]
     * @return [type]      [description]
     */
    public function get_gaofen_user_by_uid($uid) {
        $res = $this->fetch_row(static::_TABLE, "uid='{$uid}'");
        if($res['tmp_settings'] == ''){
            // 获取默认模板配置
            $template_config = AWS_APP::config()->get('weixin_template');
            $tmp_settings = json_encode($template_config->settings);
            $data = [
                'tmp_settings' => $tmp_settings
            ];
            // 保存默认模板配置
            $affect = $this->update_user_gaofen_uid($data, $uid);
            if($affect){
                $res['tmp_settings'] = $tmp_settings;
            }
        }
        return $res;
    }


    /**
     * 打赏奖金
     * @param  [type] $uid   [description]
     * @param  [type] $money [description]
     * @return [type]        [description]
     */
    public function reward_by_uid($uid, $money) {
        $money = (double)$money;
        return $this->calc_by_uid_by_field($uid, 'total_reward', $money);
    }

    /**
     * 提取奖金
     * @param  [type] $uid   [description]
     * @param  [type] $moeny [description]
     * @return [type]        [description]
     */
    public function draw_reward_by_uid($uid, $money) {
        
        $money = (double)$money;
        return $this->calc_by_uid_by_field($uid, 'draw_reward', $money);
    }

    /**
     * 冻结奖金
     * @param  [type] $uid   [description]
     * @param  [type] $money [description]
     * @return [type]        [description]
     */
    public function freeze_reward_by_uid($uid, $money) {
        $money = (double)$money;
        return $this->calc_by_uid_by_field($uid, 'freeze_reward', $money);
    }

    /**
     * 增加专家方法数 
     * @param  [type]  $uid [description]
     * @param  integer $num [description]
     * @return [type]       [description]
     */
    public function incr_topic_num($uid, $num=1) {
        return $this->calc_by_uid_by_field($uid, 'topic_num', $num);
    }

    /**
     * 动态未读数增加
     * @param  [type] $uid    [description]
     * @param  [type] $num    [description]
     * @param  string $method [description]
     * @return [type]         [description]
     */
    public function incr_dynamic_unread($uid, $num=1) {
        return $this->calc_by_uid_by_field($uid, 'dynamic_unread', $num);
    }

    /**
     * 动态未读数减少
     * @param  [type]  $uid [description]
     * @param  integer $num [description]
     * @return [type]       [description]
     */
    public function decr_dynamic_unread($uid, $num=1) {
         return $this->calc_by_uid_by_field($uid, 'dynamic_unread', $num, 'decr');
    }

    /**
     * 通知未读数增加
     * @param  [type] $uid    [description]
     * @param  [type] $num    [description]
     * @param  string $method [description]
     * @return [type]         [description]
     */
    public function incr_notification_unread($uid, $num=1) {
        return $this->calc_by_uid_by_field($uid, 'notification_unread', $num);
    }

    /**
     * 通知未读数减少
     * @param  [type] $uid [description]
     * @param  [type] $num [description]
     * @return [type]      [description]
     */
    public function decr_notification_unread($uid, $num=1) {
        return $this->calc_by_uid_by_field($uid, 'notification_unread', $num, 'decr');
    }

    /**
     * 增加粉丝数
     * @param  [type] $uid    [description]
     * @param  [type] $num    [description]
     * @param  string $method [description]
     * @return [type]         [description]
     */
    public function incr_fans_count($uid, $num=1) {
        return $this->calc_by_uid_by_field($uid, 'fans_count', $num);
    }

    /**
     * 减少粉丝数
     * @param  [type] $uid [description]
     * @param  [type] $num [description]
     * @return [type]      [description]
     */
    public function decr_fans_count($uid, $num=1) {
        return $this->calc_by_uid_by_field($uid, 'fans_count', $num, 'decr');
    }

    /**
     * 增加关注数
     * @param  [type] $uid    [description]
     * @param  [type] $num    [description]
     * @param  string $method [description]
     * @return [type]         [description]
     */
    public function incr_friend_count($uid, $num=1) {
        return $this->calc_by_uid_by_field($uid, 'friend_count', $num);
    }

    /**
     * 减少关注数
     * @param  [type] $uid [description]
     * @param  [type] $num [description]
     * @return [type]      [description]
     */
    public function decr_friend_count($uid, $num=1) {
        return $this->calc_by_uid_by_field($uid, 'friend_count', $num, 'decr');
    }

    /**
     * 用作数值字段递增或递减
     * @param  [type] $uid    [description]
     * @param  [type] $field  [description]
     * @param  [type] $value  [description]
     * @param  string $method [description]
     * @return [type]         [description]
     */
    public function calc_by_uid_by_field($uid, $field, $value, $method='incr') {
        $uid = $this->quote($uid);
        $field = $this->quote($field);
        $value = $this->quote($value);

        $sign = ($method =='decr') ? '-':'+';

        $sql = 'UPDATE `'.$this->get_table(static::_TABLE).'` SET `'.$field.'`=`'.$field.'`'.$sign.$value.' WHERE `uid`="'.$uid.'";';
        return $this->db()->query($sql);
    }

    /**
     * [fetch_user_gaofen_uids 查询uids的信息]
     * @param  [type]     $uids [uids数组或字符串]
     * @return [type]           [description]
     * @author ken
     * @date   2016-09-18
     */
    public function fetch_user_gaofen_uids($uids){
        if(is_array($uids)){
            $uids=implode(',', $uids);
        }
        
        $sql="SELECT ";
        $sql.="* ";
        $sql.="FROM aws_users_gaofen ";
        $sql.="WHERE uid in ($uids) ";
        $sql.="ORDER BY field(uid,$uids)";
        $res = $this->query_all($sql);

        foreach ($res as $key => $value) {
            $result[$value['uid']]=$value;
        }

        return $result;
    }

    /**
     * [update_user_gaofen_uid 更新]
     * @param  [type]     $data [description]
     * @param  [type]     $uid  [description]
     * @return [type]           [description]
     * @author ken
     * @date   2016-11-16
     */
    public function update_user_gaofen_uid($data, $uid){
        $affect_num=$this->update(static::_TABLE, $data,"uid = $uid");
        return $affect_num;
    }
}
