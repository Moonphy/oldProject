package com.qipeipu.crm.service.basedata;

import java.util.List;

import com.qipeipu.crm.dtos.basedata.CityDTO;

/**
 * Created by johnkim on 15-2-11.
 */
public interface CityService {

	/***
	 * 查询所有城市
	 *
	 * @return　返回所有城市
	 */
	List<CityDTO> findAllCity();

	/***
	 * 查询某个省份下所有城市
	 *
	 * @return
	 */
	List<CityDTO> findCityByProId(Integer proId);

}
