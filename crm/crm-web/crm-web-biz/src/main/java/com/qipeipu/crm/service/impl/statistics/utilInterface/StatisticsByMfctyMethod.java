package com.qipeipu.crm.service.impl.statistics.utilInterface;

import com.qipeipu.crm.service.statistics.param.StatisticsQuneryConditionEntity;

import java.util.List;

/**
 * Created by laiyiyu on 2015/4/16.
 */
public interface StatisticsByMfctyMethod {

    /**
     * 筛选出符合条件得厂商
     * @param statisticsQuneryConditionEntity
     * @return
     */
    public List<Integer> getMfctyIDsByQueryCondition(StatisticsQuneryConditionEntity statisticsQuneryConditionEntity);
}
