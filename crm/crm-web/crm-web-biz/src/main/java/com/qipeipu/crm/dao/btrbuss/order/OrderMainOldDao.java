package com.qipeipu.crm.dao.btrbuss.order;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import com.qipeipu.crm.dtos.btrbuss.order.dao.OrderMainOldDTO;
import com.qipeipu.crm.dtos.main.order.dto.OrderInCSDTO;

public interface OrderMainOldDao {
	/**
	 * 获取1.0库中订单支付情况
	 * @param MfactyId
	 * @return
	 */
	@Select("select  COUNT(*) as allOrderNum,SUM(Money) as allOrderMoney from pt_ordermain where DemanderId=#{mfactyId} and paystatus=1")
	OrderMainOldDTO getOrderInfoByMfactyId(@Param("mfactyId") Integer MfactyId);
	
	/**
	 * 获取1.0库中支付数据
	 * @param custId
	 * @return
	 */
	@Select("select orderMainID as orderMainId,orderMainNo as orderMainNo ,PayTime as payTime,money,(CASE OrderStatus "+
       " WHEN 1 THEN '已提交或发布' "+
       " WHEN 2 THEN '（供方）确认供货' "+
       " WHEN 3 THEN '（供方）发货' "+
	   " WHEN 5 THEN '（供方）取消供货' "+
       " WHEN 6 THEN '交易成功（需方确认收货）' "+
       " WHEN 7 THEN '(交易失败（拒收等）' "+
	   " WHEN 8 THEN '供方收货（拒收后）' "+
       " WHEN 9 THEN '（供方）已收款' "+
       " WHEN 11 THEN '需方不收货' "+
       " END) as orderStatus " +
			"  from pt_ordermain where DemanderId=#{mfactyId} and paystatus=1")
	List<OrderInCSDTO> getOrderDetailByMfactyId(@Param("mfactyId") Integer custId);

}
