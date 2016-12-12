package com.qipeipu.crm.dtos.user;

import java.util.Date;

import lombok.Data;

@Data
public class UserAreaEntity {

	/**
	 * 用户ID
	 */
	private Integer userId;

	/**
	 * 地区id
	 */
	private Integer areaId;

	/**
	 * 插入数据时间
	 */
	private Date creatTime;
	/**
	 * 更新时间
	 */
	private Date updateTime;

}
