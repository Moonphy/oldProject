package com.qipeipu.crm.dtos.customer;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;

/***
 * 客户基本数据信息，联系登记页面中
 * @author Administrator
 *
 */
@Data
public class CustomerBaseDataDTO {
	/***
	 * 旧数据信息
	 */
	private Integer inquiryOldNum;
	private Integer treadOldNum;
	private BigDecimal moneyOld;
	/***
	 * 新数据信息
	 */
	private Integer inquiryNewNum;
	private Integer treadNewNum;
	private BigDecimal moneyNew;

	/***
	 * 客户Id
	 */
	private Integer custId;
	/***
	 * 时间，以此时间作为分隔新旧数据
	 */
	private Date time;
	/**
	 * 录入后数据：true;录入前数据false
	 */
	private Boolean isNew;
}
