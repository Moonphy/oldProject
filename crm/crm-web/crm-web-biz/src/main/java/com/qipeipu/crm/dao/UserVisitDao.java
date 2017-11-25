package com.qipeipu.crm.dao;

import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.statistics.crmAnalyse.VisitDetailEntity;
import com.qipeipu.crm.provider.UserVisitProvider;
import com.qipeipu.crm.utils.statistics.DateRange;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * Created by laiyiyu on 2015/4/29.
 */
public interface UserVisitDao {
    @Results(value = {
            @Result(column = "visitID", property = "visitID"),
            @Result(column = "taskID", property = "taskID"),
            @Result(column = "userID", property = "userID"),
            @Result(column = "enterTime", property = "enterTime"),
            @Result(column = "leaveTime", property = "leaveTime"),
            @Result(column = "content", property = "content")
    })
    @SelectProvider(type = UserVisitProvider.class, method = "statisticsVistDetail")
    public List<VisitDetailEntity> statisticsVistDetail(@Param("userIDs") List<Integer> userIDs, @Param("dateRange")DateRange dateRange);

    @Results(value = {
            @Result(column = "visitID", property = "visitID"),
            @Result(column = "taskID", property = "taskID"),
            @Result(column = "userID", property = "userID"),
            @Result(column = "enterTime", property = "enterTime"),
            @Result(column = "leaveTime", property = "leaveTime"),
            @Result(column = "content", property = "content")
    })
    @SelectProvider(type = UserVisitProvider.class, method = "getVistDetailForPage")
    public List<VisitDetailEntity> getVistDetailForPage(@Param("userID") Integer userID, @Param("dateRange")DateRange dateRange, @Param("vo")VoModel<?, ?> vo);

    @SelectProvider(type = UserVisitProvider.class, method = "getVistDetailForCount")
    public int getVistDetailForCount(@Param("userID") Integer userID, @Param("dateRange")DateRange dateRange, @Param("vo")VoModel<?, ?> vo);


    @Delete("delete from t_user_visit where taskID=#{taskID}")
    public int delVisit(@Param("taskID") Integer taskID);

}
