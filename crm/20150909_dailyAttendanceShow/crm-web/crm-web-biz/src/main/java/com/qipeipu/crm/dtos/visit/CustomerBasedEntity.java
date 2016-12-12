package com.qipeipu.crm.dtos.visit;

import lombok.Data;

/**
 * Created by laiyiyu on 2015/3/24.
 */
@Data
public class CustomerBasedEntity {

	/**
	 * 客户id
	 */
	private Integer id;

	/**
	 * 厂商id
	 */
	private Integer mfctyID;

	/**
	 * 厂名
	 */
	private String mfctyName;



	private Integer provinceID;

	/**
	 * 城市id
	 */
	private Integer cityID;




	/**
	 * 联系电话
	 */
	private String cactTel;

	/**
	 * 联系人
	 */
	private String cactMan;

	/**
	 * 手机
	 */
	private String mp;

	/**
	 * 邮件
	 */
	private String email;

	/**
	 * 地址
	 */
	private String address;

	/**
	 * 创立时间
	 */
	private String createTime;

	/**
	 * 更改时间
	 */
	private String updateTime;

	/**
	 * 备注(内容)
	 */
	private String memo;

	/**
	 * 星级
	 */
	private Integer star;

	/**
	 * 用户id
	 */
	private Integer userID;

	/**
	 * 记录时间
	 */
	private String recordTime;

	/**
	 * 微信号
	 */
	private String weCharNo;

	/**
	 * 厂商类型
	 */
	private Integer mfctyType;

	private String onlineBuy;

	/**
	 * 烤漆房
	 */
	private String boothRoom;

	/**
	 * 升降架
	 */
	private String liftingFrame;

	/**
	 * 经营面积
	 */
	private Integer businessArea;

	private Integer areaId;

}
