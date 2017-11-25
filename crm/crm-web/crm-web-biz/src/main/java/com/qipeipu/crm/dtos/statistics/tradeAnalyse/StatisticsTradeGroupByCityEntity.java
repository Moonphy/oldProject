package com.qipeipu.crm.dtos.statistics.tradeAnalyse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

/**
 * Created by Administrator on 2015/4/27.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class StatisticsTradeGroupByCityEntity {
    /**
     * 城市id
     */
    private Integer cityID;
    /**
     * 城市名称
     */
    private String cityName;
    /**
     * 统计订单实体
     */
    private StatisticsTradeEntity statisticsTradeEntity;
}
