package com.qipeipu.crm.service.impl.task;

import com.qipeipu.crm.dao.*;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.task.TaskDTO;
import com.qipeipu.crm.dtos.task.TaskEntity;
import com.qipeipu.crm.dtos.task.TaskMfctyEntity;
import com.qipeipu.crm.dtos.visit.CustomerBasedEntity;
import com.qipeipu.crm.service.task.TaskService;
import com.qipeipu.crm.utils.bean.data.MultipleDataSource;
import com.qipeipu.crm.utils.statistics.BaseJudgeUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

/**
 * Created by laiyiyu on 2015/3/24.
 */
@Slf4j
@Service("taskServiceImpl")
public class TaskServiceImpl implements TaskService {
	@Autowired
	private TaskDao taskDao;

	@Autowired
	private UserAreaDao userAreaDao;
	@Autowired
	private WxCustomerDao wxCustomerDao;
	@Autowired
	private UserVisitDao userVisitDao;
	@Autowired
	private WxAccidentCarRemainDao wxAccidentCarRemainDao;
	@Autowired
	private QpuOrgDao qpuOrgDao;

	@Override
	public int delTask(Integer taskID) {
		wxAccidentCarRemainDao.delAccidentCarByTask(taskID);
		userVisitDao.delVisit(taskID);
		return taskDao.delTask(taskID);
	}

	@Override
	public int createTask(TaskEntity taskEntity) {
		return taskDao.createTask(taskEntity);
	}

	@Override
	public List<TaskEntity> getTaskByTaskID(Integer taskID) {
		List<TaskEntity> taskEntityList = taskDao.getTaskByTaskID(taskID);
		return (taskEntityList.size() > 0) ? taskEntityList : null;
	}

	@Override
	public void getTasksByParams(VoModel<?, ?> vo, Integer userId, String key) {
		List<TaskDTO> taskList = taskDao.getTaskByParams(userId, key, vo);
		if (CollectionUtils.isEmpty(taskList)) {
			taskList = Collections.emptyList();
			vo.setTotal(0);
		} else {
			vo.setTotal(taskDao.getTaskCountByParams(userId, key));
		}
		vo.setModel(taskList);
	}

	@Override
	public void getMfctyNameByParams(VoModel<?, ?> vo, Integer userId,
			String key) {
		List<TaskMfctyEntity> taskMfctyEntityList = taskDao
				.getMfctyNameByParams(userId, key, vo);
		if (CollectionUtils.isEmpty(taskMfctyEntityList)) {
			taskMfctyEntityList = Collections.emptyList();
			vo.setTotal(0);
		} else {
			vo.setTotal(taskDao.getMfctyNameCountByParams(userId, key));
		}
		vo.setModel(taskMfctyEntityList);
	}

	@Override
	public void searhMfctyForMainByKeyWord(VoModel<?, ?> vo, String key,
			Integer userID) {
		MultipleDataSource.setDataSourceKey("dataSource");
		List<CustomerBasedEntity> customerBasedEntityForMainList;
		List<Integer> cityIDs = userAreaDao.getCityIDByUserID(userID);
		if (cityIDs.size() == 0) {
			customerBasedEntityForMainList = Collections.emptyList();
			vo.setTotal(0);
			vo.setModel(customerBasedEntityForMainList);
			return;
		}
		Integer cityID = cityIDs.get(0);
		MultipleDataSource.setDataSourceKey("mainDataSource");
		customerBasedEntityForMainList = taskDao.searhMfctyByKeyWordForMain(
				key, cityID, vo);

		if (CollectionUtils.isEmpty(customerBasedEntityForMainList)) {
			customerBasedEntityForMainList = Collections.emptyList();
			vo.setTotal(0);
		} else {
			vo.setTotal(taskDao
					.searhMfctyByKeyWordForMainCount(key, cityID, vo));
		}
		vo.setModel(customerBasedEntityForMainList);
		MultipleDataSource.setDataSourceKey("dataSource");

	}

	@Override
	public void searhMfctyForCustServiceByKeyWord(VoModel<?, ?> vo, String key,
			Integer userID) {
		MultipleDataSource.setDataSourceKey("dataSource");
		List<CustomerBasedEntity> customerBasedEntityForCustList;
		List<Integer> cityIDS = userAreaDao.getCityIDByUserID(userID);
		if (cityIDS.size() == 0) {
			customerBasedEntityForCustList = Collections.emptyList();
			vo.setTotal(0);
			vo.setModel(customerBasedEntityForCustList);
			return;
		}
		Integer cityID = cityIDS.get(0);
		customerBasedEntityForCustList = taskDao
				.searhMfctyByKeyWordForCustService(key, cityID, vo);

		if (CollectionUtils.isEmpty(customerBasedEntityForCustList)) {
			customerBasedEntityForCustList = Collections.emptyList();
			vo.setTotal(0);
		} else {
			vo.setTotal(taskDao.searhMfctyByKeyWordForCustServiceCount(key,
					cityID, vo));
		}
		vo.setModel(customerBasedEntityForCustList);
	}

	@Override
	public Integer getCustIDByInsertMfcty(
			CustomerBasedEntity customerBasedEntity) {
		MultipleDataSource.setDataSourceKey("dataSource");
		Integer mfctyID = customerBasedEntity.getMfctyID();
		log.info("mfctyID:{}",mfctyID);
		List<Integer> custIDS = wxCustomerDao.getMfctyByMfctyID(mfctyID);
		log.info("custIDS:{}",custIDS);
		Integer custID;
		if (custIDS.size() == 0) {
			/*Date date = new Date();
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			//sdf.format(date);
			customerBasedEntity.setCreateTime(sdf.format(date));*/
			/*List<Integer> areaIDs = taskDao
					.getAreaIDByUserID(customerBasedEntity.getUserID());
			if (areaIDs.size() == 0) {
				return null;
			}
			customerBasedEntity.setAreaId(areaIDs.get(0));*/
			log.info("t_customer表中当前{}没有纪录，准备插入数据，customerBasedEntity为：{}",mfctyID,customerBasedEntity);
			wxCustomerDao.createMfcty(customerBasedEntity);
			custID = customerBasedEntity.getId();
		} else {
			custID = custIDS.get(0);
		}

		return custID;
	}

	@Override
	public int updateTaskState(Integer taskID, String updateTime) {
		return taskDao.updateTaskState(taskID, updateTime);
	}



	@Override
	public void searhOrgForName(VoModel<?, ?> vo, String key) {
		if(BaseJudgeUtil.isEmpty(key)){
			return;
		}
		MultipleDataSource.setDataSourceKey("dataSource");
		List<CustomerBasedEntity> customerBasedEntityForCustList;

		customerBasedEntityForCustList = qpuOrgDao.searchOrgByName(key, vo);

		if (CollectionUtils.isEmpty(customerBasedEntityForCustList)) {
			customerBasedEntityForCustList = Collections.emptyList();
			vo.setTotal(0);
		}
		vo.setModel(customerBasedEntityForCustList);
	}


}
