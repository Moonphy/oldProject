package com.qipeipu.crm.dao;

import com.qipeipu.crm.dtos.visit.MaintainEntity;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * Created by laiyiyu on 2015/4/10.
 */
public interface MaintainDao {
    @Results(value = {
            @Result(column = "maintainID", property = "maintainID"),
            @Result(column = "custID", property = "custID"),
            @Result(column = "maintainType", property = "maintainType"),
            @Result(column = "userID", property = "userID"),
            @Result(column = "createTime", property = "createTime"),
            @Result(column = "mp", property = "mp"),
            @Result(column = "UserName", property = "userName")
    })
    @Select("select maintainID,custID,maintainType,tcm.createTime,tcm.userID,tu.UserName,tu.Mp from t_customer_maintain tcm  LEFT JOIN btl_user tu on tcm.UserId=tu.UserId  where tcm.CustId=#{custID} order by maintainType asc ")
    public List<MaintainEntity> getMaintainListByCustID(@Param("custID")Integer custID);

    @Insert("insert into t_customer_maintain (custID,userID,maintainType,createTime) values (#{maintainEntity.custID},#{maintainEntity.userID},#{maintainEntity.maintainType},#{maintainEntity.createTime})")
    public Integer createMaintain(@Param("maintainEntity") MaintainEntity maintainEntity);

    @Select("select count(1) from t_customer_maintain where custID=#{maintainEntity.custID} and maintainType=#{maintainEntity.maintainType}")
    public int getMaintainCount(@Param("maintainEntity") MaintainEntity maintainEntity);

    @Update("update t_customer_maintain set userID=#{maintainEntity.userID},createTime=#{maintainEntity.createTime},updateTime=#{maintainEntity.updateTime} where custID=#{maintainEntity.custID} and maintainType=#{maintainEntity.maintainType}")
    public int updateMaintain(@Param("maintainEntity") MaintainEntity maintainEntity);

    @Select("select maintainID from t_customer_maintain where custID=#{maintainEntity.custID} and maintainType=#{maintainEntity.maintainType}")
    public Integer getMaintainByCustIDAndType(@Param("maintainEntity") MaintainEntity maintainEntity);

    @Select("select maintainID from t_customer_maintain where custID=#{maintainEntity.custID} and maintainType=#{maintainEntity.maintainType} and userID=#{maintainEntity.userID}")
    public Integer getMaintainByCustIDAndTypeAndUserID(@Param("maintainEntity") MaintainEntity maintainEntity);
}
