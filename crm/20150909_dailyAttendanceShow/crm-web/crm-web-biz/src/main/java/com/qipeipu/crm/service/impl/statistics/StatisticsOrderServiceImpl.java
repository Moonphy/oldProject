package com.qipeipu.crm.service.impl.statistics;

import com.google.common.collect.HashMultimap;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.google.common.collect.Multimap;
import com.qipeipu.crm.dao.QpuOrgDao;
import com.qipeipu.crm.dao.statistics.PtOrderMainDao;
import com.qipeipu.crm.dao.statistics.SupplyCertDao;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.StatisticsOrderEntity;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.storageStructure.MfctyByIDAndStatusEntity;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.storageStructure.StatisticsMfctyEntity;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.storageStructure.StatisticsOrderMainEntity;
import com.qipeipu.crm.service.statistics.StatisticsOrderService;
import com.qipeipu.crm.utils.bean.data.MultipleDataSource;
import com.qipeipu.crm.utils.statistics.BaseJudgeUtil;
import com.qipeipu.crm.utils.statistics.DateRange;
import com.qipeipu.crm.utils.statistics.NumParseUtil;
import lombok.extern.java.Log;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * Created by laiyiyu on 2015/4/16.
 */
@Log
@Service
public class StatisticsOrderServiceImpl implements StatisticsOrderService {

    @Autowired
    private PtOrderMainDao ptOrderMainDao;

    @Autowired
    private QpuOrgDao qpuOrgDao;
    @Autowired
    private SupplyCertDao supplyCertDao;

    public void statisticsOrderByAllMfcty(DateRange dateRange, List<Integer> mfctyIDs, StatisticsOrderEntity input){


        if(input==null){
            log.info("统计实体不能为空，统计失败");
            return;
        }
        if(BaseJudgeUtil.isEmpty(mfctyIDs)){
            return;
        }
        Map<String, StatisticsMfctyEntity> statisticsMfctyEntityMap = input.getStatisticsMfctyEntityMap();
        if(statisticsMfctyEntityMap==null){
            statisticsMfctyEntityMap = Maps.newHashMap();
        }
        statisticsOrder(dateRange, mfctyIDs, statisticsMfctyEntityMap);
        int orderNum = 0;//总订单数
        double totalOrder = 0.00;//所有订单总额
        //int dateRangeRegisterNum = 0;
        int registerNum = qpuOrgDao.getRegisterNumByMfctyIDsAndTime(mfctyIDs, dateRange);//总注册客户数
        int activateNum = 0; //总活跃客户数
        int transactionNum = 0; //总交易客户数量
        int sensitizeNum = 0;//总激活客户数
        double orderAverageAmount = 0.00;//订单平均金额
        double tradeStayRatio;//交易客户留存率
        double activateRatio;//活跃客户留存率
        int registerToFirstTradeDay = 0;
        int sensitizeToFirstTradeDay = 0;
        int registerToFirstTradeDayNum = 0;
        double registerToFirstTradeDayAverage = 0.00;
        double sensitizeToFirstTradeDayAverage = 0.00;
        int allTradeCust = ptOrderMainDao.countAllSuccessTrade();

        for(Map.Entry<String, StatisticsMfctyEntity> entry : statisticsMfctyEntityMap.entrySet()) {
            StatisticsMfctyEntity statisticsMfctyEntity = entry.getValue();
            int orderNumByMfcty = statisticsMfctyEntity.getOrderAllNum();
            //交易客户
            if (orderNumByMfcty>0) {
                orderNum += orderNumByMfcty;
            }
            Double totalOrderByMfcty = statisticsMfctyEntity.getAllOrderMoney();
            if (orderNumByMfcty>0) {
                totalOrder += totalOrderByMfcty;
            }
            /*if(statisticsMfctyEntity.isSelectDateRangeRegister()){
                dateRangeRegisterNum++;
                if(orderNumByMfcty>0){
                    registerToFirstTradeDayNum++;
                }
            }*/
            if(statisticsMfctyEntity.isTrade()){
                transactionNum++;
                int registerToFirstTradeDayPerMfcty = statisticsMfctyEntity.getRegisterToFirstTradeDay();
                registerToFirstTradeDay += registerToFirstTradeDayPerMfcty;
            }
            if (statisticsMfctyEntity.isActive()) {
                activateNum++;
            }
            if (statisticsMfctyEntity.isSensitize()) {
                sensitizeNum++;
                int sensitizeToFirstTradeDayPerMfcty = statisticsMfctyEntity.getSensitizeToFirstTradeDay();
                sensitizeToFirstTradeDay += sensitizeToFirstTradeDayPerMfcty;
            }
            /*if (statisticsMfctyEntity.isRegister()) {
                registerNum++;
            }*/



        } //end for
        tradeStayRatio = (double)transactionNum/(double)allTradeCust;
        activateRatio = (double)activateNum/(double)allTradeCust;
        if (sensitizeNum!=0){
            sensitizeToFirstTradeDayAverage = (double)sensitizeToFirstTradeDay/(double)sensitizeNum;
        }
        if(transactionNum!=0){
            registerToFirstTradeDayAverage = (double)registerToFirstTradeDay/(double)transactionNum;
        }
        if(orderNum!=0)
            orderAverageAmount = totalOrder/(double)orderNum;
        input.setTradeStayRatio(NumParseUtil.keepTwoDecimal(tradeStayRatio*100)+"%");
        input.setActivateRatio(NumParseUtil.keepTwoDecimal(activateRatio*100)+"%");
        input.setDateRangeRegisterNum(registerNum);
        input.setActivateNum(activateNum);
        input.setRegisterNum(registerNum);
        input.setSensitizeNum(sensitizeNum);
        input.setTransactionNum(transactionNum);
        input.setOrderNum(orderNum);
        input.setTotalOrder(NumParseUtil.keepTwoDecimal(totalOrder));
        input.setOrderAverageAmount(NumParseUtil.keepTwoDecimal(orderAverageAmount));
        input.setStatisticsMfctyEntityMap(statisticsMfctyEntityMap);
        input.setRegisterToFirstTradeDayAverage(NumParseUtil.keepTwoDecimal(registerToFirstTradeDayAverage));
        input.setSensitizeToFirstTradeDayAverage(NumParseUtil.keepTwoDecimal(sensitizeToFirstTradeDayAverage));
        //System.out.println(input.getActivateNum()+"-ordernum:"+input.getOrderNum()+"-hehe:"+input.getTradeStayRatio()+"-"+input.getRegisterToFirstTradeDayAverage()+"-"+input.getSensitizeToFirstTradeDayAverage());
    }

    /**
     * 统计拥有厂id的客户数据（订单统计）
     * @param dateRange
     * @param mfctyIDs
     * @return
     */
    private void statisticsOrder(DateRange dateRange, List<Integer> mfctyIDs, Map<String, StatisticsMfctyEntity> input){
        if(CollectionUtils.isEmpty(mfctyIDs)){
            return;
        }
        MultipleDataSource.setDataSourceKey("mainDataSource");
        List<StatisticsOrderMainEntity> statisticsOrderMainEntityList = ptOrderMainDao.getOrderFormListByOrgID(dateRange, mfctyIDs);

        if(CollectionUtils.isEmpty(statisticsOrderMainEntityList)){
            return;
        }
        Multimap<String, StatisticsOrderMainEntity> mfctyToStatisticsOrderMainEntityMultimap = HashMultimap.create();
        for(StatisticsOrderMainEntity statisticsOrderMainEntity : statisticsOrderMainEntityList) {
            if(!BaseJudgeUtil.isEmpty(statisticsOrderMainEntity.getMfctyID())) {
                mfctyToStatisticsOrderMainEntityMultimap.put(statisticsOrderMainEntity.getMfctyID(), statisticsOrderMainEntity);
            }
        }
        if(BaseJudgeUtil.isEmpty(mfctyToStatisticsOrderMainEntityMultimap)){
            return;
        }
        Map<String, Collection<StatisticsOrderMainEntity>> idToOderMainListMap = mfctyToStatisticsOrderMainEntityMultimap.asMap();


        for(Map.Entry<String, Collection<StatisticsOrderMainEntity>> entry : idToOderMainListMap.entrySet()){
            String mfctyIDKey = entry.getKey();
            List<MfctyByIDAndStatusEntity> mfctyByIDAndStatusEntities = qpuOrgDao.getMfctyNameAndStatusByMfctyID(mfctyIDKey);
            String mfctyName = null;
            //Integer status = null;
            Integer cityID = null;
            String cityName = null;
            String auditTime = null;
            if(!CollectionUtils.isEmpty(mfctyByIDAndStatusEntities)){
                mfctyName = mfctyByIDAndStatusEntities.get(0).getMfctyNmae();
                //status = mfctyByIDAndStatusEntities.get(0).getStatus();
                cityID = mfctyByIDAndStatusEntities.get(0).getCityID();
                cityName = mfctyByIDAndStatusEntities.get(0).getCityName();
                auditTime = mfctyByIDAndStatusEntities.get(0).getAuditTime();
            }
            //FillMfctyIDAndNameUtil.fillIDAndNameFromMap(mfctyIDKey, mfctyName, input);
            StatisticsMfctyEntity statisticsMfctyEntity = input.get(mfctyIDKey);
            if(statisticsMfctyEntity==null){
                statisticsMfctyEntity = StatisticsMfctyEntity.builder().build();
                statisticsMfctyEntity.setMfctyID(mfctyIDKey);
                statisticsMfctyEntity.setMfctyName(mfctyName);
                statisticsMfctyEntity.setCityID(cityID);
                statisticsMfctyEntity.setCityName(cityName);
                input.put(mfctyIDKey, statisticsMfctyEntity);
            }

            //注册客户
            /*if(status!=null)
                statisticsMfctyEntity.setStatus(status);
            if(status!=null&&status==2){
                statisticsMfctyEntity.setRegister(true);
            }else{
                statisticsMfctyEntity.setRegister(false);
            }*/
            List<StatisticsOrderMainEntity> statisticsOrderMainEntities = Lists.newArrayList(entry.getValue());
            //时间升序排序
            Collections.sort(statisticsOrderMainEntities);

            int orderNum = statisticsOrderMainEntities.size();
            statisticsMfctyEntity.setOrderAllNum(orderNum);
            double perMfctyAllOrderMoney = 0.00;
            for(StatisticsOrderMainEntity statisticsOrderMainEntity : statisticsOrderMainEntities){
                //System.out.println(statisticsOrderMainEntity.getPublishTime()+"-afterOrder");
                Double perOrderMoney = statisticsOrderMainEntity.getMoney();
                if(perOrderMoney!=null){
                    perMfctyAllOrderMoney += perOrderMoney;
                }
            }
            //System.out.println("-----------");
            double orderAverageAmount = 0.00;
            if(orderNum!=0){
                orderAverageAmount = perMfctyAllOrderMoney/(double)orderNum;
            }
            //List<String> regTimes = supplyCertDao.getSupplyTimeByOrgID(mfctyIDKey);
            String regTime = (auditTime==null)?"没通过注册" : auditTime;

            // System.out.println(mfctyIDKey+"-"+regTime+"-"+dateRange.getStartDate()+"-"+dateRange.getEndDate());
            if( regTime!=null&&!regTime.equals("没通过注册") && regTime.compareTo(dateRange.getStartDate())>0 && regTime.compareTo(dateRange.getEndDate())<0 ){
                //System.out.println(statisticsMfctyEntity.getMfctyID()+":通过注册");
                statisticsMfctyEntity.setSelectDateRangeRegister(true);
                statisticsMfctyEntity.setRegisterToFirstTradeDay(com.qipeipu.crm.utils.bean.tools.TimeUtil.getDayDifference(regTime, statisticsOrderMainEntities.get(0).getPayTime()));

            }else{
                statisticsMfctyEntity.setSelectDateRangeRegister(false);
            }
            statisticsMfctyEntity.setRegisterTime(regTime);
            statisticsMfctyEntity.setAllOrderMoney(NumParseUtil.keepTwoDecimal(perMfctyAllOrderMoney));
            statisticsMfctyEntity.setOrderAverageAmount(NumParseUtil.keepTwoDecimal(orderAverageAmount));
            //交易客户
            if(orderNum>0&&!regTime.equals("没通过注册")){
                statisticsMfctyEntity.setTrade(true);
                statisticsMfctyEntity.setRegisterToFirstTradeDate(statisticsOrderMainEntities.get(0).getPayTime());
            }else{
                statisticsMfctyEntity.setTrade(false);
            }
            //活跃客户
            if( orderNum>=10 || perMfctyAllOrderMoney>=20000.00 ){
                statisticsMfctyEntity.setActive(true);
            }else{
                statisticsMfctyEntity.setActive(false);
            }

            Double startHistory = ptOrderMainDao.getHistoryTotalMoneyByDateAndID(dateRange.getStartDate(), mfctyIDKey);
            Double endHistory = ptOrderMainDao.getHistoryTotalMoneyByDateAndID(dateRange.getEndDate(), mfctyIDKey);
            if(startHistory==null){
                startHistory = 0.00;
            }
            if(endHistory==null){
                endHistory = 0.00;
            }
            //激活客户,并且计算注册审核通过到激活的天数
            if(startHistory>=1000.00){
                statisticsMfctyEntity.setSensitize(false);
            }else if(endHistory>=1000.00&&!regTime.equals("没通过注册")){
                statisticsMfctyEntity.setSensitize(true);
                String fistSensitizeDate = null;
                double perMfctyAllOrderMoneyTemp = 0.00;
                for(StatisticsOrderMainEntity statisticsOrderMainEntity : statisticsOrderMainEntities){
                    Double perOrderMoneyTemp = statisticsOrderMainEntity.getMoney();
                    if(perOrderMoneyTemp!=null){
                        perMfctyAllOrderMoneyTemp += perOrderMoneyTemp;
                    }
                    if(perMfctyAllOrderMoneyTemp>1000.00){
                        fistSensitizeDate = statisticsOrderMainEntity.getPayTime();
                        break;
                    }
                } //end for
                //注册审核通过到激活的天数
                if(fistSensitizeDate!=null) {
                    statisticsMfctyEntity.setSensitizeToFirstTradeDay(com.qipeipu.crm.utils.bean.tools.TimeUtil.getDayDifference(regTime, fistSensitizeDate));
                    statisticsMfctyEntity.setSensitizeToFirstTradeDate(fistSensitizeDate);
                }
            }else{
                statisticsMfctyEntity.setSensitize(false);
            }
            statisticsMfctyEntity.setStatisticsOrderMainEntities(statisticsOrderMainEntities);
        }
        MultipleDataSource.setDataSourceKey("dataSource");
    }
}
