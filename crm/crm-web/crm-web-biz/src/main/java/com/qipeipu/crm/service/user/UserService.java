package com.qipeipu.crm.service.user;

import java.util.List;

import com.qipeipu.crm.dtos.user.DepartDTO;
import com.qipeipu.crm.dtos.user.UserDTO;
import com.qipeipu.crm.dtos.user.UserMaintainEntity;
import com.qipeipu.crm.dtos.user.UserWxDTO;

/**
 * Created by johnkim on 15-2-5.
 */
/**
 * @author Gxy
 */
public interface UserService {

	public List<UserMaintainEntity> findUserByKey(String key);

	/***
	 * 用户登录
	 *
	 * @param user
	 * @return 返回用户信息，若帐号或密码错误则返回null
	 */
	UserDTO login(UserDTO user);

	/***
	 * 用户修改密码
	 *
	 * @param user
	 * @return 返回用户信息是否修改成功
	 */
	boolean resetPwd(UserDTO user);

	/***
	 * 查找符合条件的客服
	 *
	 * @param user
	 *            条件
	 * @return
	 */
	List<UserDTO> findUser(UserDTO user);

	/***
	 * 查询当前用户个人信息
	 *
	 * @param userId
	 *            条件
	 * @return
	 */
	UserDTO findUserDtl(Integer userId);

	/***
	 * 查询openId是否存在
	 *
	 * @param openId
	 *            条件
	 * @return
	 */
	UserDTO isExistOpenId(String openId);

	/***
	 * 绑定微信号
	 *
	 * @param userId
	 * @param openId
	 */
	Integer bindWx(Integer userId, String openId);

	/***
	 * 微信端查询用户信息
	 *
	 * @param userId
	 * @param openId
	 */
	UserWxDTO findUserWx(Integer userId);

	/**
	 * 修改用户登录密码，修改后解除微信绑定
	 *
	 * @param userId
	 * @param oldPwd
	 * @param newPwd
	 * @return
	 */
	Integer editPwd(Integer userId, String oldPwd, String newPwd);

	/**
	 * 修改用户信息
	 * 
	 * @param userId
	 * @param userInfo
	 * @return
	 */
	Integer editInfo(Integer userId, UserWxDTO userInfo);

	public List<DepartDTO> getDepartList();

}
