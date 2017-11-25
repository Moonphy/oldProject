package com.qipeipu.crm.dao.main.provider;

import com.qipeipu.crm.dtos.user.UserDTO;
import com.qipeipu.crm.utils.bean.tools.GUtils;

import java.util.Map;

public class UserProvider extends SqlProvider {

	StringBuffer sql_find_user = new StringBuffer(
			"SELECT userId,userName,loginName,isAdmin from btl_user where 1=1");

	public String getFindUserSql(Map<String, Object> parameters) {
		Object o = parameters.get("user");
		if(o!=null){
			UserDTO user = (UserDTO) o;
			if(user.getUserId()!=null){
				sql_find_user.append(" and userId = '"+user.getUserId()+"'");
			}
			if(!GUtils.isEmptyOrNull(user.getUserName())){
				sql_find_user.append(" and userName = '"+user.getUserName()+"'");
			}
			if(!GUtils.isEmptyOrNull(user.getLoginName())){
				sql_find_user.append(" and loginName = '"+user.getLoginName()+"'");
			}
			if(user.getIsAdmin()!=null){
				sql_find_user.append(" and isAdmin = '"+user.getIsAdmin()+"'");
			}
		}
		return sql_find_user.toString();
	}

	public String getAllUser(Map<String, Object> map){
		String key = (String) map.get("nameSearch");
		StringBuilder sb = new StringBuilder();
		sb.append("select userID,userName,Mp from btl_user where userName like '%").append(key).append("%'");
		//System.out.print(sb.toString());
		return  sb.toString();

	}

}
