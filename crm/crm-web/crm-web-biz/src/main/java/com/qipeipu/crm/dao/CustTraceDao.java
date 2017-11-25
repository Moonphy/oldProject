package com.qipeipu.crm.dao;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.SelectProvider;

import com.qipeipu.crm.dao.main.provider.CustomerProvider;
import com.qipeipu.crm.dtos.customer.CustTraceDTO;
import com.qipeipu.crm.dtos.global.VoModel;

/**
 * Created by johnkim on 15-2-5.
 */
public interface CustTraceDao {

	@Insert("INSERT INTO t_cust_trace (CustId, Memo, CreateTime, UpdateTime,UserId) "
			+ "VALUES (#{custTrace.custId},#{custTrace.memo},#{custTrace.createTime},#{custTrace.updateTime},#{custTrace.userId})")
	@Options(useGeneratedKeys = true, keyProperty = "custTrace.traceId")
	int addMemo(@Param("custTrace") CustTraceDTO custTrace);

	@SelectProvider(type = CustomerProvider.class, method = "getFindCustTraceSql")
	List<CustTraceDTO> findMemo(@Param("vo") VoModel<?, ?> vo,
			@Param("isCountSql") Boolean isCountSql);

	@SelectProvider(type = CustomerProvider.class, method = "getFindCustTraceSql")
	int findMemoCount(@Param("vo") VoModel<?, ?> vo,
			@Param("isCountSql") Boolean isCountSql);

}