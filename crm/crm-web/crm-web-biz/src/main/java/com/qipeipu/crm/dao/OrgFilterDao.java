package com.qipeipu.crm.dao;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

/**
 * Created by laiyiyu on 2015/5/25.
 */
public interface OrgFilterDao {
    @Select("select count(1) from t_org_filter where orgID=#{orgID}")
    public int countOrgByID(@Param("orgID") String orgID);

    @Insert("insert into t_org_filter set orgID=#{orgID}")
    public int insertFilterOrg(@Param("orgID") String orgID);

    @Delete("delete from t_org_filter where orgID=#{orgID}")
    public int delFilterOrg(@Param("orgID") String orgID);


}
