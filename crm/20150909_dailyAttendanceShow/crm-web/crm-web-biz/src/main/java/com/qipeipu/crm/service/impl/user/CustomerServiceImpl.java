package com.qipeipu.crm.service.impl.user;

import java.math.BigDecimal;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.baturu.trade.order.constants.OrderStatus;
import com.qipeipu.crm.dao.CustomerDao;
import com.qipeipu.crm.dao.btrbuss.order.OrderMainOldDao;
import com.qipeipu.crm.dao.btrbuss.receipt.MainReceiptDao;
import com.qipeipu.crm.dao.main.inquiry.InquiryDao;
import com.qipeipu.crm.dao.main.order.OrderMainDao;
import com.qipeipu.crm.dao.main.user.UserMainDao;
import com.qipeipu.crm.dtos.btrbuss.order.dao.OrderMainOldDTO;
import com.qipeipu.crm.dtos.customer.CustomerBaseDataDTO;
import com.qipeipu.crm.dtos.customer.CustomerDTO;
import com.qipeipu.crm.dtos.customer.CustomerTradeDataDTO;
import com.qipeipu.crm.dtos.customer.params.CustomerParamsDTO;
import com.qipeipu.crm.dtos.global.ResultDTO;
import com.qipeipu.crm.dtos.global.ResultState;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.main.inquiry.dto.InquiryInCSDTO;
import com.qipeipu.crm.dtos.main.order.dto.OrderInCSDTO;
import com.qipeipu.crm.dtos.main.user.UserMainDTO;
import com.qipeipu.crm.service.customer.CustomerService;
import com.qipeipu.crm.utils.bean.data.MultipleDataSource;
import com.qipeipu.crm.utils.bean.tools.MoneyUtil;

/**
 * Created by johnkim on 15-2-5.
 */
@Service
public class CustomerServiceImpl implements CustomerService {

	@Autowired
	private CustomerDao customerDao;
	@Autowired
	private MainReceiptDao mainReceiptDao;
	@Autowired
	private OrderMainOldDao orderMainOldDao;
	@Autowired
	private OrderMainDao orderMainDao;
	@Autowired
	private UserMainDao userMainDao;
	@Autowired
	private InquiryDao inquiryDao;

	/***
	 * 新客户录入
	 *
	 * @param customer
	 *            新客户
	 * @return GParamsDTO.model 是否录入成功
	 */
	@Override
	public ResultDTO<?> createCustomer(CustomerDTO customer) {
		CustomerDTO _cust = new CustomerDTO();
		_cust.setMfctyId(customer.getMfctyId());
		_cust.setUserId(customer.getUserId());
		Integer have = customerDao.findCustomerCount(VoModel.builder()
				.setParams(_cust, CustomerParamsDTO.builder().setIsAdmin(true))
				.setModel(_cust), true, false);
		if (have > 0) {
			return ResultDTO.failResult(ResultState.ERROR_CODE,
					"该客户已被录入系统，不能再次录入");
		} else {
			Date now = new Date();
			customer.setUpdateTime(now);
			customer.setRecordTime(now);
			int row = customerDao.createCustomer(customer);
			return ResultDTO.successResult(row > 0);
		}
	}

	/***
	 * 客户列表条件查询
	 *
	 * @param vo
	 *            vo.model 查询参数
	 * @return VoModel.model 符合条件的客户列表
	 */
	@Override
	public VoModel<?, ?> findCustomer(VoModel<?, ?> vo) {
		return vo.setTotal(customerDao.findCustomerCount(vo, true, false))
				.setModel(customerDao.findCustomer(vo, false, false));
	}

	/***
	 * 编辑客户信息
	 *
	 * @param vo
	 *            编辑好了的客户信息
	 * @return GParamsDTO.success 是否编辑成功
	 */
	@Override
	public ResultDTO<?> editCustomer(VoModel<?, ?> vo) {
		CustomerDTO dto = (CustomerDTO) vo.getParams().getBase();
		dto.setUpdateTime(new Date());
		int row = customerDao.editCustomer(vo);
		if (row > 0) {
			return ResultDTO.successResult(row);
		} else {
			return ResultDTO.failResult(ResultState.ERROR_CODE, "客户信息更新失败");
		}
	}

	/**
	 * 根据用户Id，和录入时间查询历史与最新交易信息：询价次数，交易次数，交易金额
	 *
	 * @param dto
	 * @desc CustomerBaseDataDTO.custId:用户MfctyId
	 * @desc CustomerBaseDataDTO.time:录入时间
	 * @return
	 * @throws java.text.ParseException
	 */
	@Override
	public CustomerBaseDataDTO findCustomerTransactionInfo(
			CustomerBaseDataDTO dto) throws ParseException {
		//查询1.0数据库中数据,返回询价时间
		//a.查询询价次数
		BigDecimal zero = new BigDecimal(0);
		Integer custId = dto.getCustId();
		Date recordTime = dto.getTime();
		MultipleDataSource.setDataSourceKey("dataSource");
		Integer inquiryOldNum = mainReceiptDao.getInquiryNumByMfactyId(custId);
		//b.查询订单次数与金额
		Integer treadOldNum = 0;
		BigDecimal moneyOld = new BigDecimal(0);
		OrderMainOldDTO orderMainOldDTO = orderMainOldDao
				.getOrderInfoByMfactyId(custId);
		if (orderMainOldDTO != null) {
			treadOldNum += orderMainOldDTO.getAllOrderNum();
			if (orderMainOldDTO.getAllOrderMoney() != null
					&& orderMainOldDTO.getAllOrderMoney().compareTo(zero) > 0) {
				moneyOld = MoneyUtil.addByBigDecimal(moneyOld,
						orderMainOldDTO.getAllOrderMoney());
			}
		}
		//查询2.0数据库数据
		//查询询价次数，含询价时间
		Integer inquiryNewNum = 0;
		//a.根据汽修厂Id，获得当前汽修厂下所有用户
		MultipleDataSource.setDataSourceKey("mainDataSource");
		List<Long> customerIds = userMainDao.getCustomerByMfactyId(custId);
		if (customerIds != null && customerIds.size() > 0) {
			//获得这些汽修厂的询价信息
			List<InquiryInCSDTO> inquiryList = inquiryDao
					.getAllInquiryByCustomerId(customerIds);
			if (inquiryList != null && inquiryList.size() > 0) {
				for (int j = 0; j < inquiryList.size(); j++) {
					if (recordTime.before(inquiryList.get(j).getPublishTime())) {
						//录入后的询价
						inquiryNewNum++;
					} else {
						inquiryOldNum++;
					}
				}
			}
		}
		//查询订单次数金额，与支付时间
		Integer treadNewNum = 0;
		BigDecimal moneyNew = new BigDecimal(0);
		List<OrderInCSDTO> orderDtoList = orderMainDao.getOrderByMfactyId(
				custId, OrderStatus.PAY_YES);
		if (orderDtoList != null && orderDtoList.size() > 0) {
			for (int i = 0; i < orderDtoList.size(); i++) {
				//当Date1小于Date2时，返回TRUE
				if (recordTime.before(orderDtoList.get(i).getPayTime())) {
					//录入时间小于支付时间时，表示录入之后支付的
					if (orderDtoList.get(i).getMoney().compareTo(zero) > 0) {
						moneyNew = MoneyUtil.addByBigDecimal(moneyNew,
								orderDtoList.get(i).getMoney());
					}
					treadNewNum++;
				} else {
					if (orderDtoList.get(i).getMoney().compareTo(zero) > 0) {
						moneyOld = MoneyUtil.addByBigDecimal(moneyOld,
								orderDtoList.get(i).getMoney());
					}
					treadOldNum++;
				}
			}
		}
		CustomerBaseDataDTO customerBaseDataDTO = new CustomerBaseDataDTO();
		customerBaseDataDTO.setCustId(custId);
		customerBaseDataDTO.setInquiryNewNum(inquiryNewNum);
		customerBaseDataDTO.setInquiryOldNum(inquiryOldNum);
		customerBaseDataDTO.setTreadNewNum(treadNewNum);
		customerBaseDataDTO.setTreadOldNum(treadOldNum);
		customerBaseDataDTO.setMoneyNew(moneyNew);
		customerBaseDataDTO.setMoneyOld(moneyOld);
		return customerBaseDataDTO;
	}

	/**
	 * 查询询价信息
	 */
	@Override
	public List<InquiryInCSDTO> findInquiryInfo(CustomerBaseDataDTO dto)
			throws ParseException {
		List<InquiryInCSDTO> list = new ArrayList<InquiryInCSDTO>();
		Integer custId = dto.getCustId();
		Date recordTime = dto.getTime();
		Boolean isNew = dto.getIsNew();
		if (!isNew) {
			//录入前的询价
			//查询1.0数据库中数据,返回询价时间
			//a.查询询价次数
			MultipleDataSource.setDataSourceKey("dataSource");
			List<InquiryInCSDTO> inquiryOldList = mainReceiptDao
					.getAllInquiryByMfactyId(custId);
			if (inquiryOldList != null && inquiryOldList.size() > 0) {
				list.addAll(inquiryOldList);
			}
		}
		//根据汽修厂Id，获得当前汽修厂下所有用户
		MultipleDataSource.setDataSourceKey("mainDataSource");
		List<Long> customerIds = userMainDao.getCustomerByMfactyId(custId);
		if (customerIds != null && customerIds.size() > 0) {
			//获得这些汽修厂的询价信息
			List<InquiryInCSDTO> inquiryMainList = inquiryDao
					.getAllInquiryByCustomerId(customerIds);
			if (inquiryMainList != null && inquiryMainList.size() > 0) {
				for (int j = 0; j < inquiryMainList.size(); j++) {
					if (recordTime.before(inquiryMainList.get(j)
							.getPublishTime())) {
						if (isNew) {
							//录入后的询价
							list.add(inquiryMainList.get(j));
						}
					} else {
						if (!isNew) {
							//录入前的询价
							list.add(inquiryMainList.get(j));
						}
					}
				}
			}
		}
		return list;
	}

	/**
	 * 订单查询：历史交易与最新交易
	 */
	@Override
	public List<OrderInCSDTO> findOrderInfo(CustomerBaseDataDTO dto)
			throws ParseException {
		List<OrderInCSDTO> list = new ArrayList<OrderInCSDTO>();
		Integer custId = dto.getCustId();
		Date recordTime = dto.getTime();
		Boolean isNew = dto.getIsNew();
		if (!isNew) {
			MultipleDataSource.setDataSourceKey("dataSource");
			List<OrderInCSDTO> orderOldList = orderMainOldDao
					.getOrderDetailByMfactyId(custId);
			if (orderOldList != null && orderOldList.size() > 0) {
				list.addAll(orderOldList);
			}
		}
		MultipleDataSource.setDataSourceKey("mainDataSource");
		List<OrderInCSDTO> orderDtoList = orderMainDao.getOrderByMfactyId(
				custId, OrderStatus.PAY_YES);
		if (orderDtoList != null && orderDtoList.size() > 0) {
			for (int i = 0; i < orderDtoList.size(); i++) {
				//当Date1小于Date2时，返回TRUE
				if (recordTime.before(orderDtoList.get(i).getPayTime())) {//时间1(当前时间)before(小于)时间2(历史时间):false
					if (isNew) {
						//录入时间小于支付时间时，表示录入之后支付的
						list.add(orderDtoList.get(i));
					}
				} else {
					if (!isNew) {
						list.add(orderDtoList.get(i));
					}
				}
			}
		}
		return list;
	}

	/***
	 * 获得用户Id，与用户录入时间
	 *
	 * @param vo
	 *            vo.model 查询参数
	 * @return VoModel.model 符合条件的客户列表
	 */
	@SuppressWarnings("unchecked")
	@Override
	public VoModel<?, ?> findAllCustomer(VoModel<?, ?> vo) {
		VoModel<?, ?> customerVoModel = vo.setTotal(
				customerDao.findCustomerCount(vo, true, true)).setModel(
						customerDao.findCustomer(vo, false, true));
		Integer inquiryNum = 0;//记录询价次数
		Set<Integer> inqueryMfactrySet = new HashSet<Integer>();//记录询价维修厂Id
		Integer orderNum = 0;//订单次数
		BigDecimal orderMoney = new BigDecimal(0);//订单交易金额
		Set<Integer> orderMfactrySet = new HashSet<Integer>();//记录订单维修厂
		if (customerVoModel != null && customerVoModel.getTotal() > 0) {
			List<CustomerDTO> customerList = (List<CustomerDTO>) customerVoModel
					.getModel();
			List<Integer> mfactyIdList = new ArrayList<Integer>();
			Map<Integer, Date> recordTimeMap = new HashMap<Integer, Date>();//保存每个汽修厂的录入时间
			if (customerList != null && customerList.size() > 0) {
				//遍历获取汽修厂Id，汽修厂录入时间
				for (int i = 0; i < customerList.size(); i++) {
					mfactyIdList.add(customerList.get(i).getMfctyId());
					recordTimeMap.put(customerList.get(i).getMfctyId(),
							customerList.get(i).getRecordTime());
				}
				MultipleDataSource.setDataSourceKey("mainDataSource");
				//需要查询维修厂下用户信息，因询价主单中只有用户Id
				List<UserMainDTO> userMainDTOList = userMainDao
						.getAllCustomerByMfactyIds(mfactyIdList);
				if (userMainDTOList != null && userMainDTOList.size() > 0) {
					List<Long> customerIds = new ArrayList<Long>();
					Map<Long, Integer> customerMap = new HashMap<Long, Integer>();//保存每个用户的汽修厂Id
					for (int j = 0; j < userMainDTOList.size(); j++) {
						customerIds.add(userMainDTOList.get(j).getUserID());
						customerMap.put(userMainDTOList.get(j).getUserID(),
								userMainDTOList.get(j).getOrgID());
					}
					//获得这些汽修厂的询价信息
					if (customerIds.size() > 0) {
						List<InquiryInCSDTO> inquiryMainList = inquiryDao
								.getAllInquiryByCustomerId(customerIds);
						if (inquiryMainList != null
								&& inquiryMainList.size() > 0) {
							for (int j = 0; j < inquiryMainList.size(); j++) {
								Long customerId = inquiryMainList.get(j)
										.getUserId();//用户Id
								Integer mfactryId = customerMap.get(customerId);//汽修厂Id
								Date recordTime = recordTimeMap.get(mfactryId);//录入时间
								if (recordTime.before(inquiryMainList.get(j)
										.getPublishTime())) {
									//录入后的数据
									inquiryNum++;
									inqueryMfactrySet.add(mfactryId);
								}
							}
						}
					}

				}
				if (mfactyIdList != null && mfactyIdList.size() > 0) {
					//查询订单信息
					List<OrderInCSDTO> orderDtoList = orderMainDao
							.getAllOrderByMfactyIds(mfactyIdList,
									OrderStatus.PAY_YES);
					if (orderDtoList != null && orderDtoList.size() > 0) {
						for (int i = 0; i < orderDtoList.size(); i++) {
							Integer mfactryId = orderDtoList.get(i)
									.getDemanderId();
							Date recordTime = recordTimeMap.get(mfactryId);
							if (recordTime.before(orderDtoList.get(i)
									.getPayTime())) {//时间1(当前时间)before(小于)时间2(历史时间):false
								orderNum++;
								orderMoney = MoneyUtil.addByBigDecimal(
										orderDtoList.get(i).getMoney(),
										orderMoney);
								orderMfactrySet.add(mfactryId);
							}
						}
					}
				}
			}
		}
		CustomerTradeDataDTO customerTradeDataDTO = new CustomerTradeDataDTO();
		customerTradeDataDTO.setInquiryMfctyNum(inqueryMfactrySet.size());
		customerTradeDataDTO.setInquiryNum(inquiryNum);
		customerTradeDataDTO.setTreadMfctyNum(orderMfactrySet.size());
		customerTradeDataDTO.setTreadNum(orderNum);
		customerTradeDataDTO.setMoney(orderMoney);

		return VoModel.builder().setModel(customerTradeDataDTO);
	}

}
