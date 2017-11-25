package com.qipeipu.crm.service.basedata;

import java.util.List;

import com.qipeipu.crm.dtos.basedata.AreaDTO;

public interface AreaService {

	/***
	 * 查询某个城市下所有地区
	 *
	 * @return　返回所有城市
	 */
	List<AreaDTO> findAreaByCityId(Integer cityId);

}
