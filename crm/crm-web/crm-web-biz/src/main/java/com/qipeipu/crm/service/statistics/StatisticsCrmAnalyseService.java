package com.qipeipu.crm.service.statistics;

import com.qipeipu.crm.dtos.statistics.crmAnalyse.StatisticsCrmEntity;
import com.qipeipu.crm.utils.statistics.DateRange;

import java.util.List;

/**
 * Created by laiyiyu on 2015/5/8.
 */
public interface StatisticsCrmAnalyseService {
    public void statisticsCrmByAllMfcty(DateRange dateRange, List<Integer> userIDs, StatisticsCrmEntity input);
}
