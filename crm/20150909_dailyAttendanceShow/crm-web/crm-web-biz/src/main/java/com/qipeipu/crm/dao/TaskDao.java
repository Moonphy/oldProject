package com.qipeipu.crm.dao;

import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.task.TaskDTO;
import com.qipeipu.crm.dtos.task.TaskEntity;
import com.qipeipu.crm.dtos.task.TaskMfctyEntity;
import com.qipeipu.crm.dtos.visit.CustomerBasedEntity;
import com.qipeipu.crm.provider.TaskProvider;
import com.qipeipu.crm.utils.statistics.DateRange;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * Created by laiyiyu on 2015/3/24.
 */
public interface TaskDao {

	@Delete("delete from t_user_task where taskid=#{taskID}")
	public int delTask(@Param("taskID")Integer taskID);

	@Results(value = { @Result(column = "taskID", property = "taskID"),
			@Result(column = "taskName", property = "taskName"),
			@Result(column = "userID", property = "userID"),
			@Result(column = "planTime", property = "planTime"),
			@Result(column = "custID", property = "custID"),
			@Result(column = "state", property = "state"),
			@Result(column = "createTime", property = "createTime"),
			@Result(column = "updateTime", property = "updateTime"),
			@Result(column = "mfctyName", property = "mfctyName") })
	@Select("select "
			+ "tut.TaskId,tut.TaskName,tut.UserId,tut.planTime,tut.CustId,tut.state,tut.createTime,tut.updateTime,tc.MfctyName "
			+ "from t_user_task as tut "
			+ "LEFT JOIN t_customer as tc on tut.CustId = tc.id where tut.TaskId=#{taskID};")
	public List<TaskEntity> getTaskByTaskID(@Param("taskID") Integer taskID);

	@Insert("insert into t_user_task (taskName,userID,custID,state,planTime,createTime) values (#{taskEntity.taskName},#{taskEntity.userID},#{taskEntity.custID},0,#{taskEntity.planTime},#{taskEntity.createTime})")
	public int createTask(@Param("taskEntity") TaskEntity taskEntity);

	@SelectProvider(type = TaskProvider.class, method = "getTaskByParamsSql")
	public List<TaskDTO> getTaskByParams(@Param("userId") Integer userId,
			@Param("key") String key, @Param("vo") VoModel<?, ?> vo);

	@SelectProvider(type = TaskProvider.class, method = "getTaskByParamsSqlCount")
	public Integer getTaskCountByParams(@Param("userId") Integer userId,
			@Param("key") String key);

	@Results(value = { @Result(column = "taskID", property = "taskID"),
			@Result(column = "CustId", property = "custID"),
			@Result(column = "planTime", property = "planTime"),
			@Result(column = "mfctyName", property = "mfctyName") })
	@SelectProvider(type = TaskProvider.class, method = "getMfctyNameByParamsSql")
	public List<TaskMfctyEntity> getMfctyNameByParams(
			@Param("userId") Integer userId, @Param("key") String key,
			@Param("vo") VoModel<?, ?> vo);

	@SelectProvider(type = TaskProvider.class, method = "getMfctyNameByParamsSqlCount")
	public Integer getMfctyNameCountByParams(@Param("userId") Integer userId,
			@Param("key") String key);

	@SelectProvider(type = TaskProvider.class, method = "getSeachMfctyForCustService")
	public List<CustomerBasedEntity> searhMfctyByKeyWordForCustService(
			@Param("key") String keym, @Param("cityID") Integer cityID,
			@Param("vo") VoModel<?, ?> vo);

	@SelectProvider(type = TaskProvider.class, method = "getSeachMfctyForCustServiceCount")
	public Integer searhMfctyByKeyWordForCustServiceCount(
			@Param("key") String key, @Param("cityID") Integer cityID,
			@Param("vo") VoModel<?, ?> vo);

	@Results(value = { @Result(column = "orgID", property = "mfctyID"),
			@Result(column = "orgName", property = "mfctyName"),
			@Result(column = "contactPerson", property = "cactMan"),
			@Result(column = "contactMobile", property = "cactTel"),
			@Result(column = "address", property = "address"),
			@Result(column = "createTime", property = "createTime") })
	@SelectProvider(type = TaskProvider.class, method = "getSeachMfctyForMain")
	public List<CustomerBasedEntity> searhMfctyByKeyWordForMain(
			@Param("key") String key, @Param("cityID") Integer cityID,
			@Param("vo") VoModel<?, ?> vo);

	@SelectProvider(type = TaskProvider.class, method = "getSeachMfctyByKeyWordForMainCount")
	public Integer searhMfctyByKeyWordForMainCount(@Param("key") String key,
			@Param("cityID") Integer cityID, @Param("vo") VoModel<?, ?> vo);



	@Update("update t_user_task set state=3,updateTime=#{updateTime} where taskID=#{taskID}")
	public int updateTaskState(@Param("taskID") Integer taskID, @Param("updateTime") String updateTime);


	@Select("select custID from t_user_task where taskid=#{taskID}")
	public Integer getCustIDByTaskID(@Param("taskID") Integer taskID);

	/**
	 * 统计任务使用数
	 * @return
	 */
	@SelectProvider(type = TaskProvider.class, method = "statisticsUserByTaskNumByUserAndTime")
	public int statisticsUserByTaskNumByUserAndTime(@Param("dateRange")DateRange dateRange, @Param("userIDs")List<Integer> userIDs);
}
