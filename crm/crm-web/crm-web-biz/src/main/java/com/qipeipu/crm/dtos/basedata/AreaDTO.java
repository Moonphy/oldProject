package com.qipeipu.crm.dtos.basedata;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class AreaDTO {
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
	 * 地区编码
	 */
	private String areaCode;
	/**
	 * 首字母
	 */
	private String shouzimu;
	/**
	 * 拼音
	 */
	private String pingying;
}
