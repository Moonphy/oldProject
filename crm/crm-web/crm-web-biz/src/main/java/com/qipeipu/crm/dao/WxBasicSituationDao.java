package com.qipeipu.crm.dao;

import com.qipeipu.crm.dtos.visit.BusinessMessageEntity;
import com.qipeipu.crm.dtos.visit.CustomerBasedDTO;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Update;

/**
 * Created by laiyiyu on 2015/3/27.
 */
public interface WxBasicSituationDao {


    @Update("update t_cust_business set monthBuy=#{businessMessageEntity.monthBuy},localPercent=#{businessMessageEntity.localPercent},buyUser=#{businessMessageEntity.buyUser},payUser=#{businessMessageEntity.payUser},existAccount=#{businessMessageEntity.existAccount} where custID=#{businessMessageEntity.custID} ")
    public int updateBusinessMessage(@Param("businessMessageEntity")BusinessMessageEntity businessMessageEntity);


    @Insert("insert into t_cust_business (custID,createTime,monthBuy,localPercent,payUser,buyUser,existAccount) values(#{businessMessageEntity.custID},#{businessMessageEntity.createTime},#{businessMessageEntity.monthBuy},#{businessMessageEntity.localPercent},#{businessMessageEntity.payUser},buyUser=#{businessMessageEntity.buyUser},#{businessMessageEntity.existAccount})")
    public Integer createMessageBusiness(@Param("businessMessageEntity")BusinessMessageEntity businessMessageEntity);


}
