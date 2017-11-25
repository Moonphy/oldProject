package com.qipeipu.crm.service.statistics;

import com.qipeipu.crm.dtos.statistics.tradeAnalyse.StatisticsOrderEntity;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.StatisticsTradeEntity;
import com.qipeipu.crm.service.statistics.param.StatisticsQuneryConditionEntity;
import com.qipeipu.crm.utils.statistics.DateRange;

import java.util.List;

/**
 * Created by Administrator on 2015/4/27.
 */
public interface StatisticsTradeService {

    /**
     * 微信段订单总统计
     * @param statisticsQuneryConditionEntity
     * @return
     */
    public List<StatisticsOrderEntity> statisticsTodayOrderForWx(StatisticsQuneryConditionEntity statisticsQuneryConditionEntity);



    public StatisticsTradeEntity statisticsTrade(DateRange dateRange, List<Integer> mfctyIDs);


    public StatisticsTradeEntity statisticsOrderAndReturnTrade(DateRange dateRange, List<Integer> mfctyIDs);

    public StatisticsTradeEntity statisticsOrderTrade(DateRange dateRange, List<Integer> mfctyIDs);

    public StatisticsTradeEntity statisticsOrderAndInquiryTrade(DateRange dateRange, List<Integer> mfctyIDs);

    public StatisticsOrderEntity statisticsTotalOrderForWx();


}
