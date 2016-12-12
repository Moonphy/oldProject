package com.qipeipu.crm.service.user;

import com.qipeipu.crm.dtos.user.UserAreaDTO;

/**
 * @author Gxy
 */
public interface UserAreaService {
	/**
	 * 添加地区
	 *
	 * @param areaId
	 * @param userId
	 * @return
	 */
	Integer addOrUpdate(Integer areaId, Integer userId);

	/**
	 * 查询用户所属省份，市，区
	 * 
	 * @param userId
	 * @return
	 */
	UserAreaDTO findUserFullAddr(Integer userId);
}
