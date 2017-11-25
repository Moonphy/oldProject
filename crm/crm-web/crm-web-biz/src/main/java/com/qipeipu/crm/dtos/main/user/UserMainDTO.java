package com.qipeipu.crm.dtos.main.user;

import java.io.Serializable;
import java.util.Date;

import lombok.Data;

/**
 * 用户数据传输对象(dto) Created with IntelliJ IDEA. User: lichenq Date: 14/12/28 Time:
 * 下午6:18
 */
@Data
public class UserMainDTO implements Serializable {
	private static final long serialVersionUID = 4927582577175707006L;

	/**
	 * 用户ID，唯一标识
	 */
	private Long userID;

	/**
	 * 父用户ID
	 */
	private Integer parentID;

	/**
	 * 是否子用户（账号）
	 */
	private Boolean isChild;

	/**
	 * 所属组织ID
	 */
	private Integer orgID;

	/**
	 * 登陆名
	 */
	private String loginName;

	/**
	 * 登陆手机号
	 */
	private String loginMobile;

	/**
	 * 登陆邮箱
	 */
	private String loginEmail;

	/**
	 * 昵称
	 */
	private String nickName;

	/**
	 * 头像相对路径url
	 */
	private String imageUrl;

	/**
	 * 用户状态
	 */
	private Integer status;

	/**
	 * 用户密码
	 */
	private String password;

	/**
	 * 更新时间
	 */
	private Date updateTime;

	/**
	 * 创建时间
	 */
	private Date createTime;
}
