package com.qipeipu.crm.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.qipeipu.crm.dtos.auth.AuthDTO;

public interface AuthSourceDao {

	@Select("<script>select sourceid,uri from t_auth_source where sourcid in "
			+ "<foreach item='item' index='index' collection='sourceids' "
			+ "open='(' separator=',' close=')'> " + "#{item} "
			+ "</foreach></script>")
	public List<AuthDTO> getBySrcIds(@Param("sourceids") Object[] sourceids);

//	@Select("<script>select uri from t_auth_source where sourcid in "
//			+ "<foreach item='item' index='index' collection='sourceids' "
//			+ "open='(' separator=',' close=')'> " + "#{item} "
//			+ "</foreach></script>")
//	public List<String> getUriBySrcIds(
//			@Param("sourceids") List<Integer> sourceids);

}
