package com.qipeipu.crm.dao;

import com.qipeipu.crm.dao.main.provider.UserProvider;
import com.qipeipu.crm.dtos.user.DepartDTO;
import com.qipeipu.crm.dtos.user.UserDTO;
import com.qipeipu.crm.dtos.user.UserMaintainEntity;
import com.qipeipu.crm.dtos.user.UserWxDTO;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * Created by johnkim on 15-2-5.
 */
public interface UserDao {


	@Results(value = { @Result(column = "userID", property = "userID"),
			@Result(column = "Mp", property = "mp"),
			@Result(column = "userName", property = "userName") })
	@SelectProvider(type = UserProvider.class, method = "getAllUser")
	public List<UserMaintainEntity> getAllUser(@Param("nameSearch") String nameSearch);


	/***
	 * 用户登录
	 *
	 * @param user
	 *            需登录的用户
	 * @return
	 */
	@Select({ "<script>SELECT * from btl_user where LoginName=#{User.loginName} and LoginPwd=#{User.loginPwd}</script>" })
	List<UserDTO> login(@Param("User") UserDTO user);

	/***
	 * 用户密码重置
	 *
	 * @param user
	 *            需登录的用户
	 * @return
	 */

	@Update({ "<script>UPDATE btl_user set LoginPwd=#{User.newloginPwd} where LoginName=#{User.loginName}</script>" })
	int resetPwd(@Param("User") UserDTO user);

	/***
	 * 查找符合条件的客服
	 *
	 * @param user
	 *            条件
	 * @return
	 */
	@SelectProvider(type = UserProvider.class, method = "getFindUserSql")
	List<UserDTO> findUser(@Param("user") UserDTO user);

	/**
	 * 查询当前用户的详细信息
	 *
	 * @param userId
	 * @return
	 */
	@Select({ "SELECT UserId,UserName,LoginName,IsAdmin,WeCharNo,Sex from btl_user where UserId=#{id} AND `Status`=0" })
	UserDTO findeUserDtl(@Param("id") Integer userId);

	/**
	 * 查询openId是否存在
	 *
	 * @param openId
	 * @return
	 */
	//@Select({ "SELECT UserId,UserName,LoginName,IsAdmin,WeCharNo,Sex,OpenId FROM btl_user WHERE OpenId=#{openId}" })
	@Select({ "SELECT * FROM btl_user WHERE OpenId=#{openId}" })
	UserDTO isExistOpenId(@Param("openId") String openId);

	/**
	 * 绑定用户
	 *
	 * @param userId
	 * @param openId
	 * @return
	 */
	@Update({ "UPDATE btl_user set OpenId=#{openId} WHERE UserId=#{userId}" })
	Integer updateBindWx(@Param("userId") Integer userId,
			@Param("openId") String openId);

	/**
	 * 更新用户密码，注销微信绑定
	 *
	 * @param userId
	 * @param oldPwd
	 *            旧密码
	 * @param newPwd
	 *            新密码
	 * @return
	 */
	@Update({ "UPDATE btl_user set LoginPwd=#{newPwd},WeCharNo=null,OpenId=null WHERE UserId=#{userId} AND LoginPwd=#{oldPwd}" })
	Integer editPwd(@Param("userId") Integer userId,
			@Param("oldPwd") String oldPwd, @Param("newPwd") String newPwd);

	@Update({ "UPDATE btl_user set UserName=#{userInfo.userName},Email=#{userInfo.email},"
			+ "Mp=#{userInfo.mp} WHERE UserId=#{userId}" })
	Integer editInfo(@Param("userId") Integer userId,
			@Param("userInfo") UserWxDTO userInfo);


	@Results(value = { @Result(column = "deptid", property = "deptId"),
			@Result(column = "deptName", property = "deptName") })
	@Select("select deptid,deptName from t_depart")
	public List<DepartDTO> getDepartList();
}
