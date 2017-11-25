package com.qipeipu.crm.service.impl.basedata;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.qipeipu.crm.dao.ProvinceDao;
import com.qipeipu.crm.dtos.basedata.ProvinceDTO;
import com.qipeipu.crm.service.basedata.ProvinceService;

@Service
public class ProvinceServiceImpl implements ProvinceService {

	@Autowired
	private ProvinceDao dao;

	@Override
	public List<ProvinceDTO> findAllPro() {
		return dao.findAllPro();
	}

}
