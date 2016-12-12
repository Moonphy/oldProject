package com.qipeipu.crm.service.impl.main;

import com.qipeipu.crm.dao.main.MorgDao;
import com.qipeipu.crm.dtos.main.MorgDTO;
import com.qipeipu.crm.service.main.MorgService;
import com.qipeipu.crm.utils.bean.data.MultipleDataSource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by johnkim on 15-2-6.
 */
@Slf4j
@Service
public class MorgServiceImpl implements MorgService {

	@Autowired
	private MorgDao mOrgDao;

	@Override
	public MorgDTO getMorgInfo(Integer mOrgId) {
		MultipleDataSource.setDataSourceKey("mainDataSource");
		List<MorgDTO> list = mOrgDao.getMorgInfo(mOrgId);
		log.info("getMorgInfo List:{}",list);
		return list.size() > 0 ? list.get(0) : null;
	}
}
