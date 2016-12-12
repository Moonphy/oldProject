package com.qipeipu.crm.dao.btrbuss.receipt;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import com.qipeipu.crm.dtos.main.inquiry.dto.InquiryInCSDTO;

/**
 * 1.0版数据库中的询价表
 * @author Administrator
 *
 */
public interface MainReceiptDao {
	/**
	 * 获得1.0中询价次数:状态：0(保存),1(发布),2(匹配中),3(匹配成功),4(匹配失败),5(取消),6(报价中),7(询价结束),8(确定报价),9(转订单),10(失效)
	 * @param customerId
	 * @return
	 */
	@Select("select COUNT(*) from pt_mainreceipt where MfctyID=#{mfctyId} and status in (1,2,3,4,6,7,8,9)")
	Integer getInquiryNumByMfactyId(@Param("mfctyId") Integer mfactyId);
	/**
	 * 查询历史询价单号,时间,状态
	 * @param mfactyId
	 * @return
	 */
	@Select("select EnquiryMainID as inquiryId,MainReceiptNo as inquiryNo,"+
			" (CASE Status "+
			" WHEN 1 THEN '发布' " +
			" WHEN 2 THEN '匹配中' "+
			" WHEN 3 THEN '匹配成功'"+
			" WHEN 4 THEN '匹配失败' "+
			" WHEN 5 THEN '取消' "+
			" WHEN 6 THEN '报价中' "+
			" WHEN 7 THEN '询价结束' "+
			" WHEN 8 THEN '确定报价' "+
			" WHEN 9 THEN '转订单' "+
			" WHEN 10 THEN '失效' "+
			" END) as status,PublishTime as publishTime from pt_mainreceipt where  status in (1,2,3,4,6,7,8,9) and MfctyID=#{mfactyId}")
	List<InquiryInCSDTO> getAllInquiryByMfactyId(@Param("mfactyId") Integer mfactyId);

}
