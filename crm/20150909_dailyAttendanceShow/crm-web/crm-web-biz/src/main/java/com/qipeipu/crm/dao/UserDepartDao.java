package com.qipeipu.crm.dao;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.qipeipu.crm.dtos.user.UserDepartDTO;

public interface UserDepartDao {
	/***
	 * 查询一个用户下对应的部门
	 */
	@Select({ "SELECT userId,deptId FROM t_user_depart WHERE UserId=#{userId} limit 0,1" })
	UserDepartDTO getUserDepart(@Param("userId") Integer userId);

	/***
	 * 查询一个部门下对应的用户
	 */
	@Select({ "SELECT userId,deptId FROM t_user_depart  WHERE DeptId=#{departId}" })
	List<UserDepartDTO> getDepartUser(@Param("departId") Integer departId);

	@Update({ "UPDATE t_user_depart SET DeptId=#{deptId},updateTime=now() WHERE UserId=#{userId}" })
	Integer updateUserDepart(@Param("userId") Integer userId,
			@Param("deptId") Integer deptId);

	@Insert({ "INSERT INTO t_user_depart (UserId,DeptId,createTime,updateTime) "
			+ "VALUES (#{userId},#{deptId},now(),now())" })
	Integer addUserDepart(@Param("userId") Integer userId,
			@Param("deptId") Integer deptId);

}
