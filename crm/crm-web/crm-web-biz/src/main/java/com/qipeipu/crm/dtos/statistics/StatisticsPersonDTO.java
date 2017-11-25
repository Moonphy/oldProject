package com.qipeipu.crm.dtos.statistics;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

/**
 * 电话营销统计 Created by johnkim on 15-2-9.
 */
@Data
public class StatisticsPersonDTO implements Serializable {
	private static final long serialVersionUID = 5160712981891108595L;

	/**
	 * 订单主单ID
	 */
	private Integer orderMainId;

	/**
	 * 订单号
	 */
	private String orderMainNo;

	/**
	 * 汽修厂Id
	 */
	private Integer demanderId;

	/**
	 * 汽修厂名称
	 */
	private String demander;

	/**
	 * 发布时间
	 */
	private Date publishTime;

	/**
	 * 总价
	 */
	private BigDecimal money;

	/**
	 * 支付状态
	 */
	private Integer payStatus;

	/**
	 * 制单人
	 */
	private long makeUserId;

	/**
	 * 支付时间
	 */
	private Date payTime;
	/**
	 * 付款人
	 */
	private Integer payUserId;
	/**
	 * 支付方式
	 */
	private String payModeName;
	/**
	 * 收货时间
	 */
	private Date recvTime;
	/**
	 * 录入时间
	 */
	private Date recordTime;
	/**
	 * 跟踪人
	 */
	private String userName;
	/**
	 * 订单生成到用户收货的时间差
	 */
	private String spentTime;
}
