package com.qipeipu.crm.service.impl.statistics;

import com.google.common.collect.HashMultimap;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.google.common.collect.Multimap;
import com.qipeipu.crm.dao.QpuOrgDao;
import com.qipeipu.crm.dao.statistics.InqueryMainDao;
import com.qipeipu.crm.dao.statistics.PtOrderDetailDao;
import com.qipeipu.crm.dao.statistics.PtOrderMainDao;
import com.qipeipu.crm.dao.statistics.QpuUserDao;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.StatisticsInqueryEntity;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.storageStructure.StatisticsInqueryMainEntity;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.storageStructure.StatisticsMfctyEntity;
import com.qipeipu.crm.service.statistics.StatisticsInqueryService;
import com.qipeipu.crm.utils.bean.data.MultipleDataSource;
import com.qipeipu.crm.utils.statistics.DateRange;
import com.qipeipu.crm.utils.statistics.NumParseUtil;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by laiyiyu on 2015/4/17.
 */
@Service
public class StatisticsInqueryServiceImpl implements StatisticsInqueryService {

    @Autowired
    private QpuUserDao qpuUserDao;
    @Autowired
    private InqueryMainDao inqueryMainDao;
    @Autowired
    private PtOrderDetailDao ptOrderDetailDao;
    @Autowired
    private PtOrderMainDao ptOrderMainDao;
    @Autowired
    private QpuOrgDao qpuOrgDao;


    public void statisticsOrderByAllMfcty(DateRange dateRange, List<Integer> mfctyIDs, StatisticsInqueryEntity input){
        Map<String, StatisticsMfctyEntity> statisticsMfctyEntityMap = input.getStatisticsMfctyEntityMap();
        if(statisticsMfctyEntityMap==null){
            statisticsMfctyEntityMap = Maps.newHashMap();
        }
        statisticsInquery(dateRange, mfctyIDs, statisticsMfctyEntityMap);
        Integer inqueryAllNum = 0; //总询价单数
        Integer inqueryToOrderNum = 0; //询价单转订单数;
        Double inqueryToOrderRatio = 0.00; //询价单转订单比 （inqueryAllNum:inqueryToOrderNum）
        for(Map.Entry<String, StatisticsMfctyEntity> entry : statisticsMfctyEntityMap.entrySet()){
            StatisticsMfctyEntity statisticsMfctyEntity = entry.getValue();
            Integer inqueryAllNumByMfcty = statisticsMfctyEntity.getInqueryAllNum();
            if(inqueryAllNumByMfcty!=null){
                inqueryAllNum += inqueryAllNumByMfcty;
            }
            Integer inqueryToOrderNumByMfcty = statisticsMfctyEntity.getInqueryToOrderNum();
            if(inqueryToOrderNumByMfcty!=null){
                inqueryToOrderNum += inqueryToOrderNumByMfcty;
            }
        }
        if(inqueryAllNum!=0){
            inqueryToOrderRatio = (double)inqueryToOrderNum/(double)inqueryAllNum;
        }
        input.setInqueryAllNum(inqueryAllNum);
        input.setInqueryToOrderNum(inqueryToOrderNum);
        input.setInqueryToOrderRatio(inqueryToOrderRatio);
        System.out.println(input.getInqueryAllNum()+"-"+input.getInqueryToOrderNum()+"nima");
        input.setStatisticsMfctyEntityMap(statisticsMfctyEntityMap);
    }

    private void statisticsInquery(DateRange dateRange, List<Integer> mfctyIDs, Map<String, StatisticsMfctyEntity> input){
        if(CollectionUtils.isEmpty(mfctyIDs)){
            return;
        }
        MultipleDataSource.setDataSourceKey("mainDataSource");
        List<String> qpuUserIDList = qpuUserDao.getQPUserIDListByMfctyIDs(mfctyIDs);
        if(CollectionUtils.isEmpty(qpuUserIDList)){
            return;
        }

        Map<String, String> userIDToMfctyNameMap = new HashMap<String, String>();
        Map<String, Integer> userIDToMfctyIDMap = new HashMap<String, Integer>();

        for(Integer id : mfctyIDs){
            List<String> userIDs = qpuUserDao.getQPUserIDListByMfctyID(id);
            List<String> mfctyNames = qpuOrgDao.getMfctyNameByMfctyID(id+"");
            String mfctyName = CollectionUtils.isEmpty(mfctyNames)?null:mfctyNames.get(0);
            for(String qpuUserID : userIDs){
                userIDToMfctyNameMap.put(qpuUserID, mfctyName);
                userIDToMfctyIDMap.put(qpuUserID, id);
            }
        }

        List<StatisticsInqueryMainEntity> statisticsInqueryMainEntityList = inqueryMainDao.getInquirySheetListByUserIDs(dateRange, qpuUserIDList);
        if(CollectionUtils.isEmpty(statisticsInqueryMainEntityList)){
            return;
        }
        Multimap<Integer, StatisticsInqueryMainEntity> mfctyToStatisticsInqueryMainEntityMultimap = HashMultimap.create();
        for(StatisticsInqueryMainEntity statisticsInqueryMainEntity : statisticsInqueryMainEntityList) {
            String qpuUserID = statisticsInqueryMainEntity.getUserID();
            if (qpuUserID != null) {
                mfctyToStatisticsInqueryMainEntityMultimap.put(userIDToMfctyIDMap.get(qpuUserID), statisticsInqueryMainEntity);
            }
        }

        Map<Integer, Collection<StatisticsInqueryMainEntity>> idToQueryMainListMap = mfctyToStatisticsInqueryMainEntityMultimap.asMap();
        for(Map.Entry<Integer, Collection<StatisticsInqueryMainEntity>> entry : idToQueryMainListMap.entrySet()){
            Integer mfctyIDKey = entry.getKey();
            List<StatisticsInqueryMainEntity> statisticsInqueryMainEntities = Lists.newArrayList(entry.getValue());
            List<String> mfctyNames = qpuOrgDao.getMfctyNameByMfctyID(mfctyIDKey+"");
            String mfctyName = CollectionUtils.isEmpty(mfctyNames)?null : mfctyNames.get(0);
            StatisticsMfctyEntity statisticsMfctyEntity = input.get(mfctyIDKey);
            if(statisticsMfctyEntity==null){
                statisticsMfctyEntity = StatisticsMfctyEntity.builder().build();
                input.put(mfctyIDKey+"", statisticsMfctyEntity);
                statisticsMfctyEntity.setMfctyID(mfctyIDKey+"");
                statisticsMfctyEntity.setMfctyName(mfctyName);
            }
            //StatisticsMfctyEntity statisticsMfctyEntity = StatisticsMfctyEntity.builder().mfctyID(mfctyIDKey).mfctyName(mfctyName).build();
            int allInquerySize = statisticsInqueryMainEntities.size();
            int successInquery = 0;
            for(StatisticsInqueryMainEntity statisticsInqueryMainEntity : statisticsInqueryMainEntities){
                String inquiryNo = statisticsInqueryMainEntity.getInquiryNo();
                List<String> orderMainIDsptOrder = ptOrderDetailDao.getIDByInqueryNo(inquiryNo);
                if(CollectionUtils.isEmpty(orderMainIDsptOrder)) continue;
                String orderMainID = orderMainIDsptOrder.get(0);
                int countSuccess = ptOrderMainDao.countSuccessTradeByInquery(orderMainID);
                if(countSuccess>0) successInquery++;
            }
            Double inqueryToOrderRatio = (double)successInquery/(double)allInquerySize;
            statisticsMfctyEntity.setInqueryAllNum(allInquerySize);
            statisticsMfctyEntity.setInqueryToOrderNum(successInquery);
            statisticsMfctyEntity.setInqueryToOrderRatio(NumParseUtil.keepTwoDecimal(inqueryToOrderRatio));
            statisticsMfctyEntity.setStatisticsInquiryMainEntities(statisticsInqueryMainEntities);
        }
        MultipleDataSource.setDataSourceKey("dataSource");
    }
}
