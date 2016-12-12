package com.qipeipu.crm.dao.statistics;

import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.user.QpuUserEntity;
import com.qipeipu.crm.provider.QpuUserProvider;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * Created by laiyiyu on 2015/4/17.
 */
public interface QpuUserDao {
    @Select({"<script>select userID FROM qpu_user where orgid in",
            "<foreach item='item' index='index' collection='mfctyIDList'",
            "open='(' separator=',' close=')'>",
            "#{item}",
            "</foreach>",
            "</script>"})
    public List<String> getQPUserIDListByMfctyIDs(@Param("mfctyIDList") List<Integer> mfctyIDList );

    @Select("select userid from qpu_user where orgid=#{custID}")
    public List<String> getQPUserIDListByMfctyID(@Param("custID") Integer custID);


    @Results(value = {
            @Result(column = "userID", property = "userID"),
            @Result(column = "parentID", property = "parentID"),
            @Result(column = "orgID", property = "orgID"),
            @Result(column = "loginName", property = "loginName"),
            @Result(column = "loginMobile", property = "loginMobile"),
            @Result(column = "loginEmail", property = "loginEmail"),
            @Result(column = "password", property = "password"),
            @Result(column = "nickName", property = "nickName"),
            @Result(column = "isChild", property = "isChild"),
            @Result(column = "userName", property = "userName")
    })
    @SelectProvider(type = QpuUserProvider.class, method = "getUserListByMfctyID")
    public List<QpuUserEntity> getUserListByMfctyID(@Param("orgID")String orgID, @Param("vo")VoModel<?, ?> vo);

    @Results(value = {
            @Result(column = "userID", property = "userID"),
            @Result(column = "parentID", property = "parentID"),
            @Result(column = "orgID", property = "orgID"),
            @Result(column = "loginName", property = "loginName"),
            @Result(column = "loginMobile", property = "loginMobile"),
            @Result(column = "loginEmail", property = "loginEmail"),
            @Result(column = "password", property = "password"),
            @Result(column = "nickName", property = "nickName"),
            @Result(column = "isChild", property = "isChild"),
            @Result(column = "userName", property = "userName")
    })
    @Select("select * from qpu_user where userID=#{userID}")
    public QpuUserEntity getUserByUserID(@Param("userID")String userID);

    @SelectProvider(type = QpuUserProvider.class, method = "getUserListByMfctyIDCount")
    public int getUserListByMfctyIDCount(@Param("orgID")String orgID);

    @Delete("delete from qpu_user where userID=#{userID}")
    public int delQpuUserByID(@Param("userID")String userID);

    @Update("update qpu_user set password=#{pwd} where userid=#{userID}")
    public int resetQpuUserPasswordByUserID(@Param("userID")String userID, @Param("pwd")String pwd);

    @Insert("insert into qpu_user set userName=#{qpuUserEntity.userName},loginName=#{qpuUserEntity.loginName},parentID=#{qpuUserEntity.parentID},password=#{qpuUserEntity.password},loginEmail=#{qpuUserEntity.loginEmail},loginMobile=#{qpuUserEntity.loginMobile}")
    public int insertQpuUser(@Param("qpuUserEntity")QpuUserEntity qpuUserEntity);

    //@Update("update qpu_user set userName=#{qpuUserEntity.userName},loginName=#{qpuUserEntity.loginName},loginEmail=#{qpuUserEntity.loginEmail},loginMobile=#{qpuUserEntity.loginMobile} where userid=#{qpuUserEntity.userID}" )
    @UpdateProvider(type = QpuUserProvider.class, method = "batchUpdateQpuUser")
    public int batchUpdateQpuUser(@Param("qpuUserEntity") QpuUserEntity qpuUserEntity);

    @Results(value = {
            @Result(column = "userID", property = "userID"),
            @Result(column = "parentID", property = "parentID"),
            @Result(column = "orgID", property = "orgID"),
            @Result(column = "loginName", property = "loginName"),
            @Result(column = "loginMobile", property = "loginMobile"),
            @Result(column = "loginEmail", property = "loginEmail"),
            @Result(column = "password", property = "password"),
            @Result(column = "nickName", property = "nickName"),
            @Result(column = "isChild", property = "isChild"),
            @Result(column = "userName", property = "userName")
    })
    @Select("select * from qpu_user where orgID=#{orgID} and (isChild=0 or isChild is null) ")
    public List<QpuUserEntity> getUserListByMfctyIDForHitEgg(@Param("orgID")String orgID);

    //获取汽修厂s的主帐号信息
    @Select({"<script>" +
                " SELECT * " +
                " FROM qpu_user u " +
                " WHERE u.orgID IN ",
                        "<foreach item='orgId' index='index' collection='orgIds' open='(' separator=',' close=')'>",
                            "#{orgId}",
                        "</foreach>",
                    " AND (u.isChild = 0 OR u.isChild IS NULL) ",
            "</script>"})
    public List<QpuUserEntity> getMainUsersByOrgIds(@Param("orgIds") List<Long> orgIds);


    @Select("select count(1) from main.qpu_user where loginName=#{loginKey} or loginMobile=#{loginKey} or loginEmail=#{loginKey}")
    public int countExistAccount(@Param("loginKey") String loginKey);

    @Select("select count(1) from main.qpu_user where (loginName=#{loginKey} or loginMobile=#{loginKey} or loginEmail=#{loginKey}) AND userid=#{userID}")
    public int countExistAccountByUserID(@Param("loginKey") String loginKey, @Param("userID") String userID);

}
