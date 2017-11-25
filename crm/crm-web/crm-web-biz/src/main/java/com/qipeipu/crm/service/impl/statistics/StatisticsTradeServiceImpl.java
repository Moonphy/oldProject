package com.qipeipu.crm.service.impl.statistics;

import com.google.common.collect.Maps;
import com.qipeipu.crm.dao.QpuOrgDao;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.StatisticsInqueryEntity;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.StatisticsOrderEntity;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.StatisticsReturnEntity;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.StatisticsTradeEntity;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.storageStructure.StatisticsMfctyEntity;
import com.qipeipu.crm.service.impl.statistics.utilInterface.StatisticsByMfctyMethod;
import com.qipeipu.crm.service.impl.statistics.utilInterface.StatisticsMfctyGroupByCityMethod;
import com.qipeipu.crm.service.statistics.StatisticsInquiryService;
import com.qipeipu.crm.service.statistics.StatisticsOrderService;
import com.qipeipu.crm.service.statistics.StatisticsReturnGoodsService;
import com.qipeipu.crm.service.statistics.StatisticsTradeService;
import com.qipeipu.crm.service.statistics.param.StatisticsQuneryConditionEntity;
import com.qipeipu.crm.utils.bean.tools.TimeUtil;
import com.qipeipu.crm.utils.statistics.DateRange;
import com.qipeipu.crm.utils.statistics.TransformUtil;
import lombok.extern.java.Log;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * Created by laiyiyu on 2015/4/22.
 */
@Log
@Service
public class StatisticsTradeServiceImpl implements StatisticsTradeService {

    @Autowired
    private StatisticsOrderService statisticsOrderService;
    @Autowired
    private StatisticsInquiryService statisticsInquiryService;
    @Autowired
    private StatisticsReturnGoodsService statisticsReturnGoodsService;
    @Autowired
    private StatisticsByMfctyMethod statisticsByMfctyMethod;
    @Autowired
    private StatisticsMfctyGroupByCityMethod statisticsMfctyGroupByCityMethod;
    @Autowired
    private QpuOrgDao qpuOrgDao;

    @Override
    public StatisticsTradeEntity statisticsTrade(DateRange dateRange, List<Integer> mfctyIDs){
        StatisticsTradeEntity tradeEntity = StatisticsTradeEntity.builder().build();
        StatisticsOrderEntity orderEntity = StatisticsOrderEntity.builder().build();
        StatisticsInqueryEntity inquiryEntity = StatisticsInqueryEntity.builder().build();
        StatisticsReturnEntity returnEntity = StatisticsReturnEntity.builder().build();
        //Map<String, StatisticsMfctyEntity> statisticsMfctyEntityMapForTrade = Maps.newHashMap();
        statisticsOrderService.statisticsOrderByAllMfcty(dateRange, mfctyIDs, orderEntity);
        Map<String, StatisticsMfctyEntity> statisticsMfctyEntityMapForOrder = orderEntity.getStatisticsMfctyEntityMap();
        if(statisticsMfctyEntityMapForOrder==null){
            statisticsMfctyEntityMapForOrder = Maps.newHashMap();
        }
        inquiryEntity.setStatisticsMfctyEntityMap(statisticsMfctyEntityMapForOrder);
        statisticsInquiryService.statisticsOrderByAllMfcty(dateRange, mfctyIDs, inquiryEntity);
        returnEntity.setStatisticsMfctyEntityMap(inquiryEntity.getStatisticsMfctyEntityMap());
        statisticsReturnGoodsService.statisticsReturnGoodsByAllMfcty(dateRange, mfctyIDs, returnEntity);
        tradeEntity.setStatisticsReturnEntity(returnEntity);
        tradeEntity.setStatisticsOrderEntity(orderEntity);
        tradeEntity.setStatisticsInqueryEntity(inquiryEntity);
        return tradeEntity;
    }

    @Override
    public StatisticsTradeEntity statisticsOrderAndReturnTrade(DateRange dateRange, List<Integer> mfctyIDs){
        StatisticsTradeEntity tradeEntity = StatisticsTradeEntity.builder().build();
        StatisticsOrderEntity orderEntity = StatisticsOrderEntity.builder().build();
        StatisticsReturnEntity returnEntity = StatisticsReturnEntity.builder().build();
        statisticsOrderService.statisticsOrderByAllMfcty(dateRange, mfctyIDs, orderEntity);
        returnEntity.setStatisticsMfctyEntityMap(orderEntity.getStatisticsMfctyEntityMap());
        statisticsReturnGoodsService.statisticsReturnGoodsByAllMfcty(dateRange, mfctyIDs, returnEntity);
        orderEntity.setStatisticsMfctyEntityMap(returnEntity.getStatisticsMfctyEntityMap());
        tradeEntity.setStatisticsReturnEntity(returnEntity);
        tradeEntity.setStatisticsOrderEntity(orderEntity);
        return tradeEntity;
    }

    @Override
    public StatisticsTradeEntity statisticsOrderAndInquiryTrade(DateRange dateRange, List<Integer> mfctyIDs){
        StatisticsTradeEntity tradeEntity = StatisticsTradeEntity.builder().build();
        StatisticsOrderEntity orderEntity = StatisticsOrderEntity.builder().build();
        StatisticsInqueryEntity inquiryEntity = StatisticsInqueryEntity.builder().build();
        statisticsOrderService.statisticsOrderByAllMfcty(dateRange, mfctyIDs, orderEntity);
        inquiryEntity.setStatisticsMfctyEntityMap(orderEntity.getStatisticsMfctyEntityMap());
        statisticsInquiryService.statisticsOrderByAllMfcty(dateRange, mfctyIDs, inquiryEntity);
        tradeEntity.setStatisticsInqueryEntity(inquiryEntity);
        tradeEntity.setStatisticsOrderEntity(orderEntity);
        return tradeEntity;
    }

    @Override
    public StatisticsTradeEntity statisticsOrderTrade(DateRange dateRange, List<Integer> mfctyIDs){
        StatisticsTradeEntity tradeEntity = StatisticsTradeEntity.builder().build();
        StatisticsOrderEntity orderEntity = StatisticsOrderEntity.builder().build();
        statisticsOrderService.statisticsOrderByAllMfcty(dateRange, mfctyIDs, orderEntity);
        tradeEntity.setStatisticsOrderEntity(orderEntity);
        return tradeEntity;
    }





    /**
     * 微信统计个人的订单情况
     * @param statisticsQuneryConditionEntity
     * @return
     */
    @Override
    public List<StatisticsOrderEntity> statisticsTodayOrderForWx(StatisticsQuneryConditionEntity statisticsQuneryConditionEntity){
        List<StatisticsOrderEntity> result = new ArrayList<>();
        List<Integer> mfctyIDsForMethod = statisticsByMfctyMethod.getMfctyIDsByQueryCondition(statisticsQuneryConditionEntity);

        if(CollectionUtils.isEmpty(mfctyIDsForMethod)){
            return Collections.EMPTY_LIST;
        }
        String today = TimeUtil.getCurrentTime().substring(0, 10);
        String end = TimeUtil.getNextDay(today);
        DateRange dateRange = DateRange.builder().endDate(end).startDate(today).build();
        StatisticsOrderEntity orderEntity = StatisticsOrderEntity.builder().build();
        statisticsOrderService.statisticsOrderByAllMfcty(dateRange, mfctyIDsForMethod, orderEntity);
        orderEntity.setStatisticsMfctyEntityMap(null);
        result.add(orderEntity);
        return result;
    }

    @Override
    public StatisticsOrderEntity statisticsTotalOrderForWx(){
        String today = TimeUtil.getCurrentTime().substring(0, 10);
        String next = TimeUtil.getNextDay(today);
        DateRange dateRange = new DateRange("2010-01-01", next);
        List<String> mfctyIDsForString = qpuOrgDao.getAllIDs();
        List<Integer> mfctyIDs = TransformUtil.StringToIntegerList(mfctyIDsForString);
        StatisticsOrderEntity orderEntity = StatisticsOrderEntity.builder().build();
        statisticsOrderService.statisticsOrderByAllMfcty(dateRange, mfctyIDs, orderEntity);
        orderEntity.setDateRangeRegisterNum(orderEntity.getRegisterNum());
        orderEntity.setStatisticsMfctyEntityMap(null);
        return orderEntity;
    }




}
