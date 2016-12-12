package com.qipeipu.crm.service.statistics;

import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.statistics.crmAnalyse.StatisticsCrmEntity;
import com.qipeipu.crm.dtos.statistics.crmAnalyse.sortStrategy.StatisticsCrmByPersonEntityComparable;
import com.qipeipu.crm.service.statistics.param.StatisticsQuneryConditionEntity;
import com.qipeipu.crm.utils.statistics.DateRange;

import java.io.OutputStream;

/**
 * Created by laiyiyu on 2015/5/18.
 */
public interface StatisticsCrmAnalyseGroupByCityService {
    public void statisticsCrmGroupByCity(StatisticsQuneryConditionEntity statisticsQuneryConditionEntity, VoModel<?, ?> vo);

    public void statisticsOrderAndReturnByCityID(StatisticsCrmByPersonEntityComparable statisticsCrmByPersonEntityComparable, Integer cityID, DateRange dateRange, VoModel<?, ?> vo);

    void statisticsOrderAndReturnByCityIDExportExcel(StatisticsCrmByPersonEntityComparable statisticsCrmByPersonEntityComparable, Integer cityID, DateRange dateRange, OutputStream ops);

    public void getVisitDetailForPerUser(Integer userID, DateRange dateRange, VoModel<?, ?> vo);

    public StatisticsCrmEntity getYesterdayCrmAnalyse();

    public void statisticsCrmGroupByCityExportExcel(StatisticsQuneryConditionEntity statisticsQuneryConditionEntity, OutputStream ops);
}
