package com.qipeipu.crm.dtos.visit;

import lombok.Data;

/**
 * Created by laiyiyu on 2015/3/27.
 */
@Data
public class BusinessMessageEntity {
    /**
     * 客户Id
     */
    private Integer custID;


    /**
     * 采购人
     */
    private String buyUser;

    /**
     * 月销售额
     */
    private String monthBuy;

    /**
     * 支付人
     */
    private String payUser;

    /**
     * 本地采购比例
     */
    private Integer localPercent;

    /**
     * 有无汽配铺帐号
     */
    private Boolean existAccount;

    /**
     * 备注
     */
    private String memo;


    private String updateTime;


    private String createTime;








}
