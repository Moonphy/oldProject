package com.qipeipu.crm.dtos.customer;

import java.math.BigDecimal;

import lombok.Data;

/**
 * 客户跟踪后的交易数据
 * 
 * @author Administrator
 *
 */
@Data
public class CustomerTradeDataDTO {
	private Integer inquiryNum;//询价次数
	private Integer inquiryMfctyNum;//询价厂商数量
	private Integer treadNum;//订单支付次数
	private Integer treadMfctyNum;//订单支付厂商数量
	private BigDecimal money;//订单支付金额
}
