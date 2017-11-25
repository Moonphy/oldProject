package com.qipeipu.crm.service.statistics.param;

import com.qipeipu.crm.dtos.statistics.crmAnalyse.sortStrategy.StatisticsCrmGroupByCityEntityComparable;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.sortStrategy.StatisticsMfctyEntityComparable;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.sortStrategy.StatisticsTradeGroupByCityEntityComparable;
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
public class StatisticsQuneryConditionEntity {
    /**
     * 用户id
     */
    private Integer userID;
    /**
     * 厂id
     */
    private Integer mfctyID;
    /**
     * 按地区查询条件实体
     */
    private AreaConditionEntity areaConditionEntity;
    /**
     * 按时间查询条件实体
     */
    private TimeConditionEntity timeConditionEntity;
    /**
     * crm统计排序实体
     */
    private StatisticsCrmGroupByCityEntityComparable statisticsCrmGroupByCityEntityComparable;
    /**
     * 总交易排序实体
     */
    private StatisticsTradeGroupByCityEntityComparable statisticsTradeGroupByCityEntityComparable;
    /**
     * 按厂商类别排序实体
     */
    private StatisticsMfctyEntityComparable statisticsMfctyEntityComparable;
}
