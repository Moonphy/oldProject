package com.qipeipu.crm.dtos.user;

import lombok.Data;

/**
 * 用户部门-关联表
 * 
 * @author Gxy
 */
@Data
public class UserDepartDTO {
	/**
	 * 用户id
	 */
	private Integer userId;
	/**
	 * 部门id
	 */
	private Integer deptId;
}
