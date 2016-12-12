package com.qipeipu.crm.service.impl.basedata;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.qipeipu.crm.dao.CityDao;
import com.qipeipu.crm.dtos.basedata.CityDTO;
import com.qipeipu.crm.service.basedata.CityService;

/**
 * Created by johnkim on 15-2-11.
 */
@Service
public class CityServiceImpl implements CityService {

	@Autowired
	private CityDao cityDao;

	@Override
	public List<CityDTO> findAllCity() {
		return cityDao.findAllCity();
	}

	@Override
	public List<CityDTO> findCityByProId(Integer proId) {
		return cityDao.findCityByProId(proId);
	}
}
