package com.qipeipu.crm.dtos.basedata;

import lombok.Data;

@Data
public class ProvinceDTO {
	/**
	 * 省份id
	 */
	private Integer proId;
	/**
	 * 中国地区：华南华北..
	 */
	private Integer reId;
	/**
	 * 省份编码
	 */
	private String proCode;
	/**
	 * 省份名称
	 */
	private String proName;

}
