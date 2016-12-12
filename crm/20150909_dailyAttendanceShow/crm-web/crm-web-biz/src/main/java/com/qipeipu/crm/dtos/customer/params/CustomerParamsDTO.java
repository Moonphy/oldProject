package com.qipeipu.crm.dtos.customer.params;

import lombok.Data;

/**
 * 已联系客户列表查询参数 Created by johnkim on 15-2-5.
 */
@Data
public class CustomerParamsDTO {
	/***
	 * 查询参数属性
	 */
	/***
	 * 录入日期开始
	 */
	private String beginTime;
	/***
	 * 录入日期结束
	 */
	private String endTime;
	/***
	 * 下单时间开始
	 */
	private String buyBeginTime;
	/***
	 * 下单时间结束
	 */
	private String buyEndTime;
	/**
	 * 订单号
	 */
	private String orderNo;
	/***
	 * 排序:sort=0升序;sort=1降序
	 */
	private String sort;
	/***
	 * 是否为管理员
	 */
	private Boolean isAdmin;

	public static CustomerParamsDTO builder() {
		return new CustomerParamsDTO();
	}

	public CustomerParamsDTO setIsAdmin(Boolean isAdmin) {
		this.isAdmin = isAdmin;
		return this;
	}

}
