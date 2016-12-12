package com.qipeipu.crm.service.statistics;

import com.qipeipu.crm.dtos.statistics.tradeAnalyse.StatisticsTradeGroupByTimeEntity;
import com.qipeipu.crm.service.statistics.param.StatisticsQuneryConditionEntity;

import java.util.List;

/**
 * Created by laiyiyu on 2015/5/5.
 */
public interface StatisticsTradeGroupByTimeService {
    public List<StatisticsTradeGroupByTimeEntity> statisticsOrderGroupByTime(int year, int month, String partitionType, StatisticsQuneryConditionEntity statisticsQuneryConditionEntity);
}
