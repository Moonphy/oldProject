package com.qipeipu.crm.service.basedata;

import java.util.List;

import com.qipeipu.crm.dtos.basedata.RegionDTO;

public interface RegionService {

	/***
	 * 查询所有大区
	 *
	 * @return　返回所有大区
	 */
	List<RegionDTO> findAllRegin();

}
