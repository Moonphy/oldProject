package com.qipeipu.crm.service.log;

import com.qipeipu.crm.dao.bean.DailyAttendanceLogRecord;
import com.qipeipu.crm.dtos.DailyAttendanceLogDTO;
import com.qipeipu.crm.dtos.global.PageModel;

import java.util.List;

/**
 * Created by Administrator:LiuJunyong on 2015/8/26.
 *
 */

public interface DailyAttendanceLogService {

    /**
     * 通过用户id查询其签到记录
     * @param userId 用户id
     * @param res 结果列表
     * @return 错误信息
     */
    int findByUserId(long userId, List<DailyAttendanceLogDTO> res);

    /**
     * 通过用户id查询其签到记录(分页)
     * @param userId 用户id
     * @param pageModel 分页数据模型
     * @return 错误信息
     */
    int findByUserIdInPage(long userId, PageModel pageModel);

    /**
     * 通过用户id和签到时间范围查询其签到信息(分页+统计)
     * @param userId 用户id
     * @param startTime  起始签到时间
     * @param endTime  截止签到时间
     * @param pageModel 分页数据模型
     * @return 错误信息
     */
    int findRecordsWithTodayStatisticsByUserIdAndCheckInTimeRangeInPage(long userId,
                                                                        String startTime,
                                                                        String endTime,
                                                                        PageModel pageModel);

    /**
     * 添加签到记录
     * @param userId 用户id
     * @param userName 用户名称
     * @param rec 签到信息
     * @return 错误信息
     */
    int addDailyAttendanceLogRecord(long userId, String userName, DailyAttendanceLogDTO rec) ;

}
