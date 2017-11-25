package com.qipeipu.crm.dao;

import com.qipeipu.crm.dtos.visit.*;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * Created by laiyiyu on 2015/3/24.
 */
public interface VisitDao {


    @Results(value = {
            @Result(column = "id", property = "id"),
            @Result(column = "mfctyID", property = "mfctyID"),
            @Result(column = "mfctyName", property = "mfctyName"),
            @Result(column = "cityID", property = "cityID"),
            @Result(column = "cactTel", property = "cactTel"),
            @Result(column = "cactMan", property = "cactMan"),
            @Result(column = "mp", property = "mp"),
            @Result(column = "email", property = "email"),
            @Result(column = "address", property = "address"),
            @Result(column = "createTime", property = "createTime"),
            @Result(column = "updateTime", property = "updateTime"),
            @Result(column = "memo", property = "memo"),
            @Result(column = "star", property = "star"),
            @Result(column = "userID", property = "userID"),
            @Result(column = "recordTime", property = "recordTime"),
            @Result(column = "weCharNo", property = "weCharNo"),
            @Result(column = "mfctyType", property = "mfctyType"),
            @Result(column = "onlineBuy", property = "onlineBuy"),
            @Result(column = "boothRoom", property = "boothRoom"),
            @Result(column = "liftingFrame", property = "liftingFrame"),
            @Result(column = "businessArea", property = "businessArea"),
            @Result(column = "areaId", property = "areaId")

    })
    @Select("select * from t_customer where id=#{id}")
    public List<CustomerBasedEntity> getCustomerBasedByID(@Param("id")Integer ID);

    @Results(value = {
            @Result(column = "CustId", property = "custID"),
            @Result(column = "BuyUser", property = "buyUser"),
            @Result(column = "MonthBuy", property = "monthBuy"),
            @Result(column = "PayUser", property = "payUser"),
            @Result(column = "LocalPercent", property = "localPercent"),
            @Result(column = "existAccount", property = "existAccount"),
            @Result(column = "memo", property = "memo"),
            @Result(column = "updateTime", property = "updateTime"),
            @Result(column = "createTime", property = "createTime")
    })
    @Select("select CustId,BuyUser,MonthBuy,PayUser,LocalPercent,existAccount,memo,updateTime,createTime  from t_cust_business where CustId=#{custID} ")
    public List<BusinessMessageEntity> getBusinessMessageByID(@Param("custID") Integer custID);


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
    @Select("select turg.ReturnGoodsId,turg.TaskId,turg.ReturnTypeId,trt.ReturnTypeName,turg.returnGoodsTime,turg.OrderNo,turg.Content,turg.createTime,turg.updateTime from t_user_return_goods as turg LEFT JOIN t_return_type as trt on turg.ReturnTypeId=trt.ReturnTypeId  where taskid=#{taskID}")
    public List<ReturnGoodsQuestionEntity> getReturnGoodsQuestionByTaskID(@Param("taskID") Integer taskID);



    @Results(value={
            @Result(column = "visitid", property = "visitID"),
            @Result(column = "enterTime", property = "enterTime")
    })
    @Select("select visitid,enterTime from t_user_visit where taskID = #{taskID} ORDER BY  createTime DESC ")
    public List<WxMessageDetailDTO> getAllWxMessageDetailList(@Param("taskID") Integer taskID);


}
