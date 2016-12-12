package com.qipeipu.crm.wx.controller;

import com.qipeipu.crm.dtos.global.ResultDTO;
import com.qipeipu.crm.dtos.global.ResultState;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.StatisticsOrderEntity;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.StatisticsTradeEntity;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.sortStrategy.StatisticsMfctyEntityComparable;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.sortStrategy.StatisticsTradeGroupByCityEntityComparable;
import com.qipeipu.crm.service.statistics.StatisticsTradeGroupByCityService;
import com.qipeipu.crm.service.statistics.StatisticsTradeService;
import com.qipeipu.crm.service.statistics.param.AreaConditionEntity;
import com.qipeipu.crm.service.statistics.param.StatisticsQuneryConditionEntity;
import com.qipeipu.crm.service.statistics.param.TimeConditionEntity;
import com.qipeipu.crm.session.UserSessionInfo;
import com.qipeipu.crm.utils.bean.tools.GUtils;
import com.qipeipu.crm.utils.bean.tools.TimeUtil;
import com.qipeipu.crm.utils.statistics.DateRange;
import com.qipeipu.crm.wx.util.ExceptionUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

/**
 * Created by laiyiyu on 2015/4/27.
 */
@Slf4j
@Controller
@RequestMapping(value = "wx/orderStatistics")
public class WxOrderStatisticsController {

    @Autowired
    private StatisticsTradeService statisticsTradeService;
    @Autowired
    private StatisticsTradeGroupByCityService statisticsTradeGroupByCityService;

    @RequestMapping(value = "find/statisticsToday", method = RequestMethod.GET)
    public void statisticsToday(HttpServletRequest request,
                              HttpServletResponse response){
        Integer userID= UserSessionInfo.user_getUserOfRequest(request).getUserId();
        ResultDTO result;
        List<StatisticsOrderEntity> statisticsOrderEntities = null;
        StatisticsQuneryConditionEntity statisticsQuneryConditionEntity = StatisticsQuneryConditionEntity.builder().userID(userID).build();
        try{
            statisticsOrderEntities = statisticsTradeService.statisticsTodayOrderForWx(statisticsQuneryConditionEntity);
            result = ResultDTO.successResult(statisticsOrderEntities);
        }catch (Exception e){
            log.info("wx总统计异常："+ ExceptionUtil.getStackMsg(e));
            result = ResultDTO.failResult(ResultState.ERROR_CODE, "统计失败");
        }
        GUtils.responseJson(response, result);
    }

    @RequestMapping(value = "find/statisticsGroupCity", method = RequestMethod.GET)
    public void statisticsByArea(HttpServletRequest request,
                                 HttpServletResponse response, String selectDate, AreaConditionEntity areaConditionEntity, VoModel<?, ?> vo){


        try {
            if (selectDate == null || selectDate.trim().equals("")) {
                selectDate = TimeUtil.getCurrentTime().substring(0, 10);
            }
            //String end = "2015-05-05";
            String end = TimeUtil.getNextDay(selectDate);
            DateRange dateRange = new DateRange(selectDate, end);
            StatisticsTradeGroupByCityEntityComparable statisticsTradeGroupByCityEntityComparable = StatisticsTradeGroupByCityEntityComparable.builder().build();
            if(areaConditionEntity==null){
                areaConditionEntity = AreaConditionEntity.builder().build();
            }
            TimeConditionEntity timeConditionEntity = TimeConditionEntity.builder().dateRange(dateRange).build();
            StatisticsQuneryConditionEntity statisticsQuneryConditionEntity = StatisticsQuneryConditionEntity.builder()
                    .areaConditionEntity(areaConditionEntity).timeConditionEntity(timeConditionEntity).statisticsTradeGroupByCityEntityComparable(statisticsTradeGroupByCityEntityComparable).build();
            statisticsTradeGroupByCityService.statisticsOrderGroupByCity(statisticsQuneryConditionEntity, vo);
        }catch (Exception e){
            log.error("wx今天订单总统计异常："+ExceptionUtil.getStackMsg(e));
        }
        GUtils.responseJson(response, ResultDTO.successResult(vo));
    }



    @RequestMapping(value = "find/statisticsByCityID", method = RequestMethod.GET)
    public void statisticsByCityID(HttpServletRequest request,
                                 HttpServletResponse response, String selectDate, Integer cityID, VoModel<?, ?> vo){
        try {
            if (selectDate == null || selectDate.trim().equals("")) {
                selectDate = TimeUtil.getCurrentTime().substring(0, 10);
            }
            //String end = "2015-05-05";
            String end = TimeUtil.getNextDay(selectDate);
            DateRange dateRange = new DateRange(selectDate, end);
            StatisticsMfctyEntityComparable statisticsMfctyEntityComparable =  StatisticsMfctyEntityComparable.builder().build();
            statisticsTradeGroupByCityService.statisticsOrderAndReturnByCityID(statisticsMfctyEntityComparable, cityID, dateRange, vo, false);
        }catch (Exception e){
            log.error("wx指定城市订单总统计异常："+ExceptionUtil.getStackMsg(e));
        }
        GUtils.responseJson(response, ResultDTO.successResult(vo));
    }


    @RequestMapping(value = "find/orderAndReturn", method = RequestMethod.GET)
    public void statisticsOrderAndReturn(HttpServletRequest request,
                                 HttpServletResponse response, String start, String end, AreaConditionEntity areaConditionEntity){
        StatisticsTradeEntity statisticsTradeEntity = null;
        try {
            DateRange dateRange;
            if ((start == null || start.trim().equals("")) || (end == null || end.trim().equals(""))) {
                dateRange = new DateRange();
                dateRange.setThisMonthDate();
                dateRange.setEndDate(TimeUtil.getNextDay(dateRange.getEndDate()));
            } else {
                dateRange = new DateRange(start, TimeUtil.getNextDay(end));
            }

            if (areaConditionEntity == null) {
                areaConditionEntity = AreaConditionEntity.builder().build();
            }
            TimeConditionEntity timeConditionEntity = TimeConditionEntity.builder().dateRange(dateRange).build();
            StatisticsQuneryConditionEntity statisticsQuneryConditionEntity = StatisticsQuneryConditionEntity.builder()
                    .areaConditionEntity(areaConditionEntity).timeConditionEntity(timeConditionEntity).build();

            statisticsTradeEntity = statisticsTradeGroupByCityService.statisticsTradeForOrderAndReturn(statisticsQuneryConditionEntity);
        }catch (Exception e){
            log.error("订单与退单统计："+ExceptionUtil.getStackMsg(e));
        }
        GUtils.responseJson(response, ResultDTO.successResult(statisticsTradeEntity));
    }

    @RequestMapping(value = "find/all", method = RequestMethod.GET)
    public void statisticsTotalOrder(HttpServletRequest request,
                                         HttpServletResponse response){
        StatisticsOrderEntity statisticsTradeEntity = statisticsTradeService.statisticsTotalOrderForWx();
        GUtils.responseJson(response, ResultDTO.successResult(statisticsTradeEntity));
    }



}
