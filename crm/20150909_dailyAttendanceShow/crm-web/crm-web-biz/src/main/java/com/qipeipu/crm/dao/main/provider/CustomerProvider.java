package com.qipeipu.crm.dao.main.provider;

import com.qipeipu.crm.dtos.customer.CustTraceDTO;
import com.qipeipu.crm.dtos.customer.CustomerDTO;
import com.qipeipu.crm.dtos.customer.params.CustomerParamsDTO;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.params.ParamsDTO;
import com.qipeipu.crm.utils.bean.tools.GUtils;

import java.util.Map;

public class CustomerProvider extends SqlProvider {

	StringBuffer sql_find_customer = new StringBuffer(
			"SELECT * from t_customer cust left join btl_user user on cust.UserId=user.UserId where 1=1");
	StringBuffer sql_find_customer_count = new StringBuffer(
			"SELECT count(*) from t_customer cust where 1=1");
	StringBuffer sql_find_customer_telStatistics = new StringBuffer(
			"SELECT cust.MfctyId,cust.MfctyName,cust.UserId,cust.RecordTime,cust.UserId,user.UserName as userName  from t_customer cust left join btl_user user on cust.UserId=user.UserId where 1=1");

	public String getFindCustomerSql(Map<String, Object> parameters) {
		VoModel<?, ?> vo = (VoModel<?, ?>) parameters.get("vo");
		ParamsDTO<?, ?> params = vo.getParams();
		CustomerDTO cust = (CustomerDTO) params.getBase();
		CustomerParamsDTO special = (CustomerParamsDTO) params.getSpecial();
		boolean isCountSql = (Boolean) parameters.get("isCountSql");
		boolean isStatistics = (Boolean) parameters.get("isStatistics");//统计信息标志：当计数或获得列表是传递false，是统计信息时为true
		StringBuffer sql = sql_find_customer;
		if (isCountSql) {
			sql = sql_find_customer_count;
		}
		if (cust.getId() != null) {
			sql.append(" and cust.id = '" + cust.getId() + "'");
		}
		if (!GUtils.isEmptyOrNull(cust.getMfctyName())) {
			sql.append(" and cust.mfctyName like '%" + cust.getMfctyName()
					+ "%'");
		}
		if (cust.getMfctyId() != null) {
			sql.append(" and cust.mfctyId = '" + cust.getMfctyId() + "'");
		}
		if (!GUtils.isEmptyOrNull(cust.getAddress())) {
			sql.append(" and cust.address like '%" + cust.getAddress() + "%'");
		}
		if (!GUtils.isEmptyOrNull(special.getBeginTime())) {
			sql.append(" and cust.recordTime >= '" + special.getBeginTime()
					+ "'");
		}
		if (!GUtils.isEmptyOrNull(special.getEndTime())) {
			sql.append(" and cust.recordTime <= '" + special.getEndTime() + "'");
		}
		if (special.getIsAdmin() == null || !special.getIsAdmin()) {//非管理员级别账户查询
			sql.append(" and cust.UserId = " + cust.getUserId());
		}
		if (!isCountSql && !isStatistics) {
			sql.append(" limit " + vo.getCurrent() * vo.getSize() + ","
					+ vo.getSize());
		}
		return sql.toString();
	}

	StringBuffer sql_edit_customer = new StringBuffer("UPDATE t_customer");

	public String getEditCustomerSql(Map<String, Object> parameters) {
		VoModel<?, ?> vo = (VoModel<?, ?>) parameters.get("vo");
		ParamsDTO<?, ?> params = vo.getParams();
		CustomerDTO base = (CustomerDTO) params.getBase();
		CustomerParamsDTO special = (CustomerParamsDTO) params.getSpecial();
		sql_edit_customer
		.append(" set mfctyName='" + base.getMfctyName() + "'")
				.append(",CactTel=" + base.getCactTel())
				.append(",CactMan='" + base.getCactMan() + "'")
				.append(",Mp='" + base.getMp() + "'")
				.append(",Email='" + base.getEmail() + "'")
				.append(",Address='" + base.getAddress() + "'")
				.append(",memo='" + base.getMemo() + "'")
				.append(",MfctyType=" + base.getMfctyType())
				.append(",OnlineBuy='" + base.getOnlineBuy() + "'")
				.append(",UpdateTime='"
				+ GUtils.dateFormat(base.getUpdateTime()) + "'");
		if (base.getStar() != null) {
			sql_edit_customer.append(",star='" + base.getStar() + "'");
		}
		sql_edit_customer.append(" where id=" + base.getId());
		if (special.getIsAdmin() == null || !special.getIsAdmin()) {//非管理员级别账户查询
			sql_edit_customer.append(" and UserId=" + base.getUserId());
		}
		return sql_edit_customer.toString();
	}

	StringBuffer sql_find_custtrace = new StringBuffer(
			"SELECT * from t_cust_trace where 1=1");
	StringBuffer sql_find_custtrace_count = new StringBuffer(
			"SELECT count(*) from t_cust_trace where 1=1");

	public String getFindCustTraceSql(Map<String, Object> parameters) {
		VoModel<?, ?> vo = (VoModel<?, ?>) parameters.get("vo");
		boolean isCountSql = (Boolean) parameters.get("isCountSql");
		StringBuffer sql = sql_find_custtrace;
		if (isCountSql) {
			sql = sql_find_custtrace_count;
		}

		ParamsDTO<?, ?> params = vo.getParams();
		CustTraceDTO base = (CustTraceDTO) params.getBase();
		CustomerParamsDTO special = (CustomerParamsDTO) params.getSpecial();
		if (base.getCustId() != null) {
			sql.append(" and CustId=" + base.getCustId() + "");
		}
		if (base.getTraceId() != null) {
			sql.append(" and traceId=" + base.getTraceId() + "");
		}
		if (!GUtils.isEmptyOrNull(special.getBeginTime())) {
			sql.append(" and createTime>='" + special.getBeginTime() + "'");
		}
		if (!GUtils.isEmptyOrNull(special.getEndTime())) {
			sql.append(" and createTime<='" + special.getEndTime() + "'");
		}
		if (special.getIsAdmin() == null || !special.getIsAdmin()) {//非管理员级别账户查询
			sql.append(" and UserId=" + base.getUserId());
		}
		sql.append(" order by createTime desc");//按时间
		if (!isCountSql) {
			sql.append(" limit " + vo.getCurrent() * vo.getSize() + ","
					+ vo.getSize());
		}
		return sql.toString();
	}

	public String getfindCustomerForTelStatistics(Map<String, Object> parameters) {
		VoModel<?, ?> vo = (VoModel<?, ?>) parameters.get("vo");
		ParamsDTO<?, ?> params = vo.getParams();
		CustomerDTO cust = (CustomerDTO) params.getBase();
		CustomerParamsDTO special = (CustomerParamsDTO) params.getSpecial();
		StringBuffer sql = sql_find_customer_telStatistics;
		if (!GUtils.isEmptyOrNull(cust.getMfctyName())) {
			sql.append(" and cust.mfctyName like '%" + cust.getMfctyName()
					+ "%'");
		}
		if (cust.getMfctyId() != null) {
			sql.append(" and cust.mfctyId = '" + cust.getMfctyId() + "'");
		}
		if (!GUtils.isEmptyOrNull(special.getBeginTime())) {
			sql.append(" and cust.recordTime >= '" + special.getBeginTime()
					+ "'");
		}
		if (!GUtils.isEmptyOrNull(special.getEndTime())) {
			sql.append(" and cust.recordTime <= '" + special.getEndTime() + "'");
		}
		//a.管理员且查询非全部;b.非管理员查询当前用户的
		if (special.getIsAdmin() == null
				|| (special.getIsAdmin() && cust.getUserId() != 0 || (!special
						.getIsAdmin()))) {
			sql.append(" and cust.UserId = " + cust.getUserId());
		}
		sql.append(" ORDER BY id ");
		return sql.toString();
	}





}
