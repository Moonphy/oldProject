package com.qipeipu.crm.dtos.user;

import java.util.Date;

import lombok.Data;

/**
 * 用户-职责
 *
 * @author Gxy
 */
@Data
public class UserDutyDTO {
	/**
	 * 用户id
	 */
	private Integer UserId;
	/**
	 * 职责id
	 */
	private Integer DutyId;
	/**
	 * 插入时间
	 */
	private Date createTime;
	/**
	 * 更新时间
	 */
	private Date updateTime;
}
