package com.qipeipu.crm.dtos.customer;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

import java.util.List;

/**
 * Created by laiyiyu on 2015/6/2.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class OrgForCouponEntity {
    /**
     * 组织ID
     */
    private String orgID;
    /**
     *组织名称
     */
    private String mfctyName;
    /**
     *城市id
     */
    private String cityID;
    /**
     *城市名称
     */
    private String cityName;
    /**
     *企业详细地址
     */
    private String address;
    /**
     *联系人姓名
     */
    private String contactPerson;
    /**
     *联系人手机号
     */
    private String contactMobile;
    /**
     * 注册时间
     */
    private String auditTime;
    /**
     * 优惠劵总额
     */
    private int totalCouponMoney;
    /**
     * 已用优惠券金额
     */
    private Integer usedCouponMoney;
    /**
     * 优惠券汇总集合
     */
    List<CouponTotalEntity> couponTotalEntityList;
}
