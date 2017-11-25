package com.qipeipu.crm.service.statistics;

import com.qipeipu.crm.dtos.statistics.tradeAnalyse.StatisticsOrderEntity;
import com.qipeipu.crm.utils.statistics.DateRange;

import java.util.List;

/**
 * Created by laiyiyu on 2015/4/16.
 */
public interface StatisticsOrderService {
    /**
     * 统计拥有厂id的客户数据（订单统计）
     * @param dateRange
     * @param mfctyIDs
     * @return
     */
    public void statisticsOrderByAllMfcty(DateRange dateRange, List<Integer> mfctyIDs, StatisticsOrderEntity statisticsOrderEntity);
}
