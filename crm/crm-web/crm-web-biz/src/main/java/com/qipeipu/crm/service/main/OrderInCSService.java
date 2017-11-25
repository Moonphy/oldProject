package com.qipeipu.crm.service.main;

import com.qipeipu.crm.dtos.global.VoModel;

/**
 * 订单相关的service接口
 *
 * @author Administrator
 *
 */
public interface OrderInCSService {
	/**
	 * 业绩统计-电话统计中根据查询条件获得具体订单信息
	 *
	 * @param vo传递的参数
	 * @return
	 */
	VoModel<?, ?> findTelTradeInfo(VoModel<?, ?> vo);

	/**
	 * 业绩统计-汇总统计根据查询条件获得具体每个汽修厂交易信息
	 *
	 * @param vo
	 * @return
	 */
	VoModel<?, ?> findSummaryTradeInfo(VoModel<?, ?> vo);

}
