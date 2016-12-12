package com.qipeipu.crm.dtos.auth;

import lombok.Data;

@Data
public class AuthDTO {
	/**
	 * 职责id
	 */
	private Integer dutyid;
	/**
	 * 资源id
	 */
	private Integer sourceid;
	/**
	 * 请求uri
	 */
	private String uri;
	/**
	 * 资源请求的方法(0:未知,1:HTTP_GET,2:HTTP_POST)
	 */
	private Integer methodType ;
	/**
	 * 所属系统id(0:无所属系统id,1:CRM系统)
	 */
	private Integer systemId ;
}
