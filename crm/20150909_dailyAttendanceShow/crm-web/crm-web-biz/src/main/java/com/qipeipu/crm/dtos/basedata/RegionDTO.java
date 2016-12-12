package com.qipeipu.crm.dtos.basedata;

import lombok.Data;

@Data
public class RegionDTO {
	/**
	 * 大区id
	 */
	private Integer regId;
	/**
	 * 国家id
	 */
	private Integer countryId;
	/**
	 * 大区编码
	 */
	private String regCode;
	/**
	 * 大区名称
	 */
	private String regName;

}
