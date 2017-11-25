package com.qipeipu.crm.dao.main.order;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectProvider;

import com.qipeipu.crm.dao.main.provider.OrderMainInCSProvider;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.main.order.dto.OrderInCSDTO;
import com.qipeipu.crm.dtos.statistics.StatisticsPersonDTO;

public interface OrderMainDao {
	/**
	 * 根据用户Id获取2.0版的支付信息
	 *
	 * @param mfactyId
	 * @param paystatus
	 * @return
	 */
	@Select("select OrderMainID,OrderMainNo,PayTime,Money, (CASE orderStatus "
			+ " WHEN 1 THEN '已提交或发布' "
			+ " WHEN 2 THEN '已审核' "
			+ " WHEN 3 THEN '审核失败' "
			+ " WHEN 4 THEN '配货中' "
			+ " WHEN 5 THEN '取消订单' "
			+ " WHEN 6 THEN '交易成功' "
			+ " WHEN 7 THEN '交易失败（拒收等）' "
			+ " WHEN 10 THEN '其他' "
			+ " END) as orderStatus "
			+ " from pt_ordermain where  DemanderID =#{mfactyId} and PayStatus=#{paystatus} ")
	List<OrderInCSDTO> getOrderByMfactyId(@Param("mfactyId") Integer mfactyId,
			@Param("paystatus") Integer paystatus);

	/**
	 * 根据用户所有订单信息
	 *
	 * @param mfactyId
	 * @param paystatus
	 * @return
	 */
	@Select({ "<script> select OrderMainID,OrderMainNo,PayTime,Money,DemanderID,PublishTime from pt_ordermain where PayStatus=#{paystatus} and   DemanderID in "
			+ "<foreach item='item' index='index' collection='mfactyIds' "
			+ "open='(' separator=',' close=')'> "
			+ "#{item} "
			+ "</foreach>  ORDER BY OrderMainID " + "</script>" })
	List<OrderInCSDTO> getAllOrderByMfactyIds(
			@Param("mfactyIds") List<Integer> mfactyIdList,
			@Param("paystatus") int payYes);

	/**
	 * 根据用户所有订单信息:电话统计
	 *
	 * @param mfactyId
	 * @param paystatus
	 * @return
	 */
	@Select({ "<script> select om.OrderMainID as OrderMainID,om.OrderMainNo as OrderMainNo,om.PayTime as PayTime "
			+ ",om.Money as Money,om.DemanderID as DemanderID,om.PublishTime as PublishTime,om.Demander as Demander "
			+ ",om.PayModeName as PayModeName,om.makeUserId as makeUserId,om.payUserId as payUserId ,sm.RecvTime as RecvTime "
			+ " from pt_ordermain om LEFT JOIN pt_supplymain sm on om.OrderMainID= sm.OrderMainID  where  om.OrderMainID in "
			+ "<foreach item='item' index='index' collection='orderIds' "
			+ "open='(' separator=',' close=')'> "
			+ "#{item} "
			+ "</foreach> "
			+ "</script>" })
	List<StatisticsPersonDTO> getAllOrderByOrderIds(
			@Param("orderIds") List<Integer> orderList);

	/**
	 * 根据用户所有订单信息
	 *
	 * @param mfactyId
	 * @param paystatus
	 * @return
	 */
	@Select({ "<script> select OrderMainID,OrderMainNo,PayTime,Money,DemanderID,PayStatus from pt_ordermain where   DemanderID in "
			+ "<foreach item='item' index='index' collection='mfactyIds' "
			+ "open='(' separator=',' close=')'> "
			+ "#{item} "
			+ "</foreach>  ORDER BY OrderMainID " + "</script>" })
	List<OrderInCSDTO> getOrdersByMfactyIds(
			@Param("mfactyIds") List<Integer> mfactyIdList);

	/**
	 * 根据用户所有订单信息
	 *
	 * @param mfactyId
	 * @param paystatus
	 * @return
	 */
	@SelectProvider(type = OrderMainInCSProvider.class, method = "getAllOrderInfoByMfactyIds")
	List<OrderInCSDTO> getAllOrderInfoByMfactyIds(
			@Param("mfactyIds") List<Integer> mfactyIdList,
			@Param("vo") VoModel<?, ?> vo);

}
