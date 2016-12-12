package com.qipeipu.crm.dtos.statistics;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

/**
 * 汇总统计 Created by johnkim on 15-2-9.
 */
@Data
public class StatisticsAllDTO implements Serializable {
	private static final long serialVersionUID = -3288270082061364520L;
	/***
	 * 客户名称
	 */
	private String mfctyName;
	/**
	 * 询价次数
	 */
	private Integer inquiryNum;
	/**
	 * 订单支付次数
	 */
	private Integer orderPayNum;
	/**
	 * 订单支付次数
	 */
	private BigDecimal orderPayMoney;//订单支付金额
	/**
	 * 订单未支付次数
	 */
	private Integer orderNoPayNum;
	/**
	 * 订单未支付次数
	 */
	private BigDecimal orderNoPayMoney;//订单支付金额

	/***
	 * 客服名称（跟踪人）
	 */
	private String userName;

	/***
	 * 录入时间
	 */
	private Date recordTime;
}
