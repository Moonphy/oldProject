package com.qipeipu.crm.service.impl.statistics.utilInterface;

import com.qipeipu.crm.service.statistics.param.StatisticsQuneryConditionEntity;

import java.util.List;

/**
 * Created by laiyiyu on 2015/5/5.
 */
public interface StatisticsMfctyByQueryConditionMethod {
    public List<Integer> getMfctyIDsByQueryCondition(StatisticsQuneryConditionEntity statisticsQuneryConditionEntity);
}
