package com.qipeipu.crm.dao.main.provider;

import java.util.List;
import java.util.Map;

import com.qipeipu.crm.dtos.customer.params.CustomerParamsDTO;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.params.ParamsDTO;
import com.qipeipu.crm.utils.bean.tools.GUtils;

public class OrderMainInCSProvider extends SqlProvider {

	StringBuffer sql_find_orderInfo = new StringBuffer(
			"select OrderMainID,OrderMainNo,PayTime,Money,DemanderID,PublishTime from pt_ordermain where  PayStatus=1 ");

	@SuppressWarnings("unchecked")
	public String getAllOrderInfoByMfactyIds(Map<String, Object> parameters) {
		VoModel<?, ?> vo = (VoModel<?, ?>) parameters.get("vo");
		ParamsDTO<?, ?> params = vo.getParams();
		CustomerParamsDTO special = (CustomerParamsDTO) params.getSpecial();
		List<Integer> mfactyIdList = (List<Integer>) parameters
				.get("mfactyIds");
		StringBuffer sql = sql_find_orderInfo;
		if (!GUtils.isEmptyOrNull(special.getOrderNo())) {
			sql.append(" and OrderMainNo='");
			sql.append(special.getOrderNo() + "' ");
		}
		if (!GUtils.isEmptyOrNull(special.getBuyBeginTime())) {
			sql.append(" and PublishTime >= '" + special.getBuyBeginTime()
					+ "' ");
		}
		if (!GUtils.isEmptyOrNull(special.getBuyEndTime())) {
			sql.append(" and PublishTime <= '" + special.getBuyEndTime() + "' ");
		}
		if (mfactyIdList != null && mfactyIdList.size() > 0) {
			sql.append(" and DemanderID in ( ");
			for (int i = 0; i < mfactyIdList.size(); i++) {
				sql.append(mfactyIdList.get(i));
				if (i != mfactyIdList.size() - 1) {
					sql.append(",");
				}
			}
			sql.append(" ) ");
		}
		sql.append(" ORDER BY OrderMainID ");
		return sql.toString();
	}
}
