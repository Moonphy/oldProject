package com.qipeipu.crm.dtos.main.order.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;

/**
 * Created by qukun on 14-12-29.
 */
@Data
public class OrderInCSDTO implements Serializable {
	private static final long serialVersionUID = -1862068703651168249L;

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
	 * 创始人
	 */
	private String maker;

	/**
	 * 创建时间
	 */
	private Date makeTime;

	/**
	 * 发布人
	 */
	private String publisher;

	/**
	 * 发布时间
	 */
	private Date publishTime;

	/**
	 * 总价
	 */
	private BigDecimal money;

	/**
	 * 订单状态
	 */
	private String orderStatus;

	/**
	 * 支付状态
	 */
	private Integer payStatus;

	/**
	 * 收款人姓名
	 */
	private String receiveName;

	/**
	 * 送货地址
	 */
	private String receiveAddress;

	/**
	 * 手机
	 */
	private String mp;

	/**
	 * 物流方式
	 */
	private String deliveryModeName;

	/**
	 * 物流备注
	 */
	private String deliveryMemo;

	/**
	 * 发票名称
	 */
	private String invoiceName;

	/**
	 * 发票抬头
	 */
	private String invoiceTitle;

	/**
	 * 发票内容
	 */
	private String invoiceContent;

	/**
	 * 失效日期
	 */
	private Date orderEndTime;

	/**
	 * 账户类型Id
	 */
	private Integer accountTypeId;

	/**
	 * 制单人
	 */
	private long makeUserId;

	/**
	 * 原金额
	 */
	private BigDecimal factMoney = BigDecimal.ZERO;
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

}
