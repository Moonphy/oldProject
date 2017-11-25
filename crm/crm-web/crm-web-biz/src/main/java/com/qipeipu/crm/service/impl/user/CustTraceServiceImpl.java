package com.qipeipu.crm.service.impl.user;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.qipeipu.crm.dao.CustTraceDao;
import com.qipeipu.crm.dtos.customer.CustTraceDTO;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.service.customer.CustTraceService;

/**
 * Created by johnkim on 15-2-9.
 */
@Service
public class CustTraceServiceImpl implements CustTraceService {

	@Autowired
	private CustTraceDao custTraceDao;

	@Override
	public boolean add(CustTraceDTO custTrace) {
		Date now = new Date();
		custTrace.setCreateTime(now);
		custTrace.setUpdateTime(now);
		int row = custTraceDao.addMemo(custTrace);
		return row > 0;
	}

	@Override
	public VoModel<?, ?> findMemo(VoModel<?, ?> vo) {
		return vo.setTotal(custTraceDao.findMemoCount(vo, true)).setModel(
				custTraceDao.findMemo(vo, false));
	}
}
