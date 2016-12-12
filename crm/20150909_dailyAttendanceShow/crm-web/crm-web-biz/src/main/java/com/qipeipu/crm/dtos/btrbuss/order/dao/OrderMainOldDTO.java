package com.qipeipu.crm.dtos.btrbuss.order.dao;

import java.math.BigDecimal;

import lombok.Data;
/**
 * 与旧的数据库中订单表关联
 * @author Administrator
 *
 */
@Data
public class OrderMainOldDTO {
	/**
	 * 所有订单数量
	 */
	private Integer allOrderNum;
	/**
	 * 所有订单金额
	 */
	private BigDecimal allOrderMoney;
}
