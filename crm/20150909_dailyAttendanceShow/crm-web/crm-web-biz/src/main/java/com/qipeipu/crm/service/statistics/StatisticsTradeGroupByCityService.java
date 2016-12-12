package com.qipeipu.crm.service.statistics;

import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.StatisticsTradeEntity;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.sortStrategy.StatisticsMfctyEntityComparable;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.storageStructure.StatisticsMfctyEntity;
import com.qipeipu.crm.service.statistics.param.StatisticsQuneryConditionEntity;
import com.qipeipu.crm.utils.statistics.DateRange;

import java.io.OutputStream;

/**
 * Created by laiyiyu on 2015/4/28.
 */
public interface StatisticsTradeGroupByCityService {

    public void statisticsOrderAndReturnForTradeAnalyse(StatisticsQuneryConditionEntity statisticsQuneryConditionEntity, VoModel<?, ?> vo);

    public void statisticsOrderGroupByCity(StatisticsQuneryConditionEntity statisticsQuneryConditionEntity, VoModel<?, ?> vo);

    public void statisticsOrderAndReturnByCityID(StatisticsMfctyEntityComparable statisticsMfctyEntityComparable, Integer cityID, DateRange dateRange, VoModel<?, ?> vo, boolean isStatisticsReturn);

    public StatisticsTradeEntity statisticsTradeForOrderAndReturn(StatisticsQuneryConditionEntity statisticsQuneryConditionEntity);

    public void statisticsOrderBySpecifyMfcty(DateRange dateRange, Integer mfctyID, VoModel<?, ?> vo);

    public void statisticsInquiryForTradeAnalyse(StatisticsQuneryConditionEntity statisticsQuneryConditionEntity, VoModel<?, ?> vo);

    public void statisticsOrderAndReturnForTradeAnalyseExportExcel(StatisticsQuneryConditionEntity statisticsQuneryConditionEntity, OutputStream ops);

    public StatisticsMfctyEntity statisticsOrderAndReturnByMfctyID(Integer mfctyID, DateRange dateRange);

    public void statisticsOrderAndReturnByCityIDExportExcel(StatisticsMfctyEntityComparable statisticsMfctyEntityComparable, Integer cityID, DateRange dateRange, OutputStream ops);

    public void statisticsOrderGroupByCityExportExcel(StatisticsQuneryConditionEntity statisticsQuneryConditionEntity, OutputStream ops);
}
