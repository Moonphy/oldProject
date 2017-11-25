package com.qipeipu.crm.dao;

import org.apache.ibatis.annotations.*;

import java.util.List;

public interface UserDutyDao {
	@Select({ "SELECT DutyId FROM t_user_duty WHERE UserId=#{userId}" })
	List<Integer> findByUserId(@Param("userId") Integer userId);

	@Select("select DutyId from t_user_duty where UserId=#{userID}")
	public Integer getAuthorityByUserID(@Param("userID") Integer userID);


	@Update("update t_user_duty set dutyID=#{dutyID},updateTime=#{updateTime} where userid=#{userID}")
	public int updateUserDuty(@Param("userID") Integer userID, @Param("dutyID") Integer areaID,@Param("updateTime") String updateTime);


	@Insert("insert into t_user_duty (userid,dutyid,createTime) values (#{userID},#{dutyID},#{createTime})")
	public int createUserDuty(@Param("userID") Integer userID, @Param("dutyID") Integer dutyID,@Param("createTime") String createTime);

	@Delete("delete from t_user_duty where userid=#{userID}")
	public int delUserDuty(@Param("userID") Integer userID);
}
