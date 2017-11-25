package com.qipeipu.crm.service.customer;

import java.text.ParseException;
import java.util.List;

import com.qipeipu.crm.dtos.customer.CustomerBaseDataDTO;
import com.qipeipu.crm.dtos.customer.CustomerDTO;
import com.qipeipu.crm.dtos.global.ResultDTO;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.main.inquiry.dto.InquiryInCSDTO;
import com.qipeipu.crm.dtos.main.order.dto.OrderInCSDTO;

/**
 * Created by johnkim on 15-2-5.
 */
public interface CustomerService {
	/***
	 * 新客户录入
	 *
	 * @param customer
	 *            新客户
	 * @return GParamsDTO.model 是否录入成功
	 */
	ResultDTO<?> createCustomer(CustomerDTO customer);

	/***
	 * 查询客户信息
	 *
	 * @param vo
	 *            vo.model 查询参数
	 * @return VoModel.model 符合条件的客户列表
	 */
	VoModel<?, ?> findCustomer(VoModel<?, ?> vo);

	/***
	 * 编辑客户信息
	 *
	 * @param vo
	 *            编辑好了的客户信息
	 * @return GParamsDTO.success 是否编辑成功
	 */
	ResultDTO<?> editCustomer(VoModel<?, ?> vo);

	/**
	 * 根据用户Id，和录入时间查询历史交易信息：询价次数，交易次数，交易金额
	 *
	 * @param dto
	 * @desc customerId:用户MfctyId
	 * @desc recordTime:录入时间
	 * @return
	 * @throws java.text.ParseException
	 */
	CustomerBaseDataDTO findCustomerTransactionInfo(CustomerBaseDataDTO dto)
			throws ParseException;

	/**
	 * 获得询价单信息，根据CustomerBaseDataDTO中的isNew来判断查询新旧数据，ture查新数据，false:查询旧数据
	 *
	 * @throws java.text.ParseException
	 */
	List<InquiryInCSDTO> findInquiryInfo(CustomerBaseDataDTO dto)
			throws ParseException;

	/**
	 * 获得订单信息,根据CustomerBaseDataDTO中的isNew来判断查询的新旧数据，true查询新数据，false：查询旧数据
	 */
	List<OrderInCSDTO> findOrderInfo(CustomerBaseDataDTO dto)
			throws ParseException;

	/**
	 * 获得当前用户所有下所有的录入的汽修厂信息
	 *
	 * @param vo
	 * @return
	 */
	VoModel<?, ?> findAllCustomer(VoModel<?, ?> vo);

}
