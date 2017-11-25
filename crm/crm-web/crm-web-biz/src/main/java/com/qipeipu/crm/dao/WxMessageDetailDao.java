package com.qipeipu.crm.dao;

import com.qipeipu.crm.dtos.visit.WxMessageDetailDTO;
import com.qipeipu.crm.dtos.visit.WxMessageDetailEntity;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * Created by laiyiyu on 2015/3/26.
 */
public interface WxMessageDetailDao {




    @Results(value={
            @Result(column = "visitid", property = "visitID"),
            @Result(column = "enterTime", property = "enterTime")
    })
    @Select("select visitid,enterTime from t_user_visit where taskID = #{taskID} ORDER BY  createTime DESC ")
    public List<WxMessageDetailDTO> getAllWxMessageDetailList(@Param("taskID") Integer taskID);



    @Results(value = {
            @Result(column = "visitid", property = "visitID"),
            @Result(column = "taskid", property = "taskID"),
            @Result(column = "entertime", property = "enterTime"),
            @Result(column = "visitFrequency", property = "visitFrequency"),
            @Result(column = "people", property = "people"),
            @Result(column = "content", property = "content"),
            @Result(column = "leaveTime", property = "leaveTime"),
            @Result(column = "createTime", property = "createTime"),
            @Result(column = "updateTime", property = "updateTime")
    })
    @Select("select visitid,taskid,entertime,visitFrequency,people,content,leaveTime,createTime,updateTime from t_user_visit where visitID=#{visitID}")
    public List<WxMessageDetailEntity> getDetailByVisitID(@Param("visitID") Integer visitID);

    @Select("select count(*) from t_user_visit where taskID=#{taskID} and createTime like #{subTime}")
    public Integer getVisitCount(@Param("taskID") Integer taskID, @Param("subTime") String subTime);



    @Delete("delete from t_user_visit where visitID = #{visitID}")
    public int delDetailMessage(@Param("visitID") Integer visitID);



    @Insert("insert into t_user_visit (taskID,enterTime,visitFrequency,people,content,leaveTime,createTime,userid)" +
            "values" +
            "(#{wxMessageDetailEntity.taskID},#{wxMessageDetailEntity.enterTime},#{wxMessageDetailEntity.visitFrequency},#{wxMessageDetailEntity.people},#{wxMessageDetailEntity.content},#{wxMessageDetailEntity.leaveTime},#{wxMessageDetailEntity.createTime},#{wxMessageDetailEntity.userID})")
    public int insertMessageDetail(@Param("wxMessageDetailEntity") WxMessageDetailEntity wxMessageDetailEntity);
}
