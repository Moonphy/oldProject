package com.qipeipu.crm.service.task;

import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.task.TaskEntity;
import com.qipeipu.crm.dtos.visit.CustomerBasedEntity;

import java.util.List;

/**
 * Created by laiyiyu on 2015/3/24.
 */
public interface TaskService {

	public int delTask(Integer taskID);


	/**
	 * 创建任务
	 *
	 * @param taskEntity
	 * @return
	 */
	public int createTask(TaskEntity taskEntity);

	/**
	 * 根据任务ID获取任务详细信息
	 *
	 * @param taskID
	 * @return
	 */
	public List<TaskEntity> getTaskByTaskID(Integer taskID);

	/**
	 * 任务列表查询
	 *
	 * @param userId
	 * @param key
	 * @return
	 */
	public void getTasksByParams(VoModel<?, ?> vo, Integer userId, String key);

	/**
	 * 分页获取厂名
	 *
	 * @param vo
	 * @param userId
	 * @param key
	 */
	public void getMfctyNameByParams(VoModel<?, ?> vo, Integer userId,
			String key);

	/**
	 * 到main库搜索厂名
	 *
	 * @param key
	 * @return
	 */
	public void searhMfctyForMainByKeyWord(VoModel<?, ?> vo, String key,
			Integer userID);

	/**
	 * 到custService库搜索厂名
	 *
	 * @param key
	 * @return
	 */
	public void searhMfctyForCustServiceByKeyWord(VoModel<?, ?> vo, String key,
			Integer userID);

	/**
	 * 是否往custService库插入新的厂
	 *
	 * @param customerBasedEntity
	 * @return 厂id
	 */
	public Integer getCustIDByInsertMfcty(
			CustomerBasedEntity customerBasedEntity);

	public int updateTaskState(Integer taskID, String updateTime);


	public void searhOrgForName(VoModel<?, ?> vo, String key);

}
