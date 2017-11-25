package com.qipeipu.crm.service.basedata;

import java.util.List;

import com.qipeipu.crm.dtos.basedata.ProvinceDTO;

public interface ProvinceService {

	/***
	 * 查询所有省份
	 *
	 * @return　返回所有省份
	 */
	List<ProvinceDTO> findAllPro();

}
