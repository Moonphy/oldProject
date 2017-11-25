package com.qipeipu.crm.dtos.customer;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

/**
 * Created by laiyiyu on 2015/6/3.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class OrgForHitEggEntity {
    /**
     * 组织ID
     */
    private String orgID;
    /**
     *组织名称
     */
    private String mfctyName;
    /**
     *城市名称
     */
    private String cityName;
    /**
     *企业详细地址
     */
    private String address;
    /**
     * 注册时间
     */
    private String auditTime;
    /**
     * 登录主账号
     */
    private String loginAccount;
    /**
     * 创建时间
     */
    private String createTime;
    /**
     * 修改时间
     */
    private String updateTime;
    /**
     * 规则等级
     */
    private Integer ruleLevel;

    //特殊规则帐号个数
    //private Integer superEggPlayerCount ;
}
