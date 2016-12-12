package com.qipeipu.crm.dtos.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

/**
 * Created by laiyiyu on 2015/5/28.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class QpuUserEntity {
    /**
     *用户ID，自增长主键
     */
    private String userID;
    /**
     *父用户ID
     */
    private String parentID;
    /**
     *所在组织ID
     */
    private String orgID;
    /**
     *登陆名
     */
    private String loginName;
    /**
     *登陆手机号
     */
    private String loginMobile;
    /**
     *登陆邮箱
     */
    private String loginEmail;
    /**
     *加密后的密码
     */
    private String password;
    /**
     * 昵称
     */
    private String nickName;
    /**
     * 姓名
     */
    private String userName;
    /**
     * 是否为主帐号
     */
    private Integer isChild;
}
