package com.qipeipu.crm.dao.main;

import com.qipeipu.crm.dtos.customer.CustomerDTO;
import com.qipeipu.crm.dtos.main.MorgDTO;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * Created by johnkim on 15-2-6.
 */
public interface MorgDao {

	@Select({ "<script>select u.userId,u.parentID,u.orgId,u.loginName,u.loginMobile,u.loginEmail,u.nickName,u.imageUrl,u.status,u.createTime,org.* from qpu_user u LEFT JOIN qpu_org org on u.orgID = org.orgID where u.parentID is NULL and u.orgID = #{mOrgId}</script>" })
	List<MorgDTO> getMorgInfo(@Param("mOrgId") Integer mOrgId);

	/**
	 * 获取所有汽修厂
	 *
	 */
	@Select({ "select "
			+ "orgID MfctyId,orgName MfctyName,contactPerson CactMan,contactMobile CactTel,Address,"
			+ "CreateTime,email,cityID,orgType mfctyType,provinceID "
			+ "from qpu_org where status=2" })
	List<CustomerDTO> getAllUser();
}
