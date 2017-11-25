package com.qipeipu.crm.service.statistics;

import com.qipeipu.crm.dtos.statistics.tradeAnalyse.StatisticsInqueryEntity;
import com.qipeipu.crm.utils.statistics.DateRange;

import java.util.List;

/**
 * Created by laiyiyu on 2015/4/22.
 */
public interface StatisticsInqueryService {
    /**
     * 统计询单
     * @param dateRange
     * @param mfctyIDs
     * @param input
     */
    public void statisticsOrderByAllMfcty(DateRange dateRange, List<Integer> mfctyIDs, StatisticsInqueryEntity input);
}
