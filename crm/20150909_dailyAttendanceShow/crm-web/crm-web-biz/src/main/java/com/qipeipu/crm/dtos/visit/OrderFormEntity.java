package com.qipeipu.crm.dtos.visit;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

import java.util.List;

/**
 * Created by laiyiyu on 2015/4/2.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class OrderFormEntity {
    /**
     * 主订单表id
     */
    private String orderMainID;

    /**
     * 主订单号
     */
    private String orderMainNo;
    /**
     * 发布时间
     */
    private String publishTime;

    /**
     * 订单状态
     */
    private Integer orderStatus;


    private Integer payStatus;


    /**
     * 总金额
     */
    private Double money;


    private Integer allNum;

    private String orgID;

    private String mfctyName;

    private String payTime;



    private List<PartDetailEntity> partDetailEntityList;



}
