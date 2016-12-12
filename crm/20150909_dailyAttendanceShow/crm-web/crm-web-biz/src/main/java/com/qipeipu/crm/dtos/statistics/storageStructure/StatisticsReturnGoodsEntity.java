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
public class StatisticsReturnGoodsEntity {
    /**
     * 退货单Id
     */
    private String returnID;
    /**
     * 退货单编号
     */
    private String returnCode;
    /**
     * 订单号
     */
    private String orderNo;
    /**
     * 合计退款金额
     */
    private Double totalMoney;
    /**
     * 申请时间
     */
    private String applyTime;
    /**
     * 厂id
     */
    private String mfctyID;
    /**
     * 退单详情集合
     */
    private List<StatisticsReturnGoodsDetailEntity> statisticsReturnGoodsDetailEntityList;
}
