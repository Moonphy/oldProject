package com.qipeipu.crm.dao;

import com.qipeipu.crm.dtos.visit.PlatTypeEntity;
import com.qipeipu.crm.dtos.visit.ReturnGoodsQuestionEntity;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * Created by laiyiyu on 2015/3/26.
 */
public interface ReturnGoodsQuestionDao {


    @Results(value = {
            @Result(column = "returnGoodsID", property = "returnGoodsID"),
            @Result(column = "taskID", property = "taskID"),
            @Result(column = "returnTypeID", property = "returnTypeID"),
            @Result(column = "returnTypeName", property = "returnTypeName"),
            @Result(column = "returnGoodsTime", property = "returnGoodsTime"),
            @Result(column = "orderNo", property = "orderNo"),
            @Result(column = "content", property = "content"),
            @Result(column = "platTypeName", property = "platTypeName"),
            @Result(column = "createTime", property = "createTime"),
            @Result(column = "updateTime", property = "updateTime")
    })
    @Select("select turg.ReturnGoodsId,turg.TaskId,turg.ReturnTypeId,trt.ReturnTypeName,turg.returnGoodsTime,turg.OrderNo,turg.Content,turg.createTime,turg.updateTime from t_user_return_goods as turg LEFT JOIN t_return_type as trt on turg.ReturnTypeId=trt.ReturnTypeId  where taskid=#{taskID} order by turg.createTime desc")
    public List<ReturnGoodsQuestionEntity> getReturnGoodsQuestionByTaskID(@Param("taskID") Integer taskID);


    @Results(value = {
            @Result(column = "returnGoodsId", property = "returnGoodsID"),
            @Result(column = "taskId", property = "taskID"),
            @Result(column = "returnTypeId", property = "returnTypeID"),
            @Result(column = "returnTypeName", property = "returnTypeName"),
            @Result(column = "returnGoodsTime", property = "returnGoodsTime"),
            @Result(column = "orderNo", property = "orderNo"),
            @Result(column = "content", property = "content"),
            @Result(column = "createTime", property = "createTime"),
            @Result(column = "updateTime", property = "updateTime")
    })
    @Select("select turg.returnGoodsId,turg.taskId,turg.returnTypeId,turg.returnGoodsTime,turg.OrderNo,turg.Content,turg.createTime,trt.ReturnTypeName from  t_user_return_goods as turg left join t_return_type as trt on turg.ReturnTypeId=trt.ReturnTypeId where returnGoodsId = #{returnGoodsID} ")
    public List<ReturnGoodsQuestionEntity> getReturnGoodsQuestionByReturnGoodsID(@Param("returnGoodsID") Integer returnGoodsID);


    @Insert("insert into t_user_return_goods (taskID,OrderNo,returnTypeID,content,returnGoodsTime,createTime) values (#{returnGoodsQuestionEntity.taskID},#{returnGoodsQuestionEntity.orderNo},#{returnGoodsQuestionEntity.returnTypeID},#{returnGoodsQuestionEntity.content},#{returnGoodsQuestionEntity.returnGoodsTime},#{returnGoodsQuestionEntity.createTime})")
    public int createReturnGoodsQuestion(@Param("returnGoodsQuestionEntity") ReturnGoodsQuestionEntity returnGoodsQuestionEntity);

    @Delete("delete from t_user_return_goods where returnGoodsId=#{returnGoodsID}")
    public int delReturnGoodsQuestion(@Param("returnGoodsID") Integer returnGoodsID);

    @Results(value = {
            @Result(column = "returnTypeId", property = "typeID"),
            @Result(column = "returnTypeName", property = "typeName")
    })
    @Select("select returnTypeId,returnTypeName from t_return_type")
    public List<PlatTypeEntity> getAllPlatType();
}
