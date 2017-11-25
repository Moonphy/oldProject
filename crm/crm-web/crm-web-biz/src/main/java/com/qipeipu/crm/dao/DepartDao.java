package com.qipeipu.crm.dao;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.qipeipu.crm.dtos.user.DepartDTO;

public interface DepartDao {

	/**
	 * 查询部门的信息
	 *
	 * @param deptId
	 * @return
	 */
	@Select({ "SELECT deptId,deptName FROM t_depart  WHERE DeptId=#{departId}" })
	DepartDTO getDepartName(@Param("departId") Integer departId);
}
