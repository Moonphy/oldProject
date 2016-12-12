package com.qipeipu.crm.transformer;

import com.qipeipu.crm.constant.ErrorConst;
import com.qipeipu.crm.dao.bean.DailyAttendanceLogRecord;
import com.qipeipu.crm.dtos.DailyAttendanceLogDTO;
import com.qipeipu.crm.utils.bean.tools.GUtils;
import com.qipeipu.crm.utils.bean.tools.TimeUtil;

import java.util.Date;

/**
 * Created by Administrator:LiuJunyong on 2015/8/26.
 * 数据转换器
 */
public class DailyAttendanceLogTransformer {

    public static int updateDailyAttendanceLogDTO(DailyAttendanceLogDTO vo , DailyAttendanceLogRecord dailyAttendanceLogRec) {
        //更新时间
        String updateTime = (null == dailyAttendanceLogRec.getUpdateTime() ?
                "" : TimeUtil.dateToyyyyMMddHHmmss(dailyAttendanceLogRec.getUpdateTime())) ;
        //签到时间
        String checkInTime = (null == dailyAttendanceLogRec.getCheckInTime() ?
                "" : TimeUtil.dateToyyyyMMddHHmmss(dailyAttendanceLogRec.getCheckInTime())) ;

        vo.setCheckInId(dailyAttendanceLogRec.getCheckInId());
        vo.setUpdateTime(updateTime);
        vo.setCheckInTime(checkInTime);
        vo.setCheckInPersonId(dailyAttendanceLogRec.getCheckInPersonId());
        vo.setCheckInPersonName(dailyAttendanceLogRec.getCheckInPersonName());
        vo.setCheckInAddress(dailyAttendanceLogRec.getCheckInAddress());
        vo.setCheckInLongitude(dailyAttendanceLogRec.getCheckInLongitude());
        vo.setCheckInLatitude(dailyAttendanceLogRec.getCheckInLatitude());
        vo.setAmendAddress(dailyAttendanceLogRec.getAmendAddress());
        vo.setAmendLongitude(dailyAttendanceLogRec.getAmendLongitude());
        vo.setAmendLatitude(dailyAttendanceLogRec.getAmendLatitude());
        vo.setMemo(dailyAttendanceLogRec.getMemo());

        return ErrorConst.NO_ERROR ;
    }

    public static int updateDailyAttendanceLogRecord(DailyAttendanceLogRecord rec , DailyAttendanceLogDTO dailyAttendanceLogDTO) {
        //更新时间
        Date updateTime = (GUtils.isEmptyOrNull(dailyAttendanceLogDTO.getUpdateTime()) ?
                null : TimeUtil.yyyyMMddHHmmssToDate(dailyAttendanceLogDTO.getUpdateTime())) ;
        //签到时间
        Date checkInTime = (GUtils.isEmptyOrNull(dailyAttendanceLogDTO.getCheckInTime()) ?
                null : TimeUtil.yyyyMMddHHmmssToDate(dailyAttendanceLogDTO.getCheckInTime())) ;

        rec.setCheckInId(dailyAttendanceLogDTO.getCheckInId());
        rec.setUpdateTime(updateTime);
        rec.setCheckInTime(checkInTime);
        rec.setCheckInPersonId(dailyAttendanceLogDTO.getCheckInPersonId());
        rec.setCheckInPersonName(dailyAttendanceLogDTO.getCheckInPersonName());
        rec.setCheckInAddress(dailyAttendanceLogDTO.getCheckInAddress());
        rec.setCheckInLongitude(dailyAttendanceLogDTO.getCheckInLongitude());
        rec.setCheckInLatitude(dailyAttendanceLogDTO.getCheckInLatitude());
        rec.setAmendAddress(dailyAttendanceLogDTO.getAmendAddress());
        rec.setAmendLongitude(dailyAttendanceLogDTO.getAmendLongitude());
        rec.setAmendLatitude(dailyAttendanceLogDTO.getAmendLatitude());
        rec.setMemo(dailyAttendanceLogDTO.getMemo());

        return ErrorConst.NO_ERROR ;
    }

}
