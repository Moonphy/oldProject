package com.qipeipu.crm.controller;

import com.qipeipu.crm.dtos.global.ResultDTO;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.StatisticsOrderEntity;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.StatisticsTradeEntity;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.sortStrategy.StatisticsMfctyEntityComparable;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.sortStrategy.StatisticsTradeGroupByCityEntityComparable;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.storageStructure.StatisticsMfctyEntity;
import com.qipeipu.crm.service.statistics.StatisticsTradeGroupByCityService;
import com.qipeipu.crm.service.statistics.StatisticsTradeService;
import com.qipeipu.crm.service.statistics.param.AreaConditionEntity;
import com.qipeipu.crm.service.statistics.param.StatisticsQuneryConditionEntity;
import com.qipeipu.crm.service.statistics.param.TimeConditionEntity;
import com.qipeipu.crm.service.task.TaskService;
import com.qipeipu.crm.session.UserSessionInfo;
import com.qipeipu.crm.utils.bean.tools.GUtils;
import com.qipeipu.crm.utils.bean.tools.TimeUtil;
import com.qipeipu.crm.utils.statistics.BaseJudgeUtil;
import com.qipeipu.crm.utils.statistics.DateRange;
import com.qipeipu.crm.wx.util.ExceptionUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.OutputStream;

/**
 * Created by laiyiyu on 2015/5/5.
 */
@Slf4j
@Controller
@RequestMapping(value = "statisticsTrade")
public class StatisticsTradeController {

    private static final Logger logger = Logger
            .getLogger(StatisticsTradeController.class);

    @Autowired
    private StatisticsTradeGroupByCityService statisticsTradeGroupByCityService;
    @Autowired
    private TaskService taskService;
    @Autowired
    private StatisticsTradeService statisticsTradeService;


    /**
     * 交易分析询单
     */
    @RequestMapping(value = "find/InquiryForTradeAnalyse", method = RequestMethod.GET)
    public void getInquiryForTradeAnalyseGroupByCity(HttpServletRequest request, HttpServletResponse response, VoModel<?, ?> vo, StatisticsTradeGroupByCityEntityComparable statisticsTradeGroupByCityEntityComparable, AreaConditionEntity areaConditionEntity, String start, String end) {
        try {
            if (BaseJudgeUtil.isEmpty(start) || BaseJudgeUtil.isEmpty(end)) {
                start = TimeUtil.getCurrentTime().substring(0, 10);
                end = TimeUtil.getNextDay(start);
            } else {
                end = TimeUtil.getNextDay(end);
            }
            DateRange dateRange = new DateRange(start, end);
            if (areaConditionEntity == null) {
                areaConditionEntity = AreaConditionEntity.builder().build();
            }
            TimeConditionEntity timeConditionEntity = TimeConditionEntity.builder().dateRange(dateRange).build();
            StatisticsQuneryConditionEntity statisticsQuneryConditionEntity = StatisticsQuneryConditionEntity.builder()
                    .areaConditionEntity(areaConditionEntity).timeConditionEntity(timeConditionEntity).statisticsTradeGroupByCityEntityComparable(statisticsTradeGroupByCityEntityComparable).build();
            statisticsTradeGroupByCityService.statisticsInquiryForTradeAnalyse(statisticsQuneryConditionEntity, vo);
        }catch (Exception e){
            log.error("交易分析询单："+ExceptionUtil.getStackMsg(e));
        }
        GUtils.responseJson(response, ResultDTO.successResult(vo));
    }

    /**
     * 交易分析订单与退单
     */
    @RequestMapping(value = "find/orderAndReturnForTradeAnalyse", method = RequestMethod.GET)
    public void getOrderAndReturnForTradeAnalyseGroupByCity(HttpServletRequest request, HttpServletResponse response, VoModel<?, ?> vo, StatisticsTradeGroupByCityEntityComparable statisticsTradeGroupByCityEntityComparable, AreaConditionEntity areaConditionEntity, String start, String end) {
        try {
            if (BaseJudgeUtil.isEmpty(start) || BaseJudgeUtil.isEmpty(end)) {
                start = TimeUtil.getCurrentTime().substring(0, 10);
                end = TimeUtil.getNextDay(start);
            } else {
                end = TimeUtil.getNextDay(end);
            }
            DateRange dateRange = new DateRange(start, end);
            if (areaConditionEntity == null) {
                areaConditionEntity = AreaConditionEntity.builder().build();
            }
            if(statisticsTradeGroupByCityEntityComparable==null){
                statisticsTradeGroupByCityEntityComparable = StatisticsTradeGroupByCityEntityComparable.builder().build();
            }
            TimeConditionEntity timeConditionEntity = TimeConditionEntity.builder().dateRange(dateRange).build();
            StatisticsQuneryConditionEntity statisticsQuneryConditionEntity = StatisticsQuneryConditionEntity.builder()
                    .areaConditionEntity(areaConditionEntity).timeConditionEntity(timeConditionEntity).statisticsTradeGroupByCityEntityComparable(statisticsTradeGroupByCityEntityComparable).build();
            statisticsTradeGroupByCityService.statisticsOrderAndReturnForTradeAnalyse(statisticsQuneryConditionEntity, vo);
        }catch (Exception e){
            log.error("交易分析订单与退单异常："+ExceptionUtil.getStackMsg(e));
        }
        GUtils.responseJson(response, ResultDTO.successResult(vo));
    }


    /**
     * 交易分析订单与退单导出excel
     */
    @RequestMapping(value = "find/orderAndReturnForTradeAnalyseExportExcel", method = RequestMethod.GET)
    public void getOrderAndReturnForTradeAnalyseGroupByCityExportExcel(HttpServletRequest request, HttpServletResponse response, StatisticsTradeGroupByCityEntityComparable statisticsTradeGroupByCityEntityComparable, AreaConditionEntity areaConditionEntity, String start, String end) {
        OutputStream ops = null;
        response.setContentType("octets/stream");
        StringBuilder sb = new StringBuilder();
        sb.append("attachment;filename=").append("order condition").append(".xls");
        response.addHeader("Content-Disposition", sb.toString());
        try {
            ops = response.getOutputStream();
            if (BaseJudgeUtil.isEmpty(start) || BaseJudgeUtil.isEmpty(end)) {
                start = TimeUtil.getCurrentTime().substring(0, 10);
                end = TimeUtil.getNextDay(start);
            } else {
                end = TimeUtil.getNextDay(end);
            }
            DateRange dateRange = new DateRange(start, end);
            if (areaConditionEntity == null) {
                areaConditionEntity = AreaConditionEntity.builder().build();
            }
            if(statisticsTradeGroupByCityEntityComparable==null){
                statisticsTradeGroupByCityEntityComparable = StatisticsTradeGroupByCityEntityComparable.builder().build();
            }
            TimeConditionEntity timeConditionEntity = TimeConditionEntity.builder().dateRange(dateRange).build();
            StatisticsQuneryConditionEntity statisticsQuneryConditionEntity = StatisticsQuneryConditionEntity.builder()
                    .areaConditionEntity(areaConditionEntity).timeConditionEntity(timeConditionEntity).statisticsTradeGroupByCityEntityComparable(statisticsTradeGroupByCityEntityComparable).build();
            statisticsTradeGroupByCityService.statisticsOrderAndReturnForTradeAnalyseExportExcel(statisticsQuneryConditionEntity, ops);
        }catch (Exception e){
            log.error("交易分析订单与退单导出excel异常："+ExceptionUtil.getStackMsg(e));
        }
    }

    /**
     * 昨日交易分析订单与退单
     */
    @RequestMapping(value = "find/orderAndReturnForYesterdayTradeAnalyse", method = RequestMethod.GET)
    public void getOrderAndReturnForTradeAnalyseYesterday(HttpServletRequest request, HttpServletResponse response) {
        StatisticsTradeEntity statisticsTradeEntity = null;
        try {

            String end = TimeUtil.getCurrentTime().substring(0, 10);
            String start = TimeUtil.getYesterday(end);
            DateRange dateRange = new DateRange(start, end);

            AreaConditionEntity areaConditionEntity = AreaConditionEntity.builder().build();

            TimeConditionEntity timeConditionEntity = TimeConditionEntity.builder().dateRange(dateRange).build();
            StatisticsQuneryConditionEntity statisticsQuneryConditionEntity = StatisticsQuneryConditionEntity.builder()
                    .areaConditionEntity(areaConditionEntity).timeConditionEntity(timeConditionEntity).build();
            statisticsTradeEntity = statisticsTradeGroupByCityService.statisticsTradeForOrderAndReturn(statisticsQuneryConditionEntity);
        }catch (Exception e){
            log.error("昨日交易分析订单与退单异常："+ExceptionUtil.getStackMsg(e));
        }
        GUtils.responseJson(response, ResultDTO.successResult(statisticsTradeEntity));
    }

    /**
     * 指定城市的交易分析订单与退单
     */
    @RequestMapping(value = "find/statisticsOrderAndReturnForTradeAnalyseByCityID", method = RequestMethod.GET)
    public void statisticsOrderAndReturnForTradeAnalyseByCityID(HttpServletRequest request,
                                   HttpServletResponse response, StatisticsMfctyEntityComparable statisticsMfctyEntityComparable, String start, String end, Integer cityID, VoModel<?, ?> vo){
        try {
            if (BaseJudgeUtil.isEmpty(start) || BaseJudgeUtil.isEmpty(end)) {
                start = TimeUtil.getCurrentTime().substring(0, 10);
                end = TimeUtil.getNextDay(start);
            } else {
                end = TimeUtil.getNextDay(end);
            }
            if(statisticsMfctyEntityComparable==null){
                statisticsMfctyEntityComparable =  StatisticsMfctyEntityComparable.builder().build();
            }
            DateRange dateRange = new DateRange(start, end);
            statisticsTradeGroupByCityService.statisticsOrderAndReturnByCityID(statisticsMfctyEntityComparable, cityID, dateRange, vo, true);
        }catch (Exception e){
            log.error("指定城市订单和退单总统计异常："+ ExceptionUtil.getStackMsg(e));
        }
        GUtils.responseJson(response, ResultDTO.successResult(vo));
    }

    /**
     * 指定城市的交易分析订单与退单导出excel
     */
    @RequestMapping(value = "find/statisticsOrderAndReturnForTradeAnalyseByCityIDExportExcel", method = RequestMethod.GET)
    public void statisticsOrderAndReturnForTradeAnalyseByCityIDExportExcel(HttpServletRequest request,
                                                                HttpServletResponse response, StatisticsMfctyEntityComparable statisticsMfctyEntityComparable, String start, String end, Integer cityID){
        OutputStream ops = null;
        response.setContentType("octets/stream");
        StringBuilder sb = new StringBuilder();
        sb.append("attachment;filename=").append("order condition by city").append(".xls");
        response.addHeader("Content-Disposition", sb.toString());
        try {
            ops = response.getOutputStream();
            if (BaseJudgeUtil.isEmpty(start) || BaseJudgeUtil.isEmpty(end)) {
                start = TimeUtil.getCurrentTime().substring(0, 10);
                end = TimeUtil.getNextDay(start);
            } else {
                end = TimeUtil.getNextDay(end);
            }
            if(statisticsMfctyEntityComparable==null){
                statisticsMfctyEntityComparable =  StatisticsMfctyEntityComparable.builder().build();
            }
            DateRange dateRange = new DateRange(start, end);
            statisticsTradeGroupByCityService.statisticsOrderAndReturnByCityIDExportExcel(statisticsMfctyEntityComparable, cityID, dateRange, ops);
        }catch (Exception e){
            log.error("指定城市订单和退单总统计导出excel异常："+ ExceptionUtil.getStackMsg(e));
        }
    }

    /**
     * 指定厂的交易分析订单与退单
     */
    @RequestMapping(value = "find/statisticsOrderAndReturnForTradeAnalyseByMfctyID", method = RequestMethod.GET)
    public void statisticsOrderAndReturnForTradeAnalyseByMfctyID(HttpServletRequest request,
                                                                HttpServletResponse response,  String start, String end, Integer mfctyID){
        StatisticsMfctyEntity statisticsMfctyEntity = null;
        try {
            if (BaseJudgeUtil.isEmpty(start) || BaseJudgeUtil.isEmpty(end)) {
                start = TimeUtil.getCurrentTime().substring(0, 10);
                end = TimeUtil.getNextDay(start);
            } else {
                end = TimeUtil.getNextDay(end);
            }

            DateRange dateRange = new DateRange(start, end);
            statisticsMfctyEntity = statisticsTradeGroupByCityService.statisticsOrderAndReturnByMfctyID(mfctyID, dateRange);
        }catch (Exception e){
            log.error("指定城市订单和退单总统计异常："+ExceptionUtil.getStackMsg(e));
        }
        GUtils.responseJson(response, ResultDTO.successResult(statisticsMfctyEntity));
    }


    /**
     * 按城市划分客户交易分析
     */
    @RequestMapping(value = "find/statisticsCustTrade", method = RequestMethod.GET)
    public void statisticsCustTrade(HttpServletRequest request,
                                   HttpServletResponse response, StatisticsTradeGroupByCityEntityComparable statisticsTradeGroupByCityEntityComparable, AreaConditionEntity areaConditionEntity , String start, String end, VoModel<?, ?> vo){
        try {
            if (BaseJudgeUtil.isEmpty(start) || BaseJudgeUtil.isEmpty(end)) {
                start = TimeUtil.getCurrentTime().substring(0, 10);
                end = TimeUtil.getNextDay(start);
            } else {
                end = TimeUtil.getNextDay(end);
            }
            DateRange dateRange = new DateRange(start, end);
            if (areaConditionEntity == null) {
                areaConditionEntity = AreaConditionEntity.builder().build();
            }
            TimeConditionEntity timeConditionEntity = TimeConditionEntity.builder().dateRange(dateRange).build();
            StatisticsQuneryConditionEntity statisticsQuneryConditionEntity = StatisticsQuneryConditionEntity.builder()
                    .areaConditionEntity(areaConditionEntity).timeConditionEntity(timeConditionEntity).statisticsTradeGroupByCityEntityComparable(statisticsTradeGroupByCityEntityComparable).build();
            statisticsTradeGroupByCityService.statisticsOrderGroupByCity(statisticsQuneryConditionEntity, vo);
        }catch (Exception e){
            log.error("客户交易分析计异常："+ExceptionUtil.getStackMsg(e));
        }
        GUtils.responseJson(response, ResultDTO.successResult(vo));
    }


    /**
     * 按城市划分客户交易分析导出excel
     */
    @RequestMapping(value = "find/statisticsCustTradeExportExcel", method = RequestMethod.GET)
    public void statisticsCustTradeExportExcel(HttpServletRequest request,
                                    HttpServletResponse response, StatisticsTradeGroupByCityEntityComparable statisticsTradeGroupByCityEntityComparable, AreaConditionEntity areaConditionEntity , String start, String end){
        OutputStream ops;
        response.setContentType("octets/stream");
        StringBuilder sb = new StringBuilder();
        sb.append("attachment;filename=").append("order analyse").append(".xls");
        response.addHeader("Content-Disposition", sb.toString());
        try {
            ops = response.getOutputStream();
            if (BaseJudgeUtil.isEmpty(start) || BaseJudgeUtil.isEmpty(end)) {
                start = TimeUtil.getCurrentTime().substring(0, 10);
                end = TimeUtil.getNextDay(start);
            } else {
                end = TimeUtil.getNextDay(end);
            }
            DateRange dateRange = new DateRange(start, end);
            if (areaConditionEntity == null) {
                areaConditionEntity = AreaConditionEntity.builder().build();
            }
            TimeConditionEntity timeConditionEntity = TimeConditionEntity.builder().dateRange(dateRange).build();
            StatisticsQuneryConditionEntity statisticsQuneryConditionEntity = StatisticsQuneryConditionEntity.builder()
                    .areaConditionEntity(areaConditionEntity).timeConditionEntity(timeConditionEntity).statisticsTradeGroupByCityEntityComparable(statisticsTradeGroupByCityEntityComparable).build();
            statisticsTradeGroupByCityService.statisticsOrderGroupByCityExportExcel(statisticsQuneryConditionEntity, ops);
        }catch (Exception e){
            log.error("客户交易分析计导出excel异常："+ExceptionUtil.getStackMsg(e));
        }
    }


    /**
     * 指定厂订单查询
     */
    @RequestMapping(value = "find/statisticsByMfctyID", method = RequestMethod.GET)
    public void statisticsByMfctyID(HttpServletRequest request,
                                   HttpServletResponse response, String start, String end, Integer mfctyID, VoModel<?, ?> vo){

        try {
            if (BaseJudgeUtil.isEmpty(start) || BaseJudgeUtil.isEmpty(end)) {
                start = TimeUtil.getCurrentTime().substring(0, 10);
                end = TimeUtil.getNextDay(start);
            } else {
                end = TimeUtil.getNextDay(end);
            }
            DateRange dateRange = new DateRange(start, end);
            statisticsTradeGroupByCityService.statisticsOrderBySpecifyMfcty(dateRange, mfctyID, vo);
        }catch (Exception e){
            log.error("指定城市订单总统计异常："+ExceptionUtil.getStackMsg(e));
        }
        GUtils.responseJson(response, ResultDTO.successResult(vo));
    }

    @RequestMapping(value = "search/mainMfcty", method = RequestMethod.GET)
    public void getMfctyByMain(HttpServletRequest request,
                               HttpServletResponse response, VoModel<?, ?> vo, String key) {
        Integer userID = UserSessionInfo.user_getUserOfRequest(request)
                .getUserId();
        taskService.searhOrgForName(vo, key);
        GUtils.responseJson(response, ResultDTO.successResult(vo));
    }

    @RequestMapping(value = "find/allCustAnalyse", method = RequestMethod.GET)
    public void statisticsTotalOrder(HttpServletRequest request,
                                     HttpServletResponse response){
        StatisticsOrderEntity statisticsTradeEntity = statisticsTradeService.statisticsTotalOrderForWx();
        GUtils.responseJson(response, ResultDTO.successResult(statisticsTradeEntity));
    }
}
