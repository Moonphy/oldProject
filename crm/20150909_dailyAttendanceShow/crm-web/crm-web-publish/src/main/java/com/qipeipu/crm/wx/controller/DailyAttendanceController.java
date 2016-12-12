package com.qipeipu.crm.wx.controller;

import com.qipeipu.crm.constant.ErrorConst;
import com.qipeipu.crm.dao.bean.DailyAttendanceLogRecord;
import com.qipeipu.crm.dtos.DailyAttendanceLogDTO;
import com.qipeipu.crm.dtos.global.PageModel;
import com.qipeipu.crm.dtos.global.ResultDTO;
import com.qipeipu.crm.service.log.DailyAttendanceLogService;
import com.qipeipu.crm.session.UserSessionInfo;
import com.qipeipu.crm.session.bean.CrmSessionUser;
import com.qipeipu.crm.utils.bean.tools.GUtils;
import com.qipeipu.crm.utils.bean.tools.TimeUtil;
import com.qipeipu.crm.wx.util.ExceptionUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * Created by Administrator:LiuJunyong on 2015/8/26.
 *
 */
@Slf4j
@Controller
@RequestMapping(value = "dailyAttendance")
public class DailyAttendanceController {
    @Autowired
    private DailyAttendanceLogService dailyAttendanceLogService ;

    /**
     * 返回自身的签到历史(分页)
     * @param request   HttpServletRequest
     * @param response  HttpServletResponse
     * @param pageModel 分页模型
     */
    @RequestMapping(value = "find/selfCheckInList" , method = RequestMethod.GET)
    public void findSelfCheckInList(HttpServletRequest request, HttpServletResponse response , PageModel pageModel) {
        try {
            //输出初始化
            ResultDTO<PageModel> res ;
            do {
                //获取签到历史的用户信息(输入初始化)
                CrmSessionUser user = UserSessionInfo.user_getUserOfRequest(request);
                if (null == user) {
                    res = ResultDTO.failed(ErrorConst.ILLEGAL_ARGS, "会话已中断，请重新登录!") ; break ;
                }
                if (null == user.getUserId()) {
                    res = ResultDTO.failed(ErrorConst.SYSTEM_ERROR, "会话数据缺失，找不到用户id") ; break ;
                }

                //获取签到记录列表
                int err = dailyAttendanceLogService.findByUserIdInPage(user.getUserId().longValue(), pageModel) ;
                if (ErrorConst.NO_ERROR == err) {
                    res = ResultDTO.succeed(pageModel) ;
                } else if (ErrorConst.ILLEGAL_ARGS == err) {
                    res = ResultDTO.failed(ErrorConst.ILLEGAL_ARGS , "用户id非法") ;
                } else {
                    res = ResultDTO.failed(ErrorConst.UNKNOWN_ERROR , "未知错误") ;
                }
            } while (false) ;

            GUtils.responseJson(response , res);
        }catch (Exception e) {
            log.error(ExceptionUtil.getStackMsg(e));
            GUtils.responseJson(response, ResultDTO.failResult(ErrorConst.UNKNOWN_ERROR, "error at 获取自身签到历史"));
        }
    }

    /**
     * 返回自身的签到历史(按时间查询、分页、并统计)
     * @param request   HttpServletRequest
     * @param response  HttpServletResponse
     * @param startTime  起始签到时间
     * @param endTime  截止签到时间
     * @param pageModel 分页模型
     */
    @RequestMapping(value = "find/selfCheckInInfo" , method = RequestMethod.GET)
    public void findSelfCheckInInfo(HttpServletRequest request,
                                    HttpServletResponse response ,
                                    String startTime ,
                                    String endTime ,
                                    PageModel pageModel) {
        try {
            //输出初始化
            ResultDTO<PageModel> res ;
            do {
                //获取签到历史的用户信息(输入初始化)
                CrmSessionUser user = UserSessionInfo.user_getUserOfRequest(request);
                if (null == user) {
                    res = ResultDTO.failed(ErrorConst.ILLEGAL_ARGS, "会话已中断，请重新登录!") ; break ;
                }
                if (null == user.getUserId()) {
                    res = ResultDTO.failed(ErrorConst.SYSTEM_ERROR, "会话数据缺失，找不到用户id") ; break ;
                }
                //默认签到时间范围
                if (GUtils.isEmptyOrNull(startTime)) {
                    //默认昨天开始
                    Calendar cal = Calendar.getInstance() ;
                    cal.setTime(new Date());
                    cal.add(Calendar.DATE, -1) ;
                    startTime = TimeUtil.dateToyyyymmdd(cal.getTime()) ;
                    startTime = TimeUtil.yyyyMMddToyyyyMMddHHmmss(startTime) ;
                    String tmp = TimeUtil.yyyyMMddHHmmssToyyyyMMdd(startTime) ;
                }
                if (GUtils.isEmptyOrNull(endTime)) { endTime = TimeUtil.getCurrentTime() ; }

                //获取签到记录列表
                int err = dailyAttendanceLogService.findRecordsWithTodayStatisticsByUserIdAndCheckInTimeRangeInPage(
                        user.getUserId().longValue() , startTime , endTime , pageModel) ;
                if (ErrorConst.NO_ERROR == err) {
                    res = ResultDTO.succeed(pageModel) ;
                } else if (ErrorConst.ILLEGAL_ARGS == err) {
                    res = ResultDTO.failed(ErrorConst.ILLEGAL_ARGS , "参数非法") ;
                } else {
                    res = ResultDTO.failed(ErrorConst.UNKNOWN_ERROR , "未知错误") ;
                }
            } while (false) ;

            GUtils.responseJson(response , res);
        }catch (Exception e) {
            log.error(ExceptionUtil.getStackMsg(e));
            GUtils.responseJson(response, ResultDTO.failResult(ErrorConst.UNKNOWN_ERROR, "error at 获取自身签到信息"));
        }
    }

    /**
     * 添加签到信息(POST)
     * @param request   HttpServletRequest
     * @param response  HttpServletResponse
     * @param rec       签到记录
     */
    @RequestMapping(value = "add/CheckInRec" , method = RequestMethod.POST)
    public void addCheckInRec(HttpServletRequest request,
                              HttpServletResponse response ,
                              DailyAttendanceLogDTO rec) {
        try {
            ResultDTO res ;
            do {
                //获取签到历史的用户信息(输入初始化)
                CrmSessionUser user = UserSessionInfo.user_getUserOfRequest(request);
                if (null == user) {
                    res = ResultDTO.failed(ErrorConst.ILLEGAL_ARGS, "会话已中断，请重新登录!") ; break ;
                }
                if (null == user.getUserId() || null == user.getUserName()) {
                    res = ResultDTO.failed(ErrorConst.SYSTEM_ERROR, "会话数据缺失，找不到用户id") ; break ;
                }

                //添加签到记录
                int err = dailyAttendanceLogService.addDailyAttendanceLogRecord(user.getUserId() , user.getUserName() , rec);
                if (ErrorConst.NO_ERROR == err) {
                    res = ResultDTO.succeed("签到成功") ;
                } else if (ErrorConst.ILLEGAL_ARGS == err) {
                    res = ResultDTO.failed(ErrorConst.ILLEGAL_ARGS , "签到数据非法或与会话数据有冲突") ;
                } else {
                    res = ResultDTO.failed(ErrorConst.UNKNOWN_ERROR , "未知错误") ;
                }
            } while (false) ;

            GUtils.responseJson(response , res);
        }catch (Exception e) {
            log.error(ExceptionUtil.getStackMsg(e));
            GUtils.responseJson(response, ResultDTO.failResult(ErrorConst.UNKNOWN_ERROR, "error at 添加签到记录"));
        }
    }
}
