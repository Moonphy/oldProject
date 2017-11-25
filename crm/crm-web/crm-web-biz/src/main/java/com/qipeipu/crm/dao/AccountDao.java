package com.qipeipu.crm.dao;

import com.qipeipu.crm.dtos.basedata.AreaDTO;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.user.AccountEntity;
import com.qipeipu.crm.dtos.user.UserAreaDTO;
import com.qipeipu.crm.provider.AccountProvider;
import org.apache.ibatis.annotations.*;
import org.apache.ibatis.mapping.StatementType;

import java.util.List;

/**
 * Created by laiyiyu on 2015/4/9.
 */
public interface AccountDao {

    @Insert("insert into btl_user (UserName,LoginName,Email,Mp,LoginPwd,Status,IsAdmin,createTime) values (#{accountEntity.userName},#{accountEntity.loginName},#{accountEntity.Email},#{accountEntity.Mp},#{accountEntity.loginPwd},0,0,#{accountEntity.createTime})")
    @SelectKey(statementType = StatementType.STATEMENT, statement = "SELECT LAST_INSERT_ID() AS id", keyProperty = "accountEntity.userId", before = false, resultType = Integer.class)
    public int createAccount(@Param("accountEntity")AccountEntity accountEntity);



    @Update("update btl_user set UserName=#{accountEntity.userName},LoginName=#{accountEntity.loginName},Email=#{accountEntity.Email},Mp=#{accountEntity.Mp},updateTime=#{accountEntity.updateTime} where userid=#{accountEntity.userId}")
    public int updateAccount(@Param("accountEntity")AccountEntity accountEntity);

    @Results(value = {
            @Result(column = "userid", property = "userId"),
            @Result(column = "LoginName", property = "loginName"),
            @Result(column = "UserName", property = "userName"),
            @Result(column = "Email", property = "Email"),
            @Result(column = "Mp", property = "Mp"),
            @Result(column = "DutyName", property = "dutyName")
    })
    @SelectProvider(type = AccountProvider.class, method = "getAccountList")
    public List<AccountEntity> getAccountList(@Param("vo")VoModel<?, ?> vo, @Param("key")String key);


    @SelectProvider(type = AccountProvider.class, method = "getAccountListCount")
    public int getAccountListCount(@Param("key")String key);

    @Results(value = {
            @Result(column = "userid", property = "userId"),
            @Result(column = "LoginName", property = "loginName"),
            @Result(column = "UserName", property = "userName"),
            @Result(column = "Email", property = "Email"),
            @Result(column = "dutyid", property = "dutyId"),
            @Result(column = "areaid", property = "areaId"),
            @Result(column = "Mp", property = "Mp")
    })
    @Select(" SELECT t.userid,UserName,LoginName,Email,Mp,LoginPwd,dutyid,areaid FROM (select tu.userid,UserName,LoginName,Email,Mp,LoginPwd,dutyid from btl_user tu LEFT JOIN t_user_duty tud on tu.userid=tud.userId where tu.UserId=#{userid}) t LEFT JOIN t_user_area tua on t.userid=tua.userid")
    public List<AccountEntity> getAccountByID(@Param("userid") Integer userID);

    @Results(value = {
            @Result(column = "userid", property = "userId"),
            @Result(column = "UserName", property = "userName")
    })
    @Select("select userID,UserName from btl_user where userid=#{userid}")
    public List<AccountEntity> getUserDetailByID(@Param("userid") Integer userID);

    @Delete("delete from btl_user where userid=#{userid}")
    public int delAccountByID(@Param("userid") Integer userID);

    /**
     * 统计总用户数
     * @return
     */
    @Select("select count(1) from btl_user")
    public int countAllUser();

    @Update("update btl_user set LoginPwd=#{pwd} where userid=#{userID}")
    public int resetPwd(@Param("userID") Integer userID,@Param("pwd") String pwd);


    @Results(value = { @Result(column = "userID", property = "userId"),
            @Result(column = "areaID", property = "areaId") })
    @Select({"<script>select userID,areaID from t_user_area where areaID is not null and areaID  in",
            "<foreach item='item' index='index' collection='areaDTOs'",
            "open='(' separator=',' close=')'>",
            "#{item.areaId}",
            "</foreach>",
            "</script>"})
    public List<UserAreaDTO> getUsersByAreas(@Param("areaDTOs")List<AreaDTO> areaDTOs);

    @Select("select userID from btl_user")
    public List<Integer> getAllUserIDs();

}
