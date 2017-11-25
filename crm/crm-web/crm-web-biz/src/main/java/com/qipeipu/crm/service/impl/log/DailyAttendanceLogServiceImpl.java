package com.qipeipu.crm.service.impl.log;

import com.qipeipu.crm.constant.ErrorConst;
import com.qipeipu.crm.dao.DailyAttendanceLogDAO;
import com.qipeipu.crm.dao.bean.DailyAttendanceLogRecord;
import com.qipeipu.crm.dtos.DailyAttendanceLogDTO;
import com.qipeipu.crm.dtos.global.PageModel;
import com.qipeipu.crm.service.log.DailyAttendanceLogService;
import com.qipeipu.crm.transformer.DailyAttendanceLogTransformer;
import com.qipeipu.crm.utils.bean.tools.TimeUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Created by Administrator:LiuJunyong on 2015/8/26.
 *
 */
@Service("DailyAttendanceLogServiceImpl")
public class DailyAttendanceLogServiceImpl implements DailyAttendanceLogService {

    @Autowired
    private DailyAttendanceLogDAO dailyAttendanceLogDAO ;

    //通过用户id查询其签到记录
    @Override
    public int findByUserId(long userId, List<DailyAttendanceLogDTO> res) {
        if (userId <= 0) return ErrorConst.ILLEGAL_ARGS ;

        List<DailyAttendanceLogRecord> tmpRes = dailyAttendanceLogDAO.findByUserIdOrderByCheckInTimeDESC(userId) ;
        for(DailyAttendanceLogRecord i : tmpRes) {
            DailyAttendanceLogDTO tmp = new DailyAttendanceLogDTO() ;
            DailyAttendanceLogTransformer.updateDailyAttendanceLogDTO(tmp , i) ;
            res.add(tmp) ;
        }

        return ErrorConst.NO_ERROR ;
    }

    //通过用户id查询其签到记录(分页)
    @Override
    public int findByUserIdInPage(long userId, PageModel pageModel) {
        if (userId <= 0) return ErrorConst.ILLEGAL_ARGS ;

        //分页信息
        int skip = pageModel.getPageIndex() * pageModel.getPageSize() ;
        int size = pageModel.getPageSize() ;
        int total = dailyAttendanceLogDAO.getCountByUserId(userId) ;
        pageModel.setTotal(total);

        List<DailyAttendanceLogRecord> tmpRes = dailyAttendanceLogDAO.findByUserIdOrderByCheckInTimeDESCInPage(
                userId , skip , size) ;

        //录入
        List<DailyAttendanceLogDTO> res = new ArrayList<>() ;
        for(DailyAttendanceLogRecord i : tmpRes) {
            DailyAttendanceLogDTO tmp = new DailyAttendanceLogDTO() ;
            DailyAttendanceLogTransformer.updateDailyAttendanceLogDTO(tmp , i) ;
            res.add(tmp) ;
        }
        pageModel.setModel(res);

        return ErrorConst.NO_ERROR ;
    }

    //通过用户id和签到时间范围查询其签到信息(分页+统计)
    @Override
    public int findRecordsWithTodayStatisticsByUserIdAndCheckInTimeRangeInPage(long userId,
                                                                               String startTime,
                                                                               String endTime,
                                                                               PageModel pageModel) {
        if (userId <= 0) return ErrorConst.ILLEGAL_ARGS ;
        if (null == TimeUtil.yyyyMMddHHmmssToDate(startTime)) return ErrorConst.ILLEGAL_ARGS ;
        if (null == TimeUtil.yyyyMMddHHmmssToDate(endTime)) return ErrorConst.ILLEGAL_ARGS ;

        //分页信息
        int skip = pageModel.getPageIndex() * pageModel.getPageSize() ;
        int size = pageModel.getPageSize() ;
        int total = dailyAttendanceLogDAO.getCountByUserIdAndCheckInTimeRange(userId, startTime, endTime) ;
        pageModel.setTotal(total);

        List<DailyAttendanceLogRecord> tmpRes = dailyAttendanceLogDAO.findByUserIdAndCheckInTimeRangeOrderByCheckInTimeDESCInPage(
                userId, startTime, endTime, skip, size) ;

        //今日统计
        String todayStart = TimeUtil.yyyyMMddToyyyyMMddHHmmss(TimeUtil.dateToyyyymmdd(new Date())) ;
        String todayEnd = TimeUtil.getCurrentTime() ;
        int todayCheckInCount = dailyAttendanceLogDAO.getCountByUserIdAndCheckInTimeRange(userId, todayStart, todayEnd) ;

        //录入
        List<DailyAttendanceLogDTO> dtoList = new ArrayList<>() ;
        for(DailyAttendanceLogRecord i : tmpRes) {
            DailyAttendanceLogDTO tmp = new DailyAttendanceLogDTO() ;
            DailyAttendanceLogTransformer.updateDailyAttendanceLogDTO(tmp , i) ;
            dtoList.add(tmp) ;
        }
        Map<String , Object> res = new HashMap<>() ;
        res.put("todayCheckInCount" , todayCheckInCount) ;
        res.put("DailyAttendanceLogDTOs" , dtoList) ;
        pageModel.setModel(res);

        return ErrorConst.NO_ERROR ;
    }

    //添加签到记录
    @Override
    public int addDailyAttendanceLogRecord(long userId, String userName, DailyAttendanceLogDTO dto) {
        if (userId <= 0) return ErrorConst.ILLEGAL_ARGS ;

        //记录初始化
        DailyAttendanceLogRecord rec = new DailyAttendanceLogRecord() ;
        DailyAttendanceLogTransformer.updateDailyAttendanceLogRecord(rec , dto) ;
        if (null == rec.getCheckInPersonId()) rec.setCheckInPersonId(userId);
        if (null == rec.getCheckInPersonName()) rec.setCheckInPersonName(userName);
        if (null == rec.getCheckInAddress()) rec.setCheckInAddress("");
        if (null == rec.getCheckInLongitude()) rec.setCheckInLongitude("-360");
        if (null == rec.getCheckInLatitude()) rec.setCheckInLatitude("-180");
        if (null == rec.getAmendAddress()) rec.setAmendAddress("");
        if (null == rec.getAmendLongitude()) rec.setAmendLongitude("-360");
        if (null == rec.getAmendLatitude()) rec.setAmendLatitude("-180");
        if (null == rec.getMemo()) rec.setMemo("");

        //数据非法判断
        if (userId != rec.getCheckInPersonId()) return ErrorConst.ILLEGAL_ARGS ;
        if (! userName.equals(rec.getCheckInPersonName())) return ErrorConst.ILLEGAL_ARGS ;


        dailyAttendanceLogDAO.addRec(rec) ;
        return ErrorConst.NO_ERROR ;
    }
}
