package com.qipeipu.crm.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.qipeipu.crm.dtos.auth.AuthDTO;

public interface AuthHoldDao {

//	@Select("select dutyid,sourceid from t_auth_hold")
//	public List<AuthDTO> getAll();

//	@Select("<script>select sourceid from t_auth_hold where dutyid in "
//			+ "<foreach item='item' index='index' collection='dutyids' "
//			+ "open='(' separator=',' close=')'> " + "#{item} "
//			+ "</foreach></script>")
//	public List<Integer> getByIds(@Param("dutyids") List<Integer> dutyids);

}
