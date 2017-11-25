package com.qipeipu.crm.dao;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectProvider;
import org.apache.ibatis.annotations.Update;
import org.apache.ibatis.annotations.UpdateProvider;

import com.qipeipu.crm.dao.main.provider.CustomerProvider;
import com.qipeipu.crm.dtos.customer.CustomerDTO;
import com.qipeipu.crm.dtos.global.VoModel;

/**
 * Created by johnkim on 15-2-5.
 */
public interface CustomerDao {

	@Insert("INSERT INTO t_customer (mfctyId, mfctyName, cityID, CactTel,CactMan,Mp,Email,Address,CreateTime,UpdateTime,RecordTime,Memo,WeCharNo,MfctyType,OnlineBuy,UserId) "
			+ "VALUES (#{customer.mfctyId},#{customer.mfctyName},#{customer.cityId},#{customer.cactTel},"
			+ "#{customer.cactMan},#{customer.mp},#{customer.email},#{customer.address},#{customer.createTime},"
			+ "#{customer.updateTime},#{customer.recordTime},#{customer.memo},#{customer.weCharNo},#{customer.mfctyType},#{customer.onlineBuy},#{customer.userId})")
	@Options(useGeneratedKeys = true, keyProperty = "customer.id")
	int createCustomer(@Param("customer") CustomerDTO customer);

	@SelectProvider(type = CustomerProvider.class, method = "getFindCustomerSql")
	List<CustomerDTO> findCustomer(@Param("vo") VoModel<?, ?> vo,
			@Param("isCountSql") Boolean isCountSql,
			@Param("isStatistics") Boolean isStatistics);

	@SelectProvider(type = CustomerProvider.class, method = "getFindCustomerSql")
	Integer findCustomerCount(@Param("vo") VoModel<?, ?> vo,
			@Param("isCountSql") Boolean isCountSql,
			@Param("isStatistics") Boolean isStatistics);

	@UpdateProvider(type = CustomerProvider.class, method = "getEditCustomerSql")
	@Options(flushCache = true)
	int editCustomer(@Param("vo") VoModel<?, ?> vo);

	@SelectProvider(type = CustomerProvider.class, method = "getfindCustomerForTelStatistics")
	List<CustomerDTO> findCustomerForTelStatistics(@Param("vo") VoModel<?, ?> vo);

	@Select({ " SELECT MfctyId FROM t_customer WHERE MfctyId > 0" })
	List<Integer> findAllMfctyId();

	/*需设置jdbc:mysql:/xxxxxxxxxxx&allowMultiQueries=true，因防止sql注入默认为false
	 * @Update({
		"<script><foreach collection='updateUser' item='item' index='index' separator=';'>",
		"UPDATE t_customer<set> "
					+ "MfctyName=#{item.mfctyName},CactMan=#{item.cactMan},CactTel=#{item.cactTel},"
					+ "Address=#{item.address},email=#{item.email},cityID=#{item.cityId},"
					+ "mfctyType=#{item.mfctyType},provinceID=#{item.provinceID},UpdateTime=NOW()"
					+ "</set>" + "WHERE MfctyId=#{item.mfctyId}",
			"</foreach></script>" })
	Integer updateSync(@Param("updateUser") List<CustomerDTO> updateUser);*/

	@Update({ "UPDATE t_customer SET "
			+ "MfctyName=#{item.mfctyName},CactMan=#{item.cactMan},CactTel=#{item.cactTel},"
			+ "Address=#{item.address},email=#{item.email},cityID=#{item.cityId},"
			+ "mfctyType=#{item.mfctyType},provinceID=#{item.provinceID},UpdateTime=NOW()"
			+ "WHERE MfctyId=#{item.mfctyId}" })
	Integer updateSync(@Param("item") CustomerDTO updateUser);

	@Insert({
			"<script>",
			"INSERT INTO t_customer "
				+ "(MfctyId,MfctyName,CactMan,CactTel,Address,email,cityID,mfctyType,provinceID,CreateTime,UserId) "
				+ "VALUES"
				+ "<foreach item='item' index='index' collection='insertUser' separator=','>"
				+ "(#{item.mfctyId},#{item.mfctyName},#{item.cactMan},#{item.cactTel},#{item.address},"
				+ "#{item.email},#{item.cityId},#{item.mfctyType},#{item.provinceID},NOW(),64)",
			"</foreach></script>" })
	Integer addSync(@Param("insertUser") List<CustomerDTO> insertUser);
}