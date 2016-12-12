package com.qipeipu.crm.service.impl.statistics;

import com.google.common.collect.Lists;
import com.qipeipu.crm.dao.QpuOrgDao;
import com.qipeipu.crm.dao.statistics.InqueryMainDao;
import com.qipeipu.crm.dao.statistics.QpuUserDao;
import com.qipeipu.crm.dtos.basedata.CityDTO;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.*;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.sortStrategy.StatisticsMfctyEntityComparable;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.sortStrategy.StatisticsTradeGroupByCityEntityComparable;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.storageStructure.StatisticsMfctyEntity;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.storageStructure.StatisticsOrderMainEntity;
import com.qipeipu.crm.service.impl.statistics.utilInterface.StatisticsMfctyGroupByCityMethod;
import com.qipeipu.crm.service.statistics.StatisticsOrderService;
import com.qipeipu.crm.service.statistics.StatisticsReturnGoodsService;
import com.qipeipu.crm.service.statistics.StatisticsTradeGroupByCityService;
import com.qipeipu.crm.service.statistics.StatisticsTradeService;
import com.qipeipu.crm.service.statistics.param.AreaConditionEntity;
import com.qipeipu.crm.service.statistics.param.StatisticsQuneryConditionEntity;
import com.qipeipu.crm.service.transformer.CustStatisticsVoTransformer;
import com.qipeipu.crm.service.transformer.StatisticsMfctyVoTransformer;
import com.qipeipu.crm.service.transformer.StatisticsTradeGroupByCityVoTransformer;
import com.qipeipu.crm.utils.bean.data.MultipleDataSource;
import com.qipeipu.crm.utils.statistics.*;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * Created by laiyiyu on 2015/4/27.
 */
@Log
@Service
public class StatisticsTradeGroupByCityServiceImpl implements StatisticsTradeGroupByCityService {

    @Autowired
    private StatisticsOrderService statisticsOrderService;
    @Autowired
    private StatisticsReturnGoodsService statisticsReturnGoodsService;
    @Autowired
    private QpuOrgDao qpuOrgDao;
    @Autowired
    private QpuUserDao qpuUserDao;
    @Autowired
    private InqueryMainDao inqueryMainDao;
    @Autowired
    private StatisticsMfctyGroupByCityMethod statisticsMfctyGroupByCityMethod;
    @Autowired
    private StatisticsTradeService statisticsTradeService;


    /**
     * 按地区划分统计订单与退单
     * @param statisticsQuneryConditionEntity
     * @param vo
     */
    @Override
    public void statisticsOrderAndReturnForTradeAnalyse(StatisticsQuneryConditionEntity statisticsQuneryConditionEntity, VoModel<?, ?> vo){
        DateRange dateRange = statisticsQuneryConditionEntity.getTimeConditionEntity().getDateRange();
        List<StatisticsTradeGroupByCityEntity> result = new ArrayList<>();
        StatisticsTradeGroupByCityEntityComparable statisticsTradeGroupByCityEntityComparable = statisticsQuneryConditionEntity.getStatisticsTradeGroupByCityEntityComparable();
        AreaConditionEntity areaCondition = statisticsQuneryConditionEntity.getAreaConditionEntity();
        Map<CityDTO, List<Integer>> cityToMfctyIDsMap = statisticsMfctyGroupByCityMethod.cityToMfctyIDsMapGroupBy(areaCondition);
        for(Map.Entry<CityDTO, List<Integer>> entry : cityToMfctyIDsMap.entrySet()){
            double orderReturnRatio = 0.00; //出错率
            double returnNumToOrderNumRatio = 0.00; //退单率
            //int regTimeToFirstTradeInqueryNum = 0;
            //int sensitizeTimeToFirstTradeInqueryNum = 0;
            Integer cityID = entry.getKey().getCityId();
            String cityName = entry.getKey().getCityName();
            List<Integer> mfctyIDs = entry.getValue();
            StatisticsOrderEntity statisticsOrderEntity = StatisticsOrderEntity.builder().build();
            StatisticsTradeEntity statisticsTradeEntity = statisticsTradeService.statisticsOrderAndReturnTrade(dateRange, mfctyIDs);
            /*Map<String, StatisticsMfctyEntity> statisticsMfctyEntityMap = statisticsTradeEntity.getStatisticsReturnEntity().getStatisticsMfctyEntityMap();
            for(Map.Entry<String, StatisticsMfctyEntity> mfctyEntry : statisticsMfctyEntityMap.entrySet()){
                int regTimeToFirstTradeInqueryNumPerMfcty = 0;
                int sensitizeTimeToFirstTradeInqueryNumPerMfcty = 0;
                StatisticsMfctyEntity statisticsMfctyEntity = mfctyEntry.getValue();
                String mfctyID  = statisticsMfctyEntity.getMfctyID();
                String registerToFirstTradeDate = statisticsMfctyEntity.getRegisterToFirstTradeDate();
                String sensitizeToFirstTrade = statisticsMfctyEntity.getSensitizeToFirstTradeDate();
                if(registerToFirstTradeDate!=null){
                    regTimeToFirstTradeInqueryNumPerMfcty = getInqueryNumByMfctyIDAndTime(mfctyID, registerToFirstTradeDate);
                }
                if(sensitizeToFirstTrade!=null){
                    sensitizeTimeToFirstTradeInqueryNumPerMfcty = getInqueryNumByMfctyIDAndTime(mfctyID, sensitizeToFirstTrade);
                }
                regTimeToFirstTradeInqueryNum += regTimeToFirstTradeInqueryNumPerMfcty;
                sensitizeTimeToFirstTradeInqueryNum += sensitizeTimeToFirstTradeInqueryNumPerMfcty;
            }*/
            int orderNum  = statisticsTradeEntity.getStatisticsOrderEntity().getOrderNum();
            double  totalOrderMoney = statisticsTradeEntity.getStatisticsOrderEntity().getTotalOrder();
            int returnNum = statisticsTradeEntity.getStatisticsReturnEntity().getTotalChargebackNum();
            double totalReturnMoney = statisticsTradeEntity.getStatisticsReturnEntity().getTotalChargeback();
            if(orderNum==0&&returnNum==0)
                continue;

            if(orderNum!=0){
                returnNumToOrderNumRatio = (double)returnNum/(double)orderNum;
            }

            //System.out.println(returnNumToOrderNumRatio);
            if(totalOrderMoney!=0.00){
                orderReturnRatio = totalReturnMoney/totalOrderMoney;
            }
            statisticsTradeEntity.setOrderReturnRatio(NumParseUtil.keepTwoDecimal(orderReturnRatio*100)+"%");
            statisticsTradeEntity.setReturnNumToOrderNumRatio(NumParseUtil.keepTwoDecimal(returnNumToOrderNumRatio*100)+"%");
            //statisticsTradeEntity.setSensitizeTimeToFirstTradeInqueryNum(sensitizeTimeToFirstTradeInqueryNum);
            //statisticsTradeEntity.setRegTimeToFirstTradeInqueryNum(regTimeToFirstTradeInqueryNum);
            StatisticsTradeGroupByCityEntity statisticsTradeGroupByCityEntity = StatisticsTradeGroupByCityEntity.builder()
                    .cityID(cityID).cityName(cityName).statisticsTradeEntity(statisticsTradeEntity).build();
            //statisticsTradeGroupByCityEntity.getStatisticsTradeEntity().getStatisticsInqueryEntity().setStatisticsMfctyEntityMap(null);
            statisticsTradeGroupByCityEntity.getStatisticsTradeEntity().getStatisticsReturnEntity().setStatisticsMfctyEntityMap(null);
            statisticsTradeGroupByCityEntity.getStatisticsTradeEntity().getStatisticsOrderEntity().setStatisticsMfctyEntityMap(null);
            result.add(statisticsTradeGroupByCityEntity);
            //System.out.println(statisticsTradeEntity.getOrderReturnRatio()+"-"+statisticsTradeEntity.getReturnNumToOrderNumRatio()+"-"+statisticsTradeEntity.getStatisticsOrderEntity().getTotalOrder()+"-hhee");
        }
        Collections.sort(result, statisticsTradeGroupByCityEntityComparable);
        vo.setTotal(result.size());
        PageUtil<StatisticsTradeGroupByCityEntity> pageUtil = new PageUtil<StatisticsTradeGroupByCityEntity>();
        vo.setModel(pageUtil.getPagedFilterPartsList( result, vo.getCurrent(), vo.getSize()));
    }

    @Override
    public void statisticsOrderAndReturnForTradeAnalyseExportExcel(StatisticsQuneryConditionEntity statisticsQuneryConditionEntity, OutputStream ops){
        VoModel<?, ?> vo = new VoModel<>();
        vo.setSize(100000);
        statisticsOrderAndReturnForTradeAnalyse(statisticsQuneryConditionEntity,  vo);
        List<StatisticsTradeGroupByCityEntity> statisticsTradeGroupByCityEntities = (List<StatisticsTradeGroupByCityEntity>) vo.getModel();
        List<StatisticsTradeGroupByCityVo> result = Lists.newArrayList(Lists.transform(statisticsTradeGroupByCityEntities, StatisticsTradeGroupByCityVoTransformer.INSTANCE));
        String title = "订单情况统计";
        String[] heads = {"地区", "订单金额", "订单数", "退单金额", "退单数", "订单退款率", "订单出错率", "注册到首单的平均天数", "注册到激活的平均天数"};
        ExcelUtil.exportExcel(title, heads, result, ops);
    }


    private int getInqueryNumByMfctyIDAndTime(String mfctyID, String time){
        MultipleDataSource.setDataSourceKey("mainDataSource");
        Integer id = Integer.parseInt(mfctyID);
        List<String> userIDs = qpuUserDao.getQPUserIDListByMfctyID(id);
        if(CollectionUtils.isEmpty(userIDs)){
            userIDs.add("0");
        }
        int result = inqueryMainDao.countInquiryNumByUserIDsAndTime(userIDs, time);
        MultipleDataSource.setDataSourceKey("dataSource");
        return result;
    }




    /**
     * 按地区划分统计订单（或客户交易分析）
     * @param statisticsQuneryConditionEntity
     * @param vo
     */
    @Override
    public void statisticsOrderGroupByCity(StatisticsQuneryConditionEntity statisticsQuneryConditionEntity, VoModel<?, ?> vo){
        DateRange dateRange = statisticsQuneryConditionEntity.getTimeConditionEntity().getDateRange();
        AreaConditionEntity areaCondition = statisticsQuneryConditionEntity.getAreaConditionEntity();
        StatisticsTradeGroupByCityEntityComparable statisticsTradeGroupByCityEntityComparable = statisticsQuneryConditionEntity.getStatisticsTradeGroupByCityEntityComparable();
        List<StatisticsTradeGroupByCityEntity> result = new ArrayList<>();
        Map<CityDTO, List<Integer>> cityToMfctyIDsMap = statisticsMfctyGroupByCityMethod.cityToMfctyIDsMapGroupBy(areaCondition);
        
        for(Map.Entry<CityDTO, List<Integer>> entry : cityToMfctyIDsMap.entrySet()){
            Integer cityID = entry.getKey().getCityId();
            String cityName = entry.getKey().getCityName();
            List<Integer> mfctyIDs = entry.getValue();
            StatisticsOrderEntity statisticsOrderEntity = StatisticsOrderEntity.builder().build();
            statisticsOrderService.statisticsOrderByAllMfcty(dateRange, mfctyIDs, statisticsOrderEntity);
            statisticsOrderEntity.setStatisticsMfctyEntityMap(null);
            StatisticsTradeEntity statisticsTradeEntity = StatisticsTradeEntity.builder().statisticsOrderEntity(statisticsOrderEntity).build();
            StatisticsTradeGroupByCityEntity statisticsTradeGroupByCityEntity = StatisticsTradeGroupByCityEntity.builder()
                    .cityID(cityID).cityName(cityName).statisticsTradeEntity(statisticsTradeEntity).build();
            if(statisticsOrderEntity.getOrderNum()!=0) {
                result.add(statisticsTradeGroupByCityEntity);
            }

        }
        Collections.sort(result, statisticsTradeGroupByCityEntityComparable);
        vo.setTotal(result.size());
        PageUtil<StatisticsTradeGroupByCityEntity> pageUtil = new PageUtil<StatisticsTradeGroupByCityEntity>();
        vo.setModel(pageUtil.getPagedFilterPartsList( result, vo.getCurrent(), vo.getSize()));
    }

    /**
     * 按地区划分统计订单（或客户交易分析）导出excel
     * @param statisticsQuneryConditionEntity
     */
    @Override
    public void statisticsOrderGroupByCityExportExcel(StatisticsQuneryConditionEntity statisticsQuneryConditionEntity, OutputStream ops){
        VoModel<?, ?> vo = new VoModel<>();
        vo.setSize(100000);
        statisticsOrderGroupByCity(statisticsQuneryConditionEntity, vo);
        List<StatisticsTradeGroupByCityEntity> statisticsTradeGroupByCityEntities = (List<StatisticsTradeGroupByCityEntity>) vo.getModel();
        List<CustStatisticsVo> result = Lists.newArrayList(Lists.transform(statisticsTradeGroupByCityEntities, CustStatisticsVoTransformer.INSTANCE));
        String title = "订单情况统计";
        String[] heads = {"地区", "注册客户数", "交易客户数", "激活客户数", "活跃客户数", "交易客户留存率", "活跃客户留存率"};
        ExcelUtil.exportExcel(title, heads, result, ops);
    }


    /**
     * 统计指定厂详情订单或退单信息
     * @param mfctyID
     * @param dateRange
     */
    @Override
    public StatisticsMfctyEntity statisticsOrderAndReturnByMfctyID(Integer mfctyID, DateRange dateRange){

        MultipleDataSource.setDataSourceKey("mainDataSource");
        List<Integer> mfctyIDs = Lists.newArrayList(mfctyID);
        MultipleDataSource.setDataSourceKey("dataSource");
        if(CollectionUtils.isEmpty(mfctyIDs)){
            return null;
        }
        StatisticsOrderEntity statisticsOrderEntity = StatisticsOrderEntity.builder().build();
        statisticsOrderService.statisticsOrderByAllMfcty(dateRange, mfctyIDs, statisticsOrderEntity);
        StatisticsReturnEntity statisticsReturnEntity = StatisticsReturnEntity.builder().build();
        statisticsReturnEntity.setStatisticsMfctyEntityMap(statisticsOrderEntity.getStatisticsMfctyEntityMap());
        statisticsReturnGoodsService.statisticsReturnGoodsByAllMfcty(dateRange, mfctyIDs, statisticsReturnEntity);
        statisticsOrderEntity.setStatisticsMfctyEntityMap(statisticsReturnEntity.getStatisticsMfctyEntityMap());
        Map<String, StatisticsMfctyEntity> statisticsMfctyEntityMap = statisticsReturnEntity.getStatisticsMfctyEntityMap();
        if(statisticsMfctyEntityMap.size()==0){
            return null;
        }
        StatisticsMfctyEntity statisticsMfctyEntity = null;
        for(Map.Entry<String, StatisticsMfctyEntity> entry : statisticsMfctyEntityMap.entrySet()){
            statisticsMfctyEntity = entry.getValue();
            int orderAllNum = statisticsMfctyEntity.getOrderAllNum();
            double totalOrder = statisticsMfctyEntity.getAllOrderMoney();
            int returnGoodsNum = statisticsMfctyEntity.getReturnGoodsNum();
            double returnGoodsMenoy = statisticsMfctyEntity.getReturnGoodsMenoy();
            double returnNumToOrderNumRatio = 0.00;
            double orderReturnRatio = 0.00;
            if(orderAllNum!=0){
                returnNumToOrderNumRatio = (double)returnGoodsNum/(double)orderAllNum;
            }

            if(totalOrder!=0){
                orderReturnRatio = returnGoodsMenoy/totalOrder;
            }
            statisticsMfctyEntity.setReturnNumToOrderNumRatio(NumParseUtil.keepTwoDecimal(returnNumToOrderNumRatio));
            statisticsMfctyEntity.setOrderReturnRatio(NumParseUtil.keepTwoDecimal(orderReturnRatio));
            //System.out.println(returnNumToOrderNumRatio+"-hehe"+orderReturnRatio);
            statisticsMfctyEntity.setStatisticsOrderMainEntities(null);
            statisticsMfctyEntity.setStatisticsReturnGoodsEntities(null);
        }
        return statisticsMfctyEntity;
    }


    /**
     * 统计指定地区详情订单或退单信息
     * @param cityID
     * @param dateRange
     * @param vo
     */
    @Override
    public void statisticsOrderAndReturnByCityID(StatisticsMfctyEntityComparable statisticsMfctyEntityComparable, Integer cityID, DateRange dateRange, VoModel<?, ?> vo, boolean isStatisticsReturn){

        MultipleDataSource.setDataSourceKey("mainDataSource");
        List<StatisticsMfctyEntity> result = new ArrayList<>();
        List<Integer> mfctyIDs = TransformUtil.StringToIntegerList(qpuOrgDao.getMfctyIDsByCityID(cityID));
        MultipleDataSource.setDataSourceKey("dataSource");
        if(CollectionUtils.isEmpty(mfctyIDs)){
            return;
        }
        StatisticsOrderEntity statisticsOrderEntity = StatisticsOrderEntity.builder().build();
        statisticsOrderService.statisticsOrderByAllMfcty(dateRange, mfctyIDs, statisticsOrderEntity);
        if(isStatisticsReturn){
            StatisticsReturnEntity statisticsReturnEntity = StatisticsReturnEntity.builder().build();
            statisticsReturnEntity.setStatisticsMfctyEntityMap(statisticsOrderEntity.getStatisticsMfctyEntityMap());
            statisticsReturnGoodsService.statisticsReturnGoodsByAllMfcty(dateRange, mfctyIDs, statisticsReturnEntity);
            statisticsOrderEntity.setStatisticsMfctyEntityMap(statisticsReturnEntity.getStatisticsMfctyEntityMap());

        }
        Map<String, StatisticsMfctyEntity> statisticsMfctyEntityMap = statisticsOrderEntity.getStatisticsMfctyEntityMap();
        if(statisticsMfctyEntityMap.size()==0){
            return;
        }
        for(Map.Entry<String, StatisticsMfctyEntity> entry : statisticsMfctyEntityMap.entrySet()){
            StatisticsMfctyEntity statisticsMfctyEntity = entry.getValue();
            statisticsMfctyEntity.setStatisticsOrderMainEntities(null);
            statisticsMfctyEntity.setStatisticsReturnGoodsEntities(null);
            result.add(statisticsMfctyEntity);
        }
        Collections.sort(result, statisticsMfctyEntityComparable);
        vo.setTotal(result.size());
        PageUtil<StatisticsMfctyEntity> pageUtil = new PageUtil<StatisticsMfctyEntity>();
        vo.setModel(pageUtil.getPagedFilterPartsList( result, vo.getCurrent(), vo.getSize()));
    }

    /**
     * 统计指定地区详情订单或退单信息导出excel
     * @param cityID
     * @param dateRange
     */
    @Override
    public void statisticsOrderAndReturnByCityIDExportExcel(StatisticsMfctyEntityComparable statisticsMfctyEntityComparable, Integer cityID, DateRange dateRange, OutputStream ops){
        VoModel<?, ?> vo = new VoModel<>();
        vo.setSize(100000);
        statisticsOrderAndReturnByCityID(statisticsMfctyEntityComparable, cityID, dateRange, vo, true);
        List<StatisticsMfctyEntity> statisticsMfctyEntities = (List<StatisticsMfctyEntity>) vo.getModel();
        List<StatisticsMfctyVo> result = Lists.newArrayList(Lists.transform(statisticsMfctyEntities, StatisticsMfctyVoTransformer.INSTANCE));
        String title = "订单情况统计";
        String[] heads = {"厂名", "订单金额", "订单数", "退单金额", "退单数"};
        ExcelUtil.exportExcel(title, heads, result, ops);
    }

    /**
     * 按地区统计订单和退单（汇总）
     * @param statisticsQuneryConditionEntity
     * @return
     */
    @Override
    public StatisticsTradeEntity statisticsTradeForOrderAndReturn(StatisticsQuneryConditionEntity statisticsQuneryConditionEntity){
        DateRange dateRange = statisticsQuneryConditionEntity.getTimeConditionEntity().getDateRange();
        List<Integer> mfctyIDs = statisticsMfctyGroupByCityMethod.cityToMfctyIDs(statisticsQuneryConditionEntity.getAreaConditionEntity());
        StatisticsTradeEntity tradeEntity = StatisticsTradeEntity.builder().build();
        StatisticsOrderEntity orderEntity = StatisticsOrderEntity.builder().build();
        StatisticsReturnEntity returnEntity = StatisticsReturnEntity.builder().build();
        statisticsOrderService.statisticsOrderByAllMfcty(dateRange, mfctyIDs, orderEntity);
        orderEntity.setStatisticsMfctyEntityMap(null);
        statisticsReturnGoodsService.statisticsReturnGoodsByAllMfcty(dateRange, mfctyIDs, returnEntity);
        returnEntity.setStatisticsMfctyEntityMap(null);
        tradeEntity.setStatisticsOrderEntity(orderEntity);
        tradeEntity.setStatisticsReturnEntity(returnEntity);
        //System.out.println("dingdan:"+orderEntity.getOrderNum()+orderEntity.getRegisterNum());
        return tradeEntity;
    }

    /**
     * 统计指定厂的订单情况
     * @param dateRange
     * @param mfctyID
     * @param vo
     */
    @Override
    public void statisticsOrderBySpecifyMfcty(DateRange dateRange, Integer mfctyID, VoModel<?, ?> vo){
        StatisticsOrderEntity statisticsOrderEntity = StatisticsOrderEntity.builder().build();
        List<Integer> mfctyIDs = Lists.newArrayList(mfctyID);
        statisticsOrderService.statisticsOrderByAllMfcty(dateRange, mfctyIDs, statisticsOrderEntity);
        Map<String, StatisticsMfctyEntity> statisticsMfctyEntityMap = statisticsOrderEntity.getStatisticsMfctyEntityMap();
        if(BaseJudgeUtil.isEmpty(statisticsMfctyEntityMap)){
            vo.setModel(Collections.emptyList());
            vo.setSize(0);
            return;
        }
        StatisticsMfctyEntity statisticsMfctyEntity = statisticsMfctyEntityMap.get(mfctyID+"");
        System.out.println(statisticsMfctyEntity.getMfctyID()+"-"+statisticsMfctyEntity.getMfctyName());
        List<StatisticsOrderMainEntity> result = statisticsMfctyEntity.getStatisticsOrderMainEntities();

        if(BaseJudgeUtil.isEmpty(result)){
            vo.setModel(Collections.emptyList());
            vo.setSize(0);
            return;
        }
        vo.setTotal(result.size());
        PageUtil<StatisticsOrderMainEntity> pageUtil = new PageUtil<StatisticsOrderMainEntity>();
        vo.setModel(pageUtil.getPagedFilterPartsList( result, vo.getCurrent(), vo.getSize()));
    }


    /**
     * 按地区划分统计询单
     * @param statisticsQuneryConditionEntity
     * @param vo
     */
    @Override
    public void statisticsInquiryForTradeAnalyse(StatisticsQuneryConditionEntity statisticsQuneryConditionEntity, VoModel<?, ?> vo){
        DateRange dateRange = statisticsQuneryConditionEntity.getTimeConditionEntity().getDateRange();
        List<StatisticsTradeGroupByCityEntity> result = new ArrayList<>();
        StatisticsTradeGroupByCityEntityComparable statisticsTradeGroupByCityEntityComparable = statisticsQuneryConditionEntity.getStatisticsTradeGroupByCityEntityComparable();
        AreaConditionEntity areaCondition = statisticsQuneryConditionEntity.getAreaConditionEntity();
        Map<CityDTO, List<Integer>> cityToMfctyIDsMap = statisticsMfctyGroupByCityMethod.cityToMfctyIDsMapGroupBy(areaCondition);
        for(Map.Entry<CityDTO, List<Integer>> entry : cityToMfctyIDsMap.entrySet()){
            int regTimeToFirstTradeInqueryNum = 0;
            int sensitizeTimeToFirstTradeInqueryNum = 0;
            Integer cityID = entry.getKey().getCityId();
            String cityName = entry.getKey().getCityName();
            List<Integer> mfctyIDs = entry.getValue();
            //StatisticsOrderEntity statisticsOrderEntity = StatisticsOrderEntity.builder().build();
            StatisticsTradeEntity statisticsTradeEntity = statisticsTradeService.statisticsOrderAndInquiryTrade(dateRange, mfctyIDs);
            Map<String, StatisticsMfctyEntity> statisticsMfctyEntityMap = statisticsTradeEntity.getStatisticsInqueryEntity().getStatisticsMfctyEntityMap();
            for(Map.Entry<String, StatisticsMfctyEntity> mfctyEntry : statisticsMfctyEntityMap.entrySet()){
                StatisticsMfctyEntity statisticsMfctyEntity = mfctyEntry.getValue();

                int regTimeToFirstTradeInqueryNumPerMfcty = 0;
                int sensitizeTimeToFirstTradeInqueryNumPerMfcty = 0;

                String mfctyID  = statisticsMfctyEntity.getMfctyID();
                String registerToFirstTradeDate = statisticsMfctyEntity.getRegisterToFirstTradeDate();
                String sensitizeToFirstTrade = statisticsMfctyEntity.getSensitizeToFirstTradeDate();
                if(registerToFirstTradeDate!=null){
                    regTimeToFirstTradeInqueryNumPerMfcty = getInqueryNumByMfctyIDAndTime(mfctyID, registerToFirstTradeDate);
                }
                if(sensitizeToFirstTrade!=null){
                    sensitizeTimeToFirstTradeInqueryNumPerMfcty = getInqueryNumByMfctyIDAndTime(mfctyID, sensitizeToFirstTrade);
                }
                regTimeToFirstTradeInqueryNum += regTimeToFirstTradeInqueryNumPerMfcty;
                sensitizeTimeToFirstTradeInqueryNum += sensitizeTimeToFirstTradeInqueryNumPerMfcty;
            }

            statisticsTradeEntity.setSensitizeTimeToFirstTradeInqueryNum(sensitizeTimeToFirstTradeInqueryNum);
            statisticsTradeEntity.setRegTimeToFirstTradeInqueryNum(regTimeToFirstTradeInqueryNum);
       /*
            statisticsTradeEntity.getStatisticsInqueryEntity().setStatisticsMfctyEntityMap(null);*/
            //statisticsTradeEntity.setStatisticsOrderEntity(null);
            StatisticsTradeGroupByCityEntity statisticsTradeGroupByCityEntity = StatisticsTradeGroupByCityEntity.builder()
                    .cityID(cityID).cityName(cityName).statisticsTradeEntity(statisticsTradeEntity).build();
            result.add(statisticsTradeGroupByCityEntity);
            //System.out.println(statisticsTradeEntity.getOrderReturnRatio()+"-"+statisticsTradeEntity.getReturnNumToOrderNumRatio()+"-"+statisticsTradeEntity.getRegTimeToFirstTradeInqueryNum()+"-"+statisticsTradeEntity.getSensitizeTimeToFirstTradeInqueryNum());
        }
        Collections.sort(result, statisticsTradeGroupByCityEntityComparable);
        vo.setTotal(result.size());
        PageUtil<StatisticsTradeGroupByCityEntity> pageUtil = new PageUtil<StatisticsTradeGroupByCityEntity>();
        List<StatisticsTradeGroupByCityEntity> statisticsTradeGroupByCityEntities = pageUtil.getPagedFilterPartsList( result, vo.getCurrent(), vo.getSize());
        for(StatisticsTradeGroupByCityEntity statisticsTradeGroupByCityEntity : statisticsTradeGroupByCityEntities){
            statisticsTradeGroupByCityEntity.getStatisticsTradeEntity().setStatisticsOrderEntity(null);
            statisticsTradeGroupByCityEntity.getStatisticsTradeEntity().getStatisticsInqueryEntity().setStatisticsMfctyEntityMap(null);
        }

        vo.setModel(pageUtil.getPagedFilterPartsList( result, vo.getCurrent(), vo.getSize()));
    }



}
