package com.qipeipu.crm.dtos.task;

import lombok.Data;

/**
 * Created by Administrator on 2015/3/24.
 */
@Data
public class TaskEntity {
	/**
	 * 任务id
	 */
	private Integer taskID;

	/**
	 * 任务名称
	 */
	private String taskName;

	/**
	 * 用户id
	 */
	private Integer userID;

	/**
	 * 计划时间
	 */
	private String planTime;

	/**
	 * 客户id
	 */
	private Integer custID;

	/**
	 * 厂名称
	 */
	private String mfctyName;

	/**
	 * 状态；0：未完成，1：已取消，2：已过期，3：已完成
	 */
	private Integer state;

	/**
	 * 创建任务的时间
	 */
	private String createTime;

	/**
	 * 修改任务的时间
	 */
	private String updateTime;

	/**
	 * 地址
	 */
	private String address;

}
