package com.qipeipu.crm.dtos.main;

import lombok.Data;

import java.util.Date;

/**
 * main库中的汽修厂DTO Created by johnkim on 15-2-6.
 */
@Data
public class MorgDTO {
	/***
	 * qp_user中的字段
	 */
	private long userId;
	private String parentID;
	private String orgId;
	private String loginName;
	private String loginMobile;
	private String loginEmail;
	private String nickName;
	private String imageUrl;
	private int status;
	private Date createTime;

	/***
	 * qp_org中的字段
	 */
	private String orgName;
	private int orgType;
	private String businessLicenseNo;
	private String businessLicensePic;
	private String legalPerson;
	private String identityNo;
	private String contactPerson;
	private String contactMobile;
	private String email;
	private String fax;
	private int cityId;
	private String cityName;
	private String address;
	private String facadePics;
	private Integer provinceID;

}
