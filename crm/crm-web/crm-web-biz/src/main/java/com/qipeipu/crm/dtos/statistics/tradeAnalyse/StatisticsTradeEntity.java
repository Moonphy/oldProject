package com.qipeipu.crm.dtos.statistics.tradeAnalyse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

/**
 * Created by laiyiyu on 2015/4/16.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class StatisticsTradeEntity {
    /**
     * 统计订单情况实体
     */
    private StatisticsOrderEntity statisticsOrderEntity;
    /**
     * 统计询单情况实体
     */
    private StatisticsInqueryEntity statisticsInqueryEntity;
    /**
     * 统计退单情况实体
     */
    private StatisticsReturnEntity statisticsReturnEntity;
    /**
     * 订单退款率 ： 退款总金额/订单总金额
     */
    private String orderReturnRatio;
    /**
     * 订单出错率 ：总退单数/总订单数
     */
    private String returnNumToOrderNumRatio;
    /**
     * 注册审核通过到首单的询价单数
     */
    private int regTimeToFirstTradeInqueryNum;
    /**
     *注册审核通过到激活的询价单数
     */
    private int sensitizeTimeToFirstTradeInqueryNum;
}
