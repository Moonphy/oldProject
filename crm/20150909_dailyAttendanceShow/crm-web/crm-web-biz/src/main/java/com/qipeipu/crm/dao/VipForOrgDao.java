package com.qipeipu.crm.dao;

import com.qipeipu.crm.dtos.customer.OrgVipEntity;
import org.apache.ibatis.annotations.*;

/**
 * Created by laiyiyu on 2015/6/3.
 */
public interface VipForOrgDao {
    @Delete("delete from  qpm_org_memberlevel  where orgID=#{orgID}")
    public int delVipByOrgID(@Param("orgID") String orgID);

    @Update("update qpm_org_memberlevel set updateTime=#{orgVipEntity.updateTime},startTime=#{orgVipEntity.startTime},endTime=#{orgVipEntity.endTime} where orgID=#{orgVipEntity.orgID}")
    public int updateVipByOrgID(@Param("orgVipEntity") OrgVipEntity orgVipEntity);

    @Insert("insert into qpm_org_memberlevel (createTime,startTime,endTime,orgID,levelID) values (#{orgVipEntity.createTime},#{orgVipEntity.startTime},#{orgVipEntity.endTime},#{orgVipEntity.orgID},1)")
    public int addVip(@Param("orgVipEntity") OrgVipEntity orgVipEntity);

    @Select("select count(1) from qpm_org_memberlevel  where orgID=#{orgID} and levelID=1")
    public int countVipByOrgID(@Param("orgID") String orgID);
}
