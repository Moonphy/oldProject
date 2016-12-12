package com.qipeipu.crm.service.impl.statistics;

import com.google.common.collect.HashMultimap;
import com.google.common.collect.Maps;
import com.google.common.collect.Multimap;
import com.qipeipu.crm.dao.WxCustomerDao;
import com.qipeipu.crm.dao.statistics.PtReturnGoodsDao;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.StatisticsReturnEntity;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.storageStructure.StatisticsMfctyEntity;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.storageStructure.StatisticsReturnGoodsEntity;
import com.qipeipu.crm.service.statistics.StatisticsReturnGoodsService;
import com.qipeipu.crm.utils.bean.data.MultipleDataSource;
import com.qipeipu.crm.utils.statistics.DateRange;
import com.qipeipu.crm.utils.statistics.NumParseUtil;
import lombok.extern.java.Log;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

/**
 * Created by laiyiyu on 2015/4/20.
 */
@Log
@Service
public class StatisticsReturnGoodsServiceImpl implements StatisticsReturnGoodsService {

    @Autowired
    private PtReturnGoodsDao ptReturnGoodsDao;
    @Autowired
    private WxCustomerDao wxCustomerDao;

    public void statisticsReturnGoodsByAllMfcty(DateRange dateRange, List<Integer> mfctyIDs, StatisticsReturnEntity input){

        Map<String, StatisticsMfctyEntity> statisticsMfctyEntityMap = input.getStatisticsMfctyEntityMap();
        if(statisticsMfctyEntityMap==null){
            statisticsMfctyEntityMap = Maps.newHashMap();
        }
        statisticsReturnGoods(dateRange, mfctyIDs, statisticsMfctyEntityMap);
        int totalChargebackNum = 0; //总退单数
        double totalChargeback = 0.00; //退单总金额
        for(Map.Entry<String, StatisticsMfctyEntity> entry : statisticsMfctyEntityMap.entrySet()){
            StatisticsMfctyEntity statisticsMfctyEntity = entry.getValue();
            int totalChargebackNumByMfcty = statisticsMfctyEntity.getReturnGoodsNum();
            totalChargebackNum += totalChargebackNumByMfcty;
            double totalChargebackByMfcty = statisticsMfctyEntity.getReturnGoodsMenoy();
            totalChargeback += totalChargebackByMfcty;
        }
        input.setTotalChargebackNum(totalChargebackNum);
        input.setTotalChargeback(NumParseUtil.keepTwoDecimal(totalChargeback));
        input.setStatisticsMfctyEntityMap(statisticsMfctyEntityMap);

    }

    private void statisticsReturnGoods(DateRange dateRange, List<Integer> mfctyIDs, Map<String, StatisticsMfctyEntity> input){
        if(CollectionUtils.isEmpty(mfctyIDs)){
            return;
        }
        MultipleDataSource.setDataSourceKey("mainDataSource");
        List<StatisticsReturnGoodsEntity> statisticsReturnGoodsEntityList = ptReturnGoodsDao.getReturnGoodsListByCondition(dateRange, mfctyIDs);

        if(CollectionUtils.isEmpty(statisticsReturnGoodsEntityList)){
            return;
        }
        Multimap<String, StatisticsReturnGoodsEntity> mfctyToStatisticsReturnGoodsEntityMultimap = HashMultimap.create();
        for(StatisticsReturnGoodsEntity statisticsReturnGoodsEntity : statisticsReturnGoodsEntityList) {
            mfctyToStatisticsReturnGoodsEntityMultimap.put(statisticsReturnGoodsEntity.getMfctyID(), statisticsReturnGoodsEntity);
        }
        Map<String, Collection<StatisticsReturnGoodsEntity>> idToReturnMainsMap = mfctyToStatisticsReturnGoodsEntityMultimap.asMap();
        MultipleDataSource.setDataSourceKey("dataSource");
        for(Map.Entry<String, Collection<StatisticsReturnGoodsEntity>> entry : idToReturnMainsMap.entrySet()){
            String mfctyIDKey = entry.getKey();
            //List<String> mfctyNames = wxCustomerDao.getMfctyNameByMfctyID(Integer.parseInt(mfctyIDKey));
            //String mfctyName = CollectionUtils.isEmpty(mfctyNames)?null : mfctyNames.get(0);
            //FillMfctyIDAndNameUtil.fillIDAndNameFromMap(mfctyIDKey, mfctyName, input);


            Collection<StatisticsReturnGoodsEntity> statisticsOrderMainEntitiyCollection = entry.getValue();
            List<StatisticsReturnGoodsEntity> statisticsOrderMainEntities = new ArrayList<StatisticsReturnGoodsEntity>();
            double perMfctyAllReturnMenoy = 0.00;
            for(StatisticsReturnGoodsEntity statisticsReturnGoodsEntity : statisticsOrderMainEntitiyCollection){
                statisticsOrderMainEntities.add(statisticsReturnGoodsEntity);
                Double perMfctyReturnMenoy = statisticsReturnGoodsEntity.getTotalMoney();
                if(perMfctyReturnMenoy!=null){
                    perMfctyAllReturnMenoy += perMfctyReturnMenoy;
                }
            }
            int returnNum = statisticsOrderMainEntities.size();
            StatisticsMfctyEntity statisticsMfctyEntity = input.get(mfctyIDKey);
            if(statisticsMfctyEntity==null){
                statisticsMfctyEntity = StatisticsMfctyEntity.builder().build();
                input.put(mfctyIDKey, statisticsMfctyEntity);
                statisticsMfctyEntity.setMfctyID(mfctyIDKey);
                statisticsMfctyEntity.setMfctyName(CollectionUtils.isEmpty(statisticsOrderMainEntities)?"":statisticsOrderMainEntities.get(0).getMfctyName());
            }
            statisticsMfctyEntity.setReturnGoodsNum(returnNum);
            statisticsMfctyEntity.setReturnGoodsMenoy(NumParseUtil.keepTwoDecimal(perMfctyAllReturnMenoy));
            statisticsMfctyEntity.setStatisticsReturnGoodsEntities(statisticsOrderMainEntities);
        }
    }
}
