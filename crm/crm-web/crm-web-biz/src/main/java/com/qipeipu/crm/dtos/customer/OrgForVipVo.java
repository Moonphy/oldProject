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
public class OrgForVipVo {
    /**
     * 组织ID
     */
    private String orgID;
    /**
     * 组织名称
     */
    private String mfctyName;
    /**
     * 城市id
     */
    private String cityID;
    /**
     * 城市名称
     */
    private String cityName;
    /**
     * 企业详细地址
     */
    private String address;
    /**
     * 联系人姓名
     */
    private String contactPerson;
    /**
     * 联系人手机号
     */
    private String contactMobile;
    /**
     * 注册时间
     */
    private String auditTime;
    /**
     * 是否为vip会员
     */
    private boolean isVip;
    /**
     * 会员级别Id
     */
    private Integer levelID;

    /**
     * 开始时间
     */
    private String startTime;
    /**
     * 结束时间
     */
    private String endTime;
}
