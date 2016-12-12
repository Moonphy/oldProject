package com.qipeipu.crm.dtos.user;

import com.qipeipu.crm.dtos.basedata.AreaDetailEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

/**
 * Created by laiyiyu on 2015/4/9.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class AccountEntity {
    /**
     * 用户ID
     */
    private Integer userId;
    /**
     * 用户名
     */
    private String userName;
    /**
     * 登录名
     */
    private String loginName;
    /**
     * 登录密码
     */
    private String loginPwd;

    /**
     * 用户状态
     */
    private int status;
    /**
     * 是否为管理员
     */
    private Boolean isAdmin;

    /**
     * 微信号
     */
    private String WeCharNo;
    /**
     * 服务号与微信号对应唯一id
     */
    private String openId;
    /**
     * 性别：0-女，1-男
     */
    private Integer Sex;
    /**
     * 手机号
     */
    private String Mp;
    /**
     * 邮箱
     */
    private String Email;
    /**
     * 地区
     */
    private Integer areaId;


    private String createTime;


    private String updateTime;


    private String dutyName;

    private Integer dutyId;

    private AreaDetailEntity areaDetailEntity;

}
