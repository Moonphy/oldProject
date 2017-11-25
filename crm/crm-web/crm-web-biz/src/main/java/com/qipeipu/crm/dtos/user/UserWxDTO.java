package com.qipeipu.crm.dtos.user;

import java.beans.ConstructorProperties;

import lombok.Data;
import lombok.experimental.Builder;

@Builder
@Data
public class UserWxDTO {

	/**
	 * 用户ID
	 */
	private Integer userId;
	/**
	 * 用户名
	 */
	private String userName;
	/**
	 * 是否为管理员
	 */
	private Boolean isAdmin;
	/**
	 * 性别：0-女，1-男
	 */
	private Integer Sex;
	/**
	 * 部门id
	 */
	private Integer deptId;
	/**
	 * 部门名称
	 */
	private String deptName;
	/**
	 * 邮箱
	 */
	private String email;
	/**
	 * 手机号
	 */
	private String mp;

	@ConstructorProperties({ "userName", "email", "mp", "deptId" })
	public UserWxDTO(String userName, String email, String mp, Integer deptId) {
		this.userName = userName;
		this.email = email;
		this.mp = mp;
		this.deptId = deptId;
	}

	public UserWxDTO() {
	}

	public UserWxDTO(Integer userId, String userName, Boolean isAdmin,
			Integer sex, Integer deptId, String deptName, String email,
			String mp) {
		super();
		this.userId = userId;
		this.userName = userName;
		this.isAdmin = isAdmin;
		this.Sex = sex;
		this.deptId = deptId;
		this.deptName = deptName;
		this.email = email;
		this.mp = mp;
	}

}
