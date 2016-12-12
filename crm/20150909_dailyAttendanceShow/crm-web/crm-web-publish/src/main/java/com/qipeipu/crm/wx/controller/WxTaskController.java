package com.qipeipu.crm.wx.controller;

import com.qipeipu.crm.dtos.global.ResultDTO;
import com.qipeipu.crm.dtos.global.ResultState;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.main.MorgDTO;
import com.qipeipu.crm.dtos.task.TaskEntity;
import com.qipeipu.crm.dtos.visit.CustomerBasedEntity;
import com.qipeipu.crm.service.main.MorgService;
import com.qipeipu.crm.service.task.TaskService;
import com.qipeipu.crm.session.UserSessionInfo;
import com.qipeipu.crm.session.bean.CrmSessionUser;
import com.qipeipu.crm.utils.bean.tools.GUtils;
import com.qipeipu.crm.wx.util.TimeUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.List;

/**
 * Created by laiyiyu on 2015/3/24.
 */
@Slf4j
@Controller
@RequestMapping(value = "wx/task")
public class WxTaskController {

	@Autowired
	MorgService morgService;

	@Autowired
	private TaskService taskService;


	@RequestMapping(value = "del/specifiTask", method = RequestMethod.GET)
	public void delTaskByID(HttpServletRequest request,
							HttpServletResponse response, Integer taskID) {

		ResultDTO result = null;


		int delState = taskService.delTask(taskID);
		if(delState==0){
			result = ResultDTO.failResult(ResultState.ERROR_CODE
					, "任务删除失败");
			GUtils.responseJson(response, result);
			return;
		}else{
			result = ResultDTO.successResult(ResultState.SUCCESS_CODE, "任务删除成功");
		}
		GUtils.responseJson(response, result);

	}

	@RequestMapping(value = "create/task", method = RequestMethod.POST)
	public void createCustomer(HttpServletRequest request,
							   HttpServletResponse response, TaskEntity taskEntity,
							   CustomerBasedEntity customerBasedEntity) {
		ResultDTO result;
		try {
			Integer userID = UserSessionInfo.user_getUserOfRequest(request)
					.getUserId();
			String currentTime = TimeUtil.getCurrentTime();
			taskEntity.setUserID(userID);
			customerBasedEntity.setUserID(userID);
			Integer custID = null;
			Integer mfctyID = customerBasedEntity.getMfctyID();
			if (mfctyID != null) {

				MorgDTO morgDTO = morgService.getMorgInfo(mfctyID);

				if (morgDTO == null) {
					result = ResultDTO.failResult(ResultState.ERROR_CODE,
							"无法获取org库的用户信息,任务添加失败");
					GUtils.responseJson(response, result);
					return;
				}
				log.info("创建任务，用户为新注册，需从org表中同步汽修厂数据，morgDTO:{}",morgDTO);
				customerBasedEntity.setMfctyName(morgDTO.getOrgName());
				customerBasedEntity.setUserID(userID);
				customerBasedEntity.setAddress(morgDTO.getAddress());
				customerBasedEntity.setCactTel(morgDTO.getContactMobile());
				customerBasedEntity.setCactMan(morgDTO.getContactPerson());
				customerBasedEntity.setEmail(morgDTO.getEmail());
				customerBasedEntity.setMfctyType(morgDTO.getOrgType());
				customerBasedEntity.setMfctyID(mfctyID);
				customerBasedEntity.setProvinceID(morgDTO.getProvinceID());
				customerBasedEntity.setCreateTime(new SimpleDateFormat(
						"yyyy-MM-dd HH:mm:ss").format(morgDTO.getCreateTime()));
				custID = taskService.getCustIDByInsertMfcty(customerBasedEntity);
				if (custID == null) {
					result = ResultDTO.failResult(ResultState.ERROR_CODE,
							"无法获取custid,任务添加失败");
					GUtils.responseJson(response, result);
					return;
				}
			} else {
				custID = taskEntity.getCustID();
			}
			taskEntity.setCustID(custID);
			taskEntity.setCreateTime(currentTime);
			int updateState = taskService.createTask(taskEntity);
			if (updateState == 0) {
				result = ResultDTO.failResult(ResultState.ERROR_CODE, "任务添加失败");
				GUtils.responseJson(response, result);
				return;
			} else {
				result = ResultDTO
						.successResult(ResultState.SUCCESS_CODE, "任务添加成功");
			}
		}catch (Exception e){
			result = ResultDTO.failResult(ResultState.ERROR_CODE, "任务添加失败");
			log.error("创建任务失败:{}",e.getMessage());
			log.error("具体stack:{}",e);
		}
		GUtils.responseJson(response, result);
	}

	@RequestMapping(value = "find/specifiTask", method = RequestMethod.GET)
	public void getTaskByID(HttpServletRequest request,
			HttpServletResponse response, Integer taskID) {

		List<TaskEntity> taskEntityList = taskService.getTaskByTaskID(taskID);
		ResultDTO<?> result = null;
		if (taskEntityList == null) {
			taskEntityList = Collections.EMPTY_LIST;
		}
		result = ResultDTO.successResult(taskEntityList);

		GUtils.responseJson(response, result);

	}

	@RequestMapping(value = "find/list", method = RequestMethod.GET)
	public void getList(HttpServletRequest request,
			HttpServletResponse response, VoModel<?, ?> vo, String key) {
		CrmSessionUser user = UserSessionInfo.user_getUserOfRequest(request);
		taskService.getTasksByParams(vo, user.getUserId(), key);
		GUtils.responseJson(response, ResultDTO.successResult(vo));
	}

	@RequestMapping(value = "find/mfctyNamelist", method = RequestMethod.GET)
	public void getMfctyNameList(HttpServletRequest request,
			HttpServletResponse response, VoModel<?, ?> vo, String key) {
		CrmSessionUser user = UserSessionInfo.user_getUserOfRequest(request);
		taskService.getMfctyNameByParams(vo, user.getUserId(), key);
		GUtils.responseJson(response, ResultDTO.successResult(vo));
	}

	@RequestMapping(value = "search/mainMfcty", method = RequestMethod.GET)
		 public void getMfctyByMain(HttpServletRequest request,
									HttpServletResponse response, VoModel<?, ?> vo, String key) {
		Integer userID = UserSessionInfo.user_getUserOfRequest(request)
				.getUserId();
		taskService.searhMfctyForMainByKeyWord(vo, key, userID);
		GUtils.responseJson(response, ResultDTO.successResult(vo));
	}

	@RequestMapping(value = "search/custServiceMfcty", method = RequestMethod.GET)
	public void getMfctyByCustService(HttpServletRequest request,
			HttpServletResponse response, VoModel<?, ?> vo, String key) {
		CrmSessionUser user = UserSessionInfo.user_getUserOfRequest(request);
		taskService.searhMfctyForCustServiceByKeyWord(vo, key, user.getUserId());
		GUtils.responseJson(response, ResultDTO.successResult(vo));
	}


	@RequestMapping(value = "update/taskState", method = RequestMethod.POST)
	public void updateUserPhone(HttpServletRequest request, HttpServletResponse response, Integer tasKID){
		ResultDTO result = null;

		String currentTime = TimeUtil.getCurrentTime();


		int updateState = taskService.updateTaskState(tasKID, currentTime);
		if(updateState==0){
			result = ResultDTO.failResult(ResultState.ERROR_CODE, "任务状态更改失败");
			GUtils.responseJson(response, result);
			return;
		}else{
			result = ResultDTO.successResult(ResultState.SUCCESS_CODE, "任务状态更改成功");
		}
		GUtils.responseJson(response, result);
	}

}
