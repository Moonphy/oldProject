package com.qipeipu.crm.service.statistics;

import com.qipeipu.crm.dtos.statistics.tradeAnalyse.StatisticsReturnEntity;
import com.qipeipu.crm.utils.statistics.DateRange;

import java.util.List;

/**
 * Created by laiyiyu on 2015/4/22.
 */
public interface StatisticsReturnGoodsService {
    /**
     * 统计退单
     * @param dateRange
     * @param mfctyIDs
     * @param input
     */
    public void statisticsReturnGoodsByAllMfcty(DateRange dateRange, List<Integer> mfctyIDs, StatisticsReturnEntity input);
}
