<?php
/**
 * 可带时间限制的凭据生成/验证类
 */

namespace Service;

class Ticket {

	/**
	 * [genTicket description]
	 * @param  [type] $uuid      [description]
	 * @param  [type] $timestamp [description]
	 * @param  [type] $salt      [description]
	 * @return [type]            [description]
	 */
	public static function genTicket($uuid, $timestamp, $salt) {
        return md5(implode('#', array($salt, $uuid, $timestamp)));
    }

    /**
     * [validTicket description]
     * @param  [type]  $ticket    [description]
     * @param  [type]  $uuid      [description]
     * @param  [type]  $timestamp [description]
     * @param  [type]  $salt      [description]
     * @param  integer $expire    [description]
     * @return [type]             [description]
     */
    public static function validTicket($ticket, $uuid, $timestamp, $salt, $expire=0){
        if($expire>0 && (($timestamp+$expire)>time())) return false;
        return $ticket===static::genTicket($uuid, $timestamp, $salt);
    }
}