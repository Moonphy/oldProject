package com.qipeipu.crm.dtos.visit;

import lombok.Data;

import java.util.List;

/**
 * Created by laiyiyu on 2015/4/2.
 */
@Data
public class PartDetailEntity {

    private String orderDetailID;

    private Integer stockSnapShotID;

    private Integer inquiryDetailId;

    /**
     * 单价
     */
    private Double unitPrice;


    /**
     * 询价单报价列表
     */
    private List<QuotedetailEntity> quotedetailEntityList;


    /**
     * 配件名称
     */
    private String PartsName;


    private Integer carTypeID;

    private Integer num;

}
