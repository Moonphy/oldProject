package com.qipeipu.crm.dao;

import com.qipeipu.crm.dtos.visit.PlatTypeEntity;
import com.qipeipu.crm.dtos.visit.PlatformQuestionEntity;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * Created by laiyiyu on 2015/3/25.
 */
public interface WxPlatFormQuestionDao {



    @Results(value = {
            @Result(column = "feedBackID", property = "feedBackID"),
            @Result(column = "taskID", property = "taskID"),
            @Result(column = "platTypeName", property = "platTypeName"),
            @Result(column = "platTypeID", property = "platTypeID"),
            @Result(column = "content", property = "content"),
            @Result(column = "createTime", property = "createTime")
    })
    @Select("select tup.FeedBackId,tup.TaskId,tup.content,tup.createTime,tp.PlatTypeName,tup.PlatTypeId from t_user_feedback tup LEFT JOIN t_plattype tp on tup.PlatTypeId = tp.PlatTypeId where taskid=#{taskID}")
    public List<PlatformQuestionEntity> getAllPlatformQuestionByTaskID(@Param("taskID") Integer taskID);


    @Results(value = {
            @Result(column = "feedBackID", property = "feedBackID"),
            @Result(column = "taskID", property = "taskID"),
            @Result(column = "platTypeName", property = "platTypeName"),
            @Result(column = "platTypeID", property = "platTypeID"),
            @Result(column = "content", property = "content"),
            @Result(column = "createTime", property = "createTime")
    })
    @Select("select tup.FeedBackId,tup.TaskId,tup.content,tup.createTime,tp.PlatTypeName,tup.PlatTypeId from t_user_feedback tup LEFT JOIN t_plattype tp on tup.PlatTypeId = tp.PlatTypeId where feedBackId=#{feedBackId}")
    public List<PlatformQuestionEntity> getPlatformQuestionByFeedBackID(@Param("feedBackId") Integer feedBackID);


    @Insert("insert into t_user_feedback (taskID,PlatTypeId,content,createTime) values (#{platformQuestionEntity.taskID},#{platformQuestionEntity.platTypeID},#{platformQuestionEntity.content},#{platformQuestionEntity.createTime})")
    public int createPlatFormQuestion(@Param("platformQuestionEntity") PlatformQuestionEntity platformQuestionEntity);

    @Delete("delete from t_user_feedback where feedBackId=#{feedBackId}")
    public int delPlatFormQuestion(@Param("feedBackId") Integer feedBackID);




}



