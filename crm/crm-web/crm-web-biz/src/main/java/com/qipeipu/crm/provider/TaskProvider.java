package com.qipeipu.crm.provider;

import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.utils.statistics.DateRange;
import lombok.extern.java.Log;

import java.util.List;
import java.util.Map;
@Log
public class TaskProvider {


	public String getTaskByParamsSql(Map<String, Object> map) {
		StringBuilder sb = new StringBuilder(
				"SELECT taskID,taskName,planTime,state FROM t_user_task WHERE ");
		Integer userId = (Integer) map.get("userId");
		VoModel<?, ?> vo = (VoModel<?, ?>) map.get("vo");
		String key = (String) map.get("key");

		sb.append("UserId=").append(userId).append(" ");
		if (key != null&&!key.trim().equals("")) {
			sb.append("AND planTime LIKE '").append(key).append("%' ");
		}else{
			sb.append(" and state=0 ");
		}
		sb.append("ORDER BY planTime desc ");
		sb.append(" LIMIT ").append(vo.getCurrent() * vo.getSize()).append(",")
		.append(vo.getSize());

		return sb.toString();
	}

	public String getTaskByParamsSqlCount(Map<String, Object> map) {
		StringBuilder sb = new StringBuilder(
				"SELECT count(*) FROM t_user_task WHERE ");
		Integer userId = (Integer) map.get("userId");
		String key = (String) map.get("key");

		sb.append("UserId=").append(userId).append(" ");
		if (key != null&&!key.trim().equals("")) {
			sb.append("AND TaskName LIKE '%").append(key).append("%' ");
		}else{
			sb.append(" and state=0 ");
		}
		return sb.toString();
	}

	public String getMfctyNameByParamsSql(Map<String, Object> map) {
		StringBuilder sb = new StringBuilder(
				"SELECT tut.taskID,tut.planTime,tut.CustId,tc.MfctyName FROM t_user_task tut LEFT JOIN t_customer tc on tut.CustId = tc.id  WHERE ");

		Integer userId = (Integer) map.get("userId");
		VoModel<?, ?> vo = (VoModel<?, ?>) map.get("vo");
		String key = (String) map.get("key");

		sb.append("tut.UserId=").append(userId).append(" ");
		if (key != null&&!key.trim().equals("")) {
			sb.append("AND tc.MfctyName LIKE '%").append(key).append("%' ");
		}
		sb.append("ORDER BY tut.planTime desc ");
		sb.append(" LIMIT ").append(vo.getCurrent() * vo.getSize()).append(",")
				.append(vo.getSize());
		return sb.toString();
	}

	public String getMfctyNameByParamsSqlCount(Map<String, Object> map) {
		StringBuilder sb = new StringBuilder(
				"SELECT count(*) FROM t_user_task tut LEFT JOIN t_customer tc on tut.CustId = tc.id WHERE ");

		Integer userId = (Integer) map.get("userId");
		String key = (String) map.get("key");
		sb.append("tut.UserId=").append(userId).append(" ");
		if (key != null&&!key.trim().equals("")) {
			sb.append(" AND tc.MfctyName LIKE '%").append(key).append("%' ");
		}
		return sb.toString();
	}





	public String getSeachMfctyForCustService(Map<String, Object> map){
		String key = (String) map.get("key");
		Integer cityID = (Integer) map.get("cityID");
		StringBuilder sb = new StringBuilder();
		sb.append("select * from custService.t_customer where").append(" cityID=").append(cityID);
		if(key!=null&&!key.trim().equals("")){
			sb.append( " and mfctyName like '%").append(key).append("%' ");
		}
		VoModel<?, ?> vo = (VoModel<?, ?>) map.get("vo");
		sb.append(" LIMIT ").append(vo.getCurrent() * vo.getSize()).append(",")
				.append(vo.getSize());
		log.info(sb.toString());
		return sb.toString();
	}


	public String getSeachMfctyForCustServiceCount(Map<String, Object> map) {
		String key = (String) map.get("key");
		Integer cityID = (Integer) map.get("cityID");
		StringBuilder sb = new StringBuilder();
		sb.append("select count(*) from custService.t_customer where").append(" cityID=").append(cityID);
		if(key!=null&&!key.trim().equals("")){
			sb.append( " and mfctyName like '%").append(key).append("%' ");
		}
		return sb.toString();
	}


	public String getSeachMfctyForMain(Map<String, Object> map){
		String key = (String) map.get("key");
		Integer cityID = (Integer) map.get("cityID");
		StringBuilder sb = new StringBuilder();
		sb.append("select orgID,orgName,contactPerson,contactMobile,address,createTime from main.qpu_org where ").append(" cityID=").append(cityID);
		if(key!=null&&!key.trim().equals("")){
			sb.append( " and orgName like '%").append(key).append("%' ");
		}
		VoModel<?, ?> vo = (VoModel<?, ?>) map.get("vo");
		sb.append(" LIMIT ").append(vo.getCurrent() * vo.getSize()).append(",")
				.append(vo.getSize());
		log.info(sb.toString());
		return sb.toString();
	}


	public String getSeachMfctyByKeyWordForMainCount(Map<String, Object> map) {
		String key = (String) map.get("key");
		Integer cityID = (Integer) map.get("cityID");
		StringBuilder sb = new StringBuilder();
		sb.append("select count(*) from main.qpu_org where ").append("  cityID=").append(cityID);
		if(key!=null&&!key.trim().equals("")){
			sb.append( " and orgName like '%").append(key).append("%' ");
		}
		log.info(sb.toString());
		return sb.toString();
	}


	public String statisticsUserByTaskNumByUserAndTime(Map<String, Object> map){
		DateRange dateRange = (DateRange) map.get("dateRange");
		List<Integer> userIDs = (List<Integer>) map.get("userIDs");
		StringBuilder ids = new StringBuilder();
		for(int i=0;i<userIDs.size();i++){
			if(i==userIDs.size()-1) {
				ids.append(userIDs.get(i));
			}else{
				ids.append(userIDs.get(i)).append(",");
			}
		}
		if(userIDs.size()==0){
			ids.append("0");
		}
		String endDate = null;
		String startDate = null;
		if(dateRange!=null) {
			endDate = dateRange.getEndDate();
			startDate = dateRange.getStartDate();
		}
		StringBuilder sb = new StringBuilder();
		sb.append(" select  count(1)  from t_user_task where 1=1 and userID in (").append(ids).append(") ");
		if(endDate!=null&&startDate!=null){
			sb.append(" and createTime>='").append(startDate).append("'").append(" and createTime<='").append(endDate).append("'");
		}

		sb.toString();
		return sb.toString();
	}

}
