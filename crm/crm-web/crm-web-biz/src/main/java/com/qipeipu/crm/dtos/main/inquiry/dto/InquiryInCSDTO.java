package com.qipeipu.crm.dtos.main.inquiry.dto;

import java.util.Date;

import lombok.Data;

@Data
public class InquiryInCSDTO {
	/**
	 * 询价单Id
	 */
	private Integer inquiryId;
	/**
	 * 询价单号
	 */
	private String inquiryNo;
	/**
	 * 询价发布时间
	 */
	private Date publishTime;
	/**
	 * 询价状态
	 */
	private String status;
	/**
	 * 用户Id
	 */
	private Long userId;

}
