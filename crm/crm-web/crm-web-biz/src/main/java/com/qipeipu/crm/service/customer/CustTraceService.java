package com.qipeipu.crm.service.customer;

import com.qipeipu.crm.dtos.customer.CustTraceDTO;
import com.qipeipu.crm.dtos.global.VoModel;

/**
 * Created by johnkim on 15-2-9.
 */
public interface CustTraceService {
	/***
	 * 新增备注
	 *
	 * @param custTrace
	 *            备注信息
	 * @return 是否新增成功
	 */
	boolean add(CustTraceDTO custTrace);

	/***
	 * 根据条件查找memo
	 *
	 * @param vo
	 *            条件
	 * @return　符合条件的memo
	 */
	VoModel<?, ?> findMemo(VoModel<?, ?> vo);
}
