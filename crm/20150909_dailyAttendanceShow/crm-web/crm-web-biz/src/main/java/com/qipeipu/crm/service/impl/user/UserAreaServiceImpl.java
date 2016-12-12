package com.qipeipu.crm.service.impl.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.qipeipu.crm.dao.AreaDao;
import com.qipeipu.crm.dao.CityDao;
import com.qipeipu.crm.dao.ProvinceDao;
import com.qipeipu.crm.dao.UserAreaDao;
import com.qipeipu.crm.dtos.basedata.AreaDTO;
import com.qipeipu.crm.dtos.basedata.CityDTO;
import com.qipeipu.crm.dtos.basedata.ProvinceDTO;
import com.qipeipu.crm.dtos.user.UserAreaDTO;
import com.qipeipu.crm.dtos.user.UserAreaEntity;
import com.qipeipu.crm.service.user.UserAreaService;

@Service
public class UserAreaServiceImpl implements UserAreaService {
	@Autowired
	private UserAreaDao userAreaDao;
	@Autowired
	private AreaDao areaDao;
	@Autowired
	private CityDao cityDao;
	@Autowired
	private ProvinceDao proDao;

	@Override
	public Integer addOrUpdate(Integer areaId, Integer userId) {
		Integer result = userAreaDao.updateArea(areaId, userId);
		if (result != null && result > 0) {
			return result;
		} else {
			result = userAreaDao.addArea(areaId, userId);
		}
		return result;
	}

	@Override
	public UserAreaDTO findUserFullAddr(Integer userId) {
		UserAreaEntity userArea = userAreaDao.findByUserId(userId);
		if (userArea == null) {
			return null;
		}

		AreaDTO area = areaDao.findAreaById(userArea.getAreaId());
		CityDTO city = cityDao.findCityById(area.getCityId());
		ProvinceDTO pro = proDao.findProvinceById(city.getProvinceId());

		UserAreaDTO fullAddr = new UserAreaDTO();
		fullAddr.setAreaId(area.getAreaId());
		fullAddr.setAreaName(area.getAreaName());
		fullAddr.setCityId(city.getCityId());
		fullAddr.setCityName(city.getCityName());
		fullAddr.setProId(pro.getProId());
		;
		fullAddr.setProName(pro.getProName());

		return fullAddr;
	}
}
