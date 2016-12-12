package com.qipeipu.crm.service.impl.user;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.qipeipu.crm.dao.CustOffLineBuyDao;
import com.qipeipu.crm.dtos.customer.CustOfflineBuyDTO;
import com.qipeipu.crm.service.customer.CustOffLineBuyService;

/**
 * Created by johnkim on 15-2-11.
 */
@Service
public class CustOffLineBuyServiceImpl implements CustOffLineBuyService {

	private static final Logger logger = Logger
			.getLogger(CustOffLineBuyService.class);

	@Autowired
	private CustOffLineBuyDao custOffLineDao;

	@Override
	public boolean update(CustOfflineBuyDTO[] dtos, Integer custId) {
		int row = custOffLineDao.del(custId);
		logger.info("{删除采购构成row：}" + row);
		if (row >= 0) {
			row = 0;
			int len = dtos.length;
			for (int i = 0; i < len; i++) {
				row += custOffLineDao.insert(dtos[i]);
				logger.info("{更新采购构成row：}" + row);
			}
			return row == len;
		}
		return false;
	}

	@Override
	public List<CustOfflineBuyDTO> findByCustId(Integer custId) {
		return custOffLineDao.findByCustId(custId);
	}
}
