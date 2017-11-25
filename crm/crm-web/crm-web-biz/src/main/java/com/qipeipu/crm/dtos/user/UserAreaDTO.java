package com.qipeipu.crm.dtos.user;

import lombok.Data;

@Data
public class UserAreaDTO {
	/**
	 * 用户ID
	 */
	private Integer userId;
	/**
	 * 地区id
	 */
	private Integer areaId;
	/**
	 * 地区名称
	 */
	private String areaName;
	/**
	 * 城市id
	 */
	private Integer cityId;
	/**
	 * 城市名称
	 */
	private String cityName;
	/**
	 * 省份id
	 */
	private Integer proId;
	/**
	 * 省份名称
	 */
	private String proName;
}
