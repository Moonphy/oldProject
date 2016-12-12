package com.qipeipu.crm.controller;

import com.qipeipu.crm.dtos.global.ResultDTO;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.statistics.crmAnalyse.StatisticsCrmEntity;
import com.qipeipu.crm.dtos.statistics.crmAnalyse.sortStrategy.StatisticsCrmByPersonEntityComparable;
import com.qipeipu.crm.dtos.statistics.crmAnalyse.sortStrategy.StatisticsCrmGroupByCityEntityComparable;
import com.qipeipu.crm.service.statistics.StatisticsCrmAnalyseGroupByCityService;
import com.qipeipu.crm.service.statistics.param.AreaConditionEntity;
import com.qipeipu.crm.service.statistics.param.StatisticsQuneryConditionEntity;
import com.qipeipu.crm.service.statistics.param.TimeConditionEntity;
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
 * Created by laiyiyu on 2015/5/18.
 */
@Slf4j
@Controller
@RequestMapping(value = "statisticsCrm")
public class StatisticsCrmController {
    private static final Logger logger = Logger
            .getLogger(StatisticsCrmController.class);

    @Autowired
    private StatisticsCrmAnalyseGroupByCityService statisticsCrmAnalyseGroupByCityService;

    /**
     * crm统计分析，按城市划分
     */
    @RequestMapping(value = "find/crmUserAnalyse", method = RequestMethod.GET)
    public void getCrmUserAnalyseGroupByCity(HttpServletRequest request, HttpServletResponse response, VoModel<?, ?> vo, StatisticsCrmGroupByCityEntityComparable statisticsCrmGroupByCityEntityComparable, AreaConditionEntity areaConditionEntity, String start, String end) {
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
            if(statisticsCrmGroupByCityEntityComparable==null){
                statisticsCrmGroupByCityEntityComparable = StatisticsCrmGroupByCityEntityComparable.builder().build();
            }
            TimeConditionEntity timeConditionEntity = TimeConditionEntity.builder().dateRange(dateRange).build();
            StatisticsQuneryConditionEntity statisticsQuneryConditionEntity = StatisticsQuneryConditionEntity.builder()
                    .areaConditionEntity(areaConditionEntity).timeConditionEntity(timeConditionEntity).statisticsCrmGroupByCityEntityComparable(statisticsCrmGroupByCityEntityComparable).build();
            statisticsCrmAnalyseGroupByCityService.statisticsCrmGroupByCity(statisticsQuneryConditionEntity, vo);
        }catch (Exception e){
            log.error("crm分析异常："+ExceptionUtil.getStackMsg(e));
        }
        GUtils.responseJson(response, ResultDTO.successResult(vo));
    }


    /**
     * crm统计分析，按城市划分导出excel
     */
    @RequestMapping(value = "find/crmUserAnalyseExportExcel", method = RequestMethod.GET)
    public void getCrmUserAnalyseGroupByCityExportExcel(HttpServletRequest request, HttpServletResponse response, StatisticsCrmGroupByCityEntityComparable statisticsCrmGroupByCityEntityComparable, AreaConditionEntity areaConditionEntity, String start, String end) {
        OutputStream ops;
        response.setContentType("octets/stream");
        StringBuilder sb = new StringBuilder();
        sb.append("attachment;filename=").append("crm analyse").append(".xls");
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
            if(statisticsCrmGroupByCityEntityComparable==null){
                statisticsCrmGroupByCityEntityComparable = StatisticsCrmGroupByCityEntityComparable.builder().build();
            }
            TimeConditionEntity timeConditionEntity = TimeConditionEntity.builder().dateRange(dateRange).build();
            StatisticsQuneryConditionEntity statisticsQuneryConditionEntity = StatisticsQuneryConditionEntity.builder()
                    .areaConditionEntity(areaConditionEntity).timeConditionEntity(timeConditionEntity).statisticsCrmGroupByCityEntityComparable(statisticsCrmGroupByCityEntityComparable).build();
            statisticsCrmAnalyseGroupByCityService.statisticsCrmGroupByCityExportExcel(statisticsQuneryConditionEntity, ops);
        }catch (Exception e){
            log.error("crm分析导出excel异常："+ExceptionUtil.getStackMsg(e));
        }
    }

    /**
     * 指定城市crm统计分析
     */
    @RequestMapping(value = "find/crmUserAnalyseByCityID", method = RequestMethod.GET)
    public void crmUserAnalyseByCityID(HttpServletRequest request,
                                                                HttpServletResponse response, StatisticsCrmByPersonEntityComparable statisticsCrmByPersonEntityComparable, String start, String end, Integer cityID, VoModel<?, ?> vo){
        try {
            if (BaseJudgeUtil.isEmpty(start) || BaseJudgeUtil.isEmpty(end)) {
                start = TimeUtil.getCurrentTime().substring(0, 10);
                end = TimeUtil.getNextDay(start);
            } else {
                end = TimeUtil.getNextDay(end);
            }
            if(statisticsCrmByPersonEntityComparable==null){
                statisticsCrmByPersonEntityComparable =  StatisticsCrmByPersonEntityComparable.builder().build();
            }
            DateRange dateRange = new DateRange(start, end);
            statisticsCrmAnalyseGroupByCityService.statisticsOrderAndReturnByCityID(statisticsCrmByPersonEntityComparable, cityID, dateRange, vo);
        }catch (Exception e){
            log.error("指定城市crm分析异常："+ExceptionUtil.getStackMsg(e));
        }
        GUtils.responseJson(response, ResultDTO.successResult(vo));
    }

    /**
     * 指定城市crm统计分析
     */
    @RequestMapping(value = "find/crmUserAnalyseByCityIDExportExcel", method = RequestMethod.GET)
    public void crmUserAnalyseByCityIDExportExcel(HttpServletRequest request,
                                       HttpServletResponse response, StatisticsCrmByPersonEntityComparable statisticsCrmByPersonEntityComparable, String start, String end, Integer cityID){
        OutputStream ops;
        response.setContentType("octets/stream");
        StringBuilder sb = new StringBuilder();
        sb.append("attachment;filename=").append("crm analyse by city").append(".xls");
        response.addHeader("Content-Disposition", sb.toString());
        try {
            ops = response.getOutputStream();
            if (BaseJudgeUtil.isEmpty(start) || BaseJudgeUtil.isEmpty(end)) {
                start = TimeUtil.getCurrentTime().substring(0, 10);
                end = TimeUtil.getNextDay(start);
            } else {
                end = TimeUtil.getNextDay(end);
            }
            if(statisticsCrmByPersonEntityComparable==null){
                statisticsCrmByPersonEntityComparable =  StatisticsCrmByPersonEntityComparable.builder().build();
            }
            DateRange dateRange = new DateRange(start, end);
            statisticsCrmAnalyseGroupByCityService.statisticsOrderAndReturnByCityIDExportExcel(statisticsCrmByPersonEntityComparable, cityID, dateRange, ops);
        }catch (Exception e){
            log.error("指定城市crm分析导出excel异常："+ExceptionUtil.getStackMsg(e));
        }
    }

    /**
     * 查询指定人员的拜访详情
     */
    @RequestMapping(value = "find/visitDetailByUserID", method = RequestMethod.GET)
    public void getVisitDetailByUserID(HttpServletRequest request,
                                       HttpServletResponse response, String start, String end, Integer userID, VoModel<?, ?> vo){
        try {
            if (BaseJudgeUtil.isEmpty(start) || BaseJudgeUtil.isEmpty(end)) {
                start = TimeUtil.getCurrentTime().substring(0, 10);
                end = TimeUtil.getNextDay(start);
            } else {
                end = TimeUtil.getNextDay(end);
            }

            DateRange dateRange = new DateRange(start, end);
            statisticsCrmAnalyseGroupByCityService.getVisitDetailForPerUser(userID, dateRange, vo);
        }catch (Exception e){
            log.error("指定人员的拜访详情异常："+ExceptionUtil.getStackMsg(e));
        }
        GUtils.responseJson(response, ResultDTO.successResult(vo));
    }

    /**
     * 获取昨日统计分析
     */
    @RequestMapping(value = "find/yesterdayCrmAnalyse", method = RequestMethod.GET)
    public void yesterdayCrmAnalyse(HttpServletRequest request,
                                       HttpServletResponse response){
        StatisticsCrmEntity statisticsCrmEntity = null;
        try {
            statisticsCrmEntity = statisticsCrmAnalyseGroupByCityService.getYesterdayCrmAnalyse();
        }catch (Exception e){
            log.error("指定城市crm分析异常："+ ExceptionUtil.getStackMsg(e));
        }
        GUtils.responseJson(response, ResultDTO.successResult(statisticsCrmEntity));
    }



}
