package com.qipeipu.crm.dao.main.user;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.qipeipu.crm.dtos.main.user.UserMainDTO;

public interface UserMainDao {
	/**
	 * 获取当前汽修厂下的所有用户
	 *
	 * @param mfactyId
	 * @return
	 */
	@Select("select userID from qpu_user where orgID=#{mfactyId};")
	List<Long> getCustomerByMfactyId(@Param("mfactyId") Integer mfactyId);

	/**
	 * 获取汽修厂下的所有用户
	 *
	 * @param mfactyId
	 * @return
	 */
	@Select({ "<script> ", "select userID,orgID from qpu_user where orgID in ",
		"<foreach item='item' index='index' collection='mfactyIds'",
		"open='(' separator=',' close=')'>", "#{item}", "</foreach>",
	"</script>" })
	List<UserMainDTO> getAllCustomerByMfactyIds(
			@Param("mfactyIds") List<Integer> mfactyIdList);

}
