package com.qipeipu.crm.dao;

import com.qipeipu.crm.dtos.visit.MaintainEntity;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;

/**
 * Created by laiyiyu on 2015/4/10.
 */
public interface MaintainLogDao {

    @Insert("insert into t_customer_maintain_log (custid,userid,maintaintype,createTime) values (#{maintainEntity.custID},#{maintainEntity.userID},#{maintainEntity.maintainType},#{maintainEntity.createTime})")
    public int insertMaintainLog(@Param("maintainEntity")MaintainEntity maintainEntity);



}
