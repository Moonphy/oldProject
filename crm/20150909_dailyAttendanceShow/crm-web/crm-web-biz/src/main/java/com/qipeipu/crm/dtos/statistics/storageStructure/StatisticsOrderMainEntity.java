package com.qipeipu.crm.dtos.statistics.storageStructure;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

import java.util.List;

/**
 * Created by laiyiyu on 2015/4/16.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class StatisticsOrderMainEntity {
    /**
     * 订单id
     */
    private String orderMainID;
    /**
     * 订单号
     */
    private String orderMainNo;
    /**
     * 单张订单总额
     */
    private Double money;
    /**
     * 厂id
     */
    private String mfctyID;
    /**
     * 生成时间
     */
    private String publishTime;
    /**
     * 1为成功
     */
    private Integer payStatus;
    /**
     * 订单明细集合
     */
    private List<StatisticsOrderDetailEntity> statisticsOrderDetailEntityList;
}
