package com.qipeipu.crm.dtos.customer;

import java.util.Date;

import lombok.Data;

/**
 * Created by johnkim on 15-2-5.
 */
@Data
public class CustomerDTO {
	/***
	 * id
	 */
	private Integer id;
	/***
	 * 客户id
	 */
	private Integer mfctyId;
	/***
	 * 客户名称
	 */
	private String mfctyName;
	/***
	 * 客户城市
	 */
	private Integer cityId;
	/***
	 * 客户省份
	 */
	private Integer provinceID;
	/***
	 * 联系电话
	 */
	private String cactTel;
	/***
	 * 联系人
	 */
	private String cactMan;
	/***
	 * 手机号
	 */
	private String mp;
	/***
	 * 邮箱
	 */
	private String email;
	/***
	 * 地址
	 */
	private String address;
	/***
	 * 创建时间
	 */
	private Date createTime;
	/***
	 * 更新时间
	 */
	private Date updateTime;

	/***
	 * 推荐星级
	 */
	private Integer star;
	/***
	 * 客服id
	 */
	private Integer userId;

	/***
	 * 客服名称(btl_user)
	 */
	private String userName;

	/***
	 * 录入时间
	 */
	private Date recordTime;

	/**
	 * 微信号
	 */
	private String weCharNo;

	/**
	 * 　汽修厂类型
	 */
	private Integer mfctyType;

	/**
	 * 　采购构成：线上
	 */
	private String onlineBuy;

	/**
	 * 　客户概况
	 */
	private String memo;

}
