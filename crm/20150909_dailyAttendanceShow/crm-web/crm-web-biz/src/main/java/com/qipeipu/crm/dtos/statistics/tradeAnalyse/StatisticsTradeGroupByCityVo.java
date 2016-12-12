package com.qipeipu.crm.dtos.statistics.tradeAnalyse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

/**
 * Created by Administrator on 2015/5/22.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class StatisticsTradeGroupByCityVo {
    /**
     * 城市名称
     */
    private String cityName;
    /**
     * 所有订单总额
     */
    private Double totalOrder;
    /**
     * 总订单数
     */
    private Integer orderNum;
    /**
     * 退单总金额
     */
    private double totalChargeback;
    /**
     * 总退单数
     */
    private int totalChargebackNum;
    /**
     * 订单退款率 ： 退款总金额/订单总金额
     */
    private String orderReturnRatio;
    /**
     * 订单出错率 ：总退单数/总订单数
     */
    private String returnNumToOrderNumRatio;
    /**
     * 注册审核通过到首单的平均天数
     */
    private Double registerToFirstTradeDayAverage;
    /**
     * 注册审核通过到激活的平均天数
     */
    private Double sensitizeToFirstTradeDayAverage;
}
