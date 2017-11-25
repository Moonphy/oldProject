package com.qipeipu.crm.dao.statistics;

import com.qipeipu.crm.dao.bean.OrgHitEggLevelRecord;
import com.qipeipu.crm.dtos.customer.OrgForHitEggEntity;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

/**
 * Created by laiyiyu on 2015/6/3.
 */
public interface OrgLevelForEggDao {
    //根据组织id查询其砸蛋信息
    @Select("select * from orglevelforegg where orgID=#{orgID} limit 0,1")
    public OrgHitEggLevelRecord findByOrgID(@Param("orgID") Long orgID);

    @Select("select state from orglevelforegg where orgID=#{orgID} limit 0,1")
    public Integer getLevelByOrgID(@Param("orgID") String orgID);

    @Insert("insert into orglevelforegg(orgID, state, createTime) values (#{orgForHitEggEntity.orgID},#{orgForHitEggEntity.ruleLevel},#{orgForHitEggEntity.createTime})")
    public int addOrgLevel(@Param("orgForHitEggEntity")OrgForHitEggEntity orgForHitEggEntity);

    @Update("update orglevelforegg set state=#{orgForHitEggEntity.ruleLevel},updateTime=#{orgForHitEggEntity.updateTime} where orgid=#{orgForHitEggEntity.orgID}")
    public int updateOrgLevelByOrg(@Param("orgForHitEggEntity")OrgForHitEggEntity orgForHitEggEntity);

    //获取汽修厂s的相关砸蛋信息
    @Select({"<script>" +
                " SELECT olfe.orgid,olfe.state " +
                " FROM orglevelforegg olfe " +
                " WHERE olfe.orgid IN ",
                    "<foreach item='orgId' index='index' collection='orgIds' open='(' separator=',' close=')'>",
                        "#{orgId}",
                    "</foreach>",
            "</script>"})
    public List<OrgHitEggLevelRecord> getOrgIDsWithLevelsByOrgIDs(@Param("orgIds") List<Long> orgIds);
}
