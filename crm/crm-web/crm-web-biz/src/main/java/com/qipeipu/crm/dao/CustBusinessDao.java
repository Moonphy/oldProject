package com.qipeipu.crm.dao;

import com.qipeipu.crm.dtos.visit.BusinessMessageEntity;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * Created by laiyiyu on 2015/4/13.
 */
public interface CustBusinessDao {

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

}
