package com.qipeipu.crm.service.impl.statistics;

import com.qipeipu.crm.dtos.statistics.tradeAnalyse.StatisticsOrderEntity;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.StatisticsTradeEntity;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.StatisticsTradeGroupByTimeEntity;
import com.qipeipu.crm.service.impl.statistics.utilInterface.StatisticsMfctyByQueryConditionMethod;
import com.qipeipu.crm.service.statistics.StatisticsOrderService;
import com.qipeipu.crm.service.statistics.StatisticsTradeGroupByTimeService;
import com.qipeipu.crm.service.statistics.param.StatisticsQuneryConditionEntity;
import com.qipeipu.crm.utils.bean.tools.TimeUtil;
import com.qipeipu.crm.utils.statistics.DateRange;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Created by laiyiyu on 2015/5/5.
 */
@Service
public class StatisticsTradeGroupByTimeServiceImpl implements StatisticsTradeGroupByTimeService {

    @Autowired
    private StatisticsMfctyByQueryConditionMethod statisticsMfctyByQueryConditionMethod;
    @Autowired
    private StatisticsOrderService statisticsOrderService;

    public List<StatisticsTradeGroupByTimeEntity> statisticsOrderGroupByTime(int year, int month, String partitionType, StatisticsQuneryConditionEntity statisticsQuneryConditionEntity){
        List<StatisticsTradeGroupByTimeEntity> result = new ArrayList<>();
        List<String> dateList = TimeUtil.partitionMonth(year, month, partitionType);
        if(CollectionUtils.isEmpty(dateList)){
            return Collections.EMPTY_LIST;
        }
        List<DateRange> dateRanges = getDateRangesByPartitionDate(dateList);
        List<Integer> mfctyIDs = statisticsMfctyByQueryConditionMethod.getMfctyIDsByQueryCondition(statisticsQuneryConditionEntity);


        System.out.println(mfctyIDs.size()+"-size");

        for(DateRange dateRange : dateRanges){
            System.out.println("start:"+dateRange.getStartDate()+"-"+"end:"+dateRange.getEndDate());
            StatisticsTradeGroupByTimeEntity statisticsTradeGroupByTimeEntity = StatisticsTradeGroupByTimeEntity.builder().build();
            StatisticsTradeEntity statisticsTradeEntity = StatisticsTradeEntity.builder().build();
            StatisticsOrderEntity statisticsOrderEntity = StatisticsOrderEntity.builder().build();
            statisticsOrderService.statisticsOrderByAllMfcty(dateRange, mfctyIDs, statisticsOrderEntity);
            System.out.println(statisticsOrderEntity.getTotalOrder()+"--nima");
            statisticsOrderEntity.setStatisticsMfctyEntityMap(null);
            statisticsTradeEntity.setStatisticsOrderEntity(statisticsOrderEntity);
            statisticsTradeGroupByTimeEntity.setStatisticsTradeEntity(statisticsTradeEntity);
            result.add(statisticsTradeGroupByTimeEntity);
        }
        return result;
    }

    private List<DateRange> getDateRangesByPartitionDate(List<String> input){
        List<DateRange> result = new ArrayList<>();
        for(int i=0;i<input.size();i++){
            if(i==input.size()-1){
                break;
            }
            DateRange dateRange = new DateRange(input.get(i), input.get(i+1));
            result.add(dateRange);
        }
        return result;
    }
}
