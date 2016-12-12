package com.qipeipu.crm.dao.main.inquiry;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.qipeipu.crm.dtos.main.inquiry.dto.InquiryInCSDTO;

public interface InquiryDao {
	/**
	 * 根据用户ID，查询汽修厂下所有询价单,status:询价单状态： -1:删除, 0:保存，1:发布, 2:已报价, 4报价中
	 * 
	 * @param customerIds
	 * @return
	 */
	@Select({
			"<script>select inquiryId,inquiryNo,publishTime,userId,(CASE Status WHEN 1 THEN '发布' WHEN 2 THEN '已报价' WHEN 4 THEN '报价中' END) as status from qp_inquiry where  `status` in (1,2,4) and userID in ",
			"<foreach item='item' index='index' collection='customerIds'",
			"open='(' separator=',' close=')'>", "#{item}", "</foreach>",
			"</script>" })
	List<InquiryInCSDTO> getAllInquiryByCustomerId(
			@Param("customerIds") List<Long> customerIds);

}
