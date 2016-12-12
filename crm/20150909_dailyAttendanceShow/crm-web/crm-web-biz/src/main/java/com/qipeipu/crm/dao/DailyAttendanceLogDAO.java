package com.qipeipu.crm.dao;

import com.qipeipu.crm.dao.bean.DailyAttendanceLogRecord;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * Created by Administrator:LiuJunyong on 2015/8/26.
 *
 */
public interface DailyAttendanceLogDAO {

    //通过用户id查询其签到记录(按其签到时间倒序排序)
    @Select(" SELECT * " +
            " FROM t_log_daily_attendance lda " +
            " WHERE lda.checkInPersonId=#{userId} " +
            " ORDER BY lda.checkInTime DESC ")
    public List<DailyAttendanceLogRecord> findByUserIdOrderByCheckInTimeDESC(@Param("userId") long userId) ;

    //通过用户id查询其签到记录(分页)
    @Select(" SELECT * " +
            " FROM t_log_daily_attendance lda " +
            " WHERE lda.checkInPersonId=#{userId} " +
            " ORDER BY lda.checkInTime DESC " +
            " LIMIT ${skip} , ${size} ")
    public List<DailyAttendanceLogRecord> findByUserIdOrderByCheckInTimeDESCInPage(
            @Param("userId") long userId,
            @Param("skip") int skip,
            @Param("size") int size);

    //通过用户id统计签到次数
    @Select(" SELECT COUNT(1) " +
            " FROM t_log_daily_attendance lda " +
            " WHERE lda.checkInPersonId=#{userId} ")
    public int getCountByUserId(@Param("userId") long userId);


    //通过用户id和签到时间范围查询其签到记录(分页)
    @Select(" SELECT * " +
            " FROM t_log_daily_attendance lda " +
            " WHERE lda.checkInPersonId=#{userId} " +
                " AND #{startTime} <= lda.checkInTime AND lda.checkInTime <= #{endTime} " +
            " ORDER BY lda.checkInTime DESC " +
            " LIMIT ${skip} , ${size} ")
    public List<DailyAttendanceLogRecord> findByUserIdAndCheckInTimeRangeOrderByCheckInTimeDESCInPage(
            @Param("userId") long userId,
            @Param("startTime") String startTime,
            @Param("endTime") String endTime,
            @Param("skip") int skip,
            @Param("size") int size);

    //通过用户id和签到时间范围统计签到次数
    @Select(" SELECT COUNT(1) " +
            " FROM t_log_daily_attendance lda " +
            " WHERE lda.checkInPersonId=#{userId} " +
            " AND #{startTime} <= lda.checkInTime AND lda.checkInTime <= #{endTime} ")
    public int getCountByUserIdAndCheckInTimeRange(@Param("userId") long userId,
                                                   @Param("startTime") String startTime,
                                                   @Param("endTime") String endTime);


    //添加签到记录
    @Insert(" INSERT IGNORE INTO t_log_daily_attendance( " +
                " checkInTime , " +
                " checkInPersonId , " +
                " checkInPersonName , " +
                " checkInAddress , " +
                " checkInLongitude , " +
                " checkInLatitude , " +
                " amendAddress , " +
                " amendLongitude , " +
                " amendLatitude , " +
                " memo) " +
            " VALUES( " +
                " now() , " +
                " #{re.checkInPersonId} , " +
                " #{re.checkInPersonName} , " +
                " #{re.checkInAddress} , " +
                " #{re.checkInLongitude} , " +
                " #{re.checkInLatitude} , " +
                " #{re.amendAddress} , " +
                " #{re.amendLongitude} , " +
                " #{re.amendLatitude} , " +
                " #{re.memo}) ")
    public int addRec(@Param("re") DailyAttendanceLogRecord rec);

}
