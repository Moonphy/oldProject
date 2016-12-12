package com.qipeipu.crm.dtos.task;

import lombok.Data;

/**
 * Created by Administrator on 2015/3/24.
 */
@Data
public class TaskDTO {
	/**
	 * 任务id
	 */
	private Integer taskID;

	/**
	 * 任务名称
	 */
	private String taskName;

	/**
	 * 计划时间
	 */
	private String planTime;

	/**
	 * 状态；0：未完成，1：已取消，2：已过期，3：已完成
	 */
	private Integer state;

}
