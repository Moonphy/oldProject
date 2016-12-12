package com.qipeipu.crm.dtos.statistics.tradeAnalyse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

/**
 * Created by laiyiyu on 2015/5/5.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class StatisticsTradeGroupByTimeEntity {
    /**
     * 统计订单实体
     */
    private StatisticsTradeEntity statisticsTradeEntity;
}
