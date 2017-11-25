package com.qipeipu.crm.service.impl.basedata;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.qipeipu.crm.dao.AreaDao;
import com.qipeipu.crm.dtos.basedata.AreaDTO;
import com.qipeipu.crm.service.basedata.AreaService;

@Service
public class AreaServiceImpl implements AreaService {

	@Autowired
	private AreaDao dao;

	@Override
	public List<AreaDTO> findAreaByCityId(Integer cityId) {
		return dao.findAreaByCityId(cityId);
	}

}
