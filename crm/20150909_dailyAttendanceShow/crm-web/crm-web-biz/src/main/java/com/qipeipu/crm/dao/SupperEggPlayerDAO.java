package com.qipeipu.crm.dao;

import com.qipeipu.crm.dao.bean.SuperEggPlayerRecord;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.ResultMap;
import org.apache.ibatis.annotations.Select;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Administrator:LiuJunyong on 2015/7/28.
 * 砸蛋特殊用户数据
 */
public interface SupperEggPlayerDAO {
    //获取该组织的砸蛋特殊用户信息(不管过不过期都要显示=-=)
    @Select("SELECT * " +
            " FROM egg_player ep " +
            " WHERE ep.orgId = #{orgId} ")
    public List<SuperEggPlayerRecord> findByOrgId(@Param("orgId") long orgId) ;

    //统计该组织的砸蛋特殊用户个数
    @Select(" SELECT count(1) " +
            " FROM egg_player ep " +
            " WHERE ep.orgId = #{orgID} " +
                " AND ep.startTime <= now() " +
                " AND now() <= ep.endTime ")
    public Integer getAvailableCountByOrgID(@Param("orgID") String orgID) ;

    //更新相关帐号的砸蛋信息
    @Insert(" INSERT INTO egg_player(" +
                " orgId ," +
                " userId ," +
                " startTime ," +
                " endTime ," +
                " level ," +
                " ratio ," +
                " createTime ," +
                " updateTime) " +
            " VALUES (" +
                " #{re.orgId} ," +
                " #{re.userId} ," +
                " #{re.startTime} ," +
                " #{re.endTime} ," +
                " #{re.level} ," +
                " #{re.ratio} ," +
                " now() ," +
                " now()) " +
            " ON DUPLICATE KEY UPDATE " +
                " startTime = #{re.startTime} ," +
                " endTime = #{re.endTime} ," +
                " level = #{re.level} ," +
                " ratio = #{re.ratio} ," +
                " updateTime = now()")
    public int insertOrUpDateSuperEggPlayer(@Param("re") SuperEggPlayerRecord re) ;


    @Select({"<script>",
                " SELECT * ",
                " FROM egg_player ep ",
                " WHERE ep.userId IN ",
                    "<foreach item='id' index='index' collection='ids' open='(' separator=',' close=')'>",
                        "#{id}",
                    "</foreach>",
            "</script>"
    })
    public List<SuperEggPlayerRecord> findByUserIds(@Param("ids") List<Long> ids);
}
