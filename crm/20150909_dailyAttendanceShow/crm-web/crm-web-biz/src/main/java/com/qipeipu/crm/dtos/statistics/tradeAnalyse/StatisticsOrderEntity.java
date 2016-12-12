package com.qipeipu.crm.dtos.statistics.tradeAnalyse;

import com.qipeipu.crm.dtos.statistics.tradeAnalyse.storageStructure.StatisticsMfctyEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

import java.util.Map;

/**
 * Created by laiyiyu on 2015/4/16.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class StatisticsOrderEntity {
    /**
     * 总订单数
     */
    private Integer orderNum;
    /**
     * 所有订单总额
     */
    private Double totalOrder;
    /**
     * 平均订单额
     */
    private Double orderAverageAmount;
    /**
     * 在选择时间段内注册
     */
    private int dateRangeRegisterNum;
    /**
     * 注册审核通过到首单的平均天数
     */
    private Double registerToFirstTradeDayAverage;
    /**
     * 注册审核通过到激活的平均天数
     */
    private Double sensitizeToFirstTradeDayAverage;
    /**
     * 注册客户数:汽修厂状态为2的即通过审核，根据筛选条件变化
     */
    private int registerNum;
    /**
     * 活跃客户数
     */
    private int activateNum;
    /**
     * 激活客户数
     */
    private int sensitizeNum;
    /**
     * 交易客户数量
     */
    private int transactionNum;
    /**
     * 交易客户留存率（时间段内交易客户/累计交易客户数）
     */
    private String tradeStayRatio;
    /**
     *活跃客户留存率（活跃客户数/累计交易客户数）
     */
    private String activateRatio;
    /**
     * 厂集合
     */
    private Map<String, StatisticsMfctyEntity> statisticsMfctyEntityMap;
}
