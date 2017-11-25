package com.qipeipu.crm.service.impl.main;

import java.math.BigDecimal;
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
import com.qipeipu.crm.dao.main.inquiry.InquiryDao;
import com.qipeipu.crm.dao.main.order.OrderMainDao;
import com.qipeipu.crm.dao.main.user.UserMainDao;
import com.qipeipu.crm.dtos.customer.CustomerDTO;
import com.qipeipu.crm.dtos.customer.CustomerTradeDataDTO;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.main.inquiry.dto.InquiryInCSDTO;
import com.qipeipu.crm.dtos.main.order.dto.OrderInCSDTO;
import com.qipeipu.crm.dtos.main.user.UserMainDTO;
import com.qipeipu.crm.dtos.statistics.StatisticsAllDTO;
import com.qipeipu.crm.dtos.statistics.StatisticsPersonDTO;
import com.qipeipu.crm.service.main.OrderInCSService;
import com.qipeipu.crm.utils.bean.data.MultipleDataSource;
import com.qipeipu.crm.utils.bean.tools.MoneyUtil;

@Service
public class OrderInCSServiceImpl implements OrderInCSService {
	@Autowired
	private CustomerDao customerDao;
	@Autowired
	private OrderMainDao orderMainDao;
	@Autowired
	private UserMainDao userMainDao;
	@Autowired
	private InquiryDao inquiryDao;

	/**
	 * 电话统计中根据查询条件获得的具体订单信息
	 *
	 * @param vo传递的参数
	 * @return
	 */
	@Override
	public VoModel<?, ?> findTelTradeInfo(VoModel<?, ?> vo) {
		//根据传递的参数获得符合条件的维修厂Id信息:cust.MfctyId,cust.UserId,cust.RecordTime,cust.UserId,user.UserName
		Integer orderNum = 0;
		BigDecimal orderMoney = new BigDecimal(0);
		Set<Integer> orderMfactrySet = new HashSet<Integer>();
		Integer inquiryNum = 0;//记录询价次数
		Set<Integer> inqueryMfactrySet = new HashSet<Integer>();//记录询价维修厂Id
		MultipleDataSource.setDataSourceKey("dataSource");
		List<CustomerDTO> customerList = customerDao
				.findCustomerForTelStatistics(vo);
		Map<Integer, Date> recordTimeMap = new HashMap<Integer, Date>();//保存录入时间
		Map<Integer, String> usersMap = new HashMap<Integer, String>();//保存跟踪人
		List<Integer> mfactyIdList = new ArrayList<Integer>();
		List<OrderInCSDTO> orderInCSDTOFilterList = new ArrayList<OrderInCSDTO>();
		List<StatisticsPersonDTO> statisticsPersonDTOList = new ArrayList<StatisticsPersonDTO>();
		if (customerList != null) {
			for (int i = 0; i < customerList.size(); i++) {
				recordTimeMap.put(customerList.get(i).getMfctyId(),
						customerList.get(i).getRecordTime());//保存每个维修厂的录入时间
				mfactyIdList.add(customerList.get(i).getMfctyId());
				usersMap.put(customerList.get(i).getMfctyId(), customerList
						.get(i).getUserName());
			}
			if (mfactyIdList.size() > 0) {
				//需要查询维修厂下用户信息，因询价主单中只有用户Id
				MultipleDataSource.setDataSourceKey("mainDataSource");
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
				//根据条件获得符合条件的订单信息
				//a.获得这些汽修厂所有的订单信息:OrderMainID,OrderMainNo,PayTime,Money,DemanderID,PublishTime
				List<OrderInCSDTO> orderInCSDTOList = orderMainDao
						.getAllOrderInfoByMfactyIds(mfactyIdList, vo);
				if (orderInCSDTOList != null) {
					for (int i = 0; i < orderInCSDTOList.size(); i++) {
						Integer mfactryId = orderInCSDTOList.get(i)
								.getDemanderId();
						Date recordTime = recordTimeMap.get(mfactryId);
						if (recordTime.before(orderInCSDTOList.get(i)
								.getPayTime())) {//时间1(当前时间)before(小于)时间2(历史时间):false
							orderNum++;
							orderMoney = MoneyUtil.addByBigDecimal(
									orderInCSDTOList.get(i).getMoney(),
									orderMoney);
							orderMfactrySet.add(mfactryId);
							orderInCSDTOFilterList.add(orderInCSDTOList.get(i));
						}
					}
					if (orderInCSDTOFilterList.size() > 0) {
						List<Integer> orderIdList = new ArrayList<Integer>();//获取当前页要查询的信息
						//				//进行排序
						//				ParamsDTO params = vo.getParams();
						//				CustomerParamsDTO special = (CustomerParamsDTO)params.getSpecial();
						//				if(special.getSort().equals("0")){
						//
						//				}
						//获得RecvTime
						for (int i = vo.getSize() * vo.getCurrent(); i < (vo
								.getCurrent() + 1) * vo.getSize()
								&& i < orderInCSDTOFilterList.size(); i++) {
							orderIdList.add(orderInCSDTOFilterList.get(i)
									.getOrderMainId());
						}
						if (orderIdList.size() > 0) {
							statisticsPersonDTOList = orderMainDao
									.getAllOrderByOrderIds(orderIdList);
							for (int j = 0; j < statisticsPersonDTOList.size(); j++) {
								Integer mfactyId = statisticsPersonDTOList.get(
										j).getDemanderId();
								statisticsPersonDTOList.get(j).setUserName(
										usersMap.get(mfactyId));
								statisticsPersonDTOList.get(j).setRecordTime(
										recordTimeMap.get(mfactyId));
								Date recvTime = statisticsPersonDTOList.get(j)
										.getRecvTime();
								if (recvTime != null) {
									long between = (recvTime.getTime() - statisticsPersonDTOList
											.get(j).getPublishTime().getTime()) / 1000;//除以1000是为了转换成秒
									long day1 = between / (24 * 3600);
									long hour1 = between % (24 * 3600) / 3600;
									long minute1 = between % 3600 / 60;
									long second1 = between % 60 / 60;
									statisticsPersonDTOList.get(j)
											.setSpentTime(
													day1 + "天" + hour1 + "小时"
															+ minute1 + "分"
															+ second1 + "秒");
								}
							}
						}
					}
				}
			}
		}
		Map<String, Object> map = new HashMap<String, Object>();
		CustomerTradeDataDTO customerTradeDataDTO = new CustomerTradeDataDTO();
		customerTradeDataDTO.setTreadNum(orderNum);
		customerTradeDataDTO.setMoney(orderMoney);
		customerTradeDataDTO.setTreadMfctyNum(orderMfactrySet.size());
		customerTradeDataDTO.setInquiryNum(inquiryNum);
		customerTradeDataDTO.setInquiryMfctyNum(inqueryMfactrySet.size());
		map.put("telStatisticsInfo", customerTradeDataDTO);
		map.put("telStatisticsList", statisticsPersonDTOList);
		return vo.setTotal(orderInCSDTOFilterList.size()).setModel(map);
	}

	/**
	 * 业绩统计-汇总统计根据查询条件获得具体每个汽修厂交易信息
	 *
	 * @param vo
	 * @return
	 */
	@Override
	public VoModel<?, ?> findSummaryTradeInfo(VoModel<?, ?> vo) {
		BigDecimal zero = new BigDecimal(0);
		//根据传递的参数获得符合条件的维修厂Id信息:cust.MfctyId,cust.UserId,cust.RecordTime,cust.UserId,user.UserName
		Integer orderNum = 0;
		BigDecimal orderMoney = new BigDecimal(0);
		Set<Integer> orderMfactrySet = new HashSet<Integer>();
		Integer inquiryNum = 0;//记录询价次数
		Set<Integer> inqueryMfactrySet = new HashSet<Integer>();//记录询价维修厂Id
		MultipleDataSource.setDataSourceKey("dataSource");
		List<CustomerDTO> customerList = customerDao
				.findCustomerForTelStatistics(vo);
		Map<Integer, Date> recordTimeMap = new HashMap<Integer, Date>();//保存录入时间
		Map<Integer, String> usersMap = new HashMap<Integer, String>();//保存跟踪人
		Map<Integer, Integer> mfactyInquiryInfo = new HashMap<Integer, Integer>();//保存单个汽修厂的询价信息
		Map<Integer, Integer> mfactyPayOrderNumInfo = new HashMap<Integer, Integer>();//保存单个汽修厂的支付的订单次数
		Map<Integer, BigDecimal> mfactyPayOrderMoneyInfo = new HashMap<Integer, BigDecimal>();//保存单个汽修厂的支付的订单金额
		Map<Integer, Integer> mfactyNoPayOrderNumInfo = new HashMap<Integer, Integer>();//保存单个汽修厂的未支付的订单次数
		Map<Integer, BigDecimal> mfactyNoPayOrderMoneyInfo = new HashMap<Integer, BigDecimal>();//保存单个汽修厂的未支付的订单金额
		List<StatisticsAllDTO> summaryList = new ArrayList<StatisticsAllDTO>();//获取统计明细
		List<Integer> mfactyIdList = new ArrayList<Integer>();
		if (customerList != null) {
			for (int i = 0; i < customerList.size(); i++) {
				recordTimeMap.put(customerList.get(i).getMfctyId(),
						customerList.get(i).getRecordTime());//保存每个维修厂的录入时间
				mfactyIdList.add(customerList.get(i).getMfctyId());
				usersMap.put(customerList.get(i).getMfctyId(), customerList
						.get(i).getUserName());
				mfactyInquiryInfo.put(customerList.get(i).getMfctyId(), 0);//初始化数据
				mfactyPayOrderNumInfo.put(customerList.get(i).getMfctyId(), 0);
				mfactyNoPayOrderNumInfo
						.put(customerList.get(i).getMfctyId(), 0);
				mfactyPayOrderMoneyInfo.put(customerList.get(i).getMfctyId(),
						zero);
				mfactyNoPayOrderMoneyInfo.put(customerList.get(i).getMfctyId(),
						zero);
			}
			if (mfactyIdList.size() > 0) {
				//需要查询维修厂下用户信息，因询价主单中只有用户Id
				MultipleDataSource.setDataSourceKey("mainDataSource");
				if (mfactyIdList != null) {
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
									Integer mfactryId = customerMap
											.get(customerId);//汽修厂Id
									Date recordTime = recordTimeMap
											.get(mfactryId);//录入时间
									if (recordTime.before(inquiryMainList
											.get(j).getPublishTime())) {
										//录入后的数据
										inquiryNum++;
										inqueryMfactrySet.add(mfactryId);
										Integer mfactyInquiryNum = mfactyInquiryInfo
												.get(mfactryId);
										mfactyInquiryInfo.put(mfactryId,
												mfactyInquiryNum + 1);//跟新询价计数
									}
								}
							}
						}

					}
					//根据条件获得符合条件的订单信息
					//a.获得这些汽修厂所有的订单信息:OrderMainID,OrderMainNo,PayTime,Money,DemanderID,PublishTime
					List<OrderInCSDTO> orderInCSDTOList = orderMainDao
							.getOrdersByMfactyIds(mfactyIdList);
					if (orderInCSDTOList != null) {
						for (int i = 0; i < orderInCSDTOList.size(); i++) {
							Integer mfactryId = orderInCSDTOList.get(i)
									.getDemanderId();
							Date recordTime = recordTimeMap.get(mfactryId);
							if (orderInCSDTOList.get(i).getPayTime() == null
									|| recordTime.before(orderInCSDTOList
											.get(i).getPayTime())) {//时间1(当前时间)before(小于)时间2(历史时间):false
								if (orderInCSDTOList.get(i).getPayStatus() == OrderStatus.PAY_YES) {
									orderNum++;
									orderMoney = MoneyUtil.addByBigDecimal(
											orderInCSDTOList.get(i).getMoney(),
											orderMoney);
									orderMfactrySet.add(mfactryId);
									Integer mfactryOrderNum = mfactyPayOrderNumInfo
											.get(mfactryId);
									mfactyPayOrderNumInfo.put(mfactryId,
											mfactryOrderNum + 1);
									BigDecimal mfactryOrderMoney = mfactyPayOrderMoneyInfo
											.get(mfactryId);
									mfactyPayOrderMoneyInfo.put(mfactryId,
											MoneyUtil.addByBigDecimal(
													orderInCSDTOList.get(i)
															.getMoney(),
													mfactryOrderMoney));
								} else {
									Integer mfactryOrderNum = mfactyNoPayOrderNumInfo
											.get(mfactryId);
									mfactyNoPayOrderNumInfo.put(mfactryId,
											mfactryOrderNum + 1);
									BigDecimal mfactryOrderMoney = mfactyNoPayOrderMoneyInfo
											.get(mfactryId);
									mfactyNoPayOrderMoneyInfo.put(mfactryId,
											MoneyUtil.addByBigDecimal(
													orderInCSDTOList.get(i)
															.getMoney(),
													mfactryOrderMoney));
								}
							}
						}
					}
				}
			}
		}
		if (customerList.size() > 0) {
			//获得RecvTime
			for (int i = vo.getSize() * vo.getCurrent(); i < (vo.getCurrent() + 1)
					* vo.getSize()
					&& i < customerList.size(); i++) {
				StatisticsAllDTO statisticsAllDTO = new StatisticsAllDTO();
				Integer mfactyId = customerList.get(i).getMfctyId();
				statisticsAllDTO.setMfctyName(customerList.get(i)
						.getMfctyName());
				statisticsAllDTO.setInquiryNum(mfactyInquiryInfo.get(mfactyId));
				statisticsAllDTO.setOrderPayNum(mfactyPayOrderNumInfo
						.get(mfactyId));
				statisticsAllDTO.setOrderPayMoney(mfactyPayOrderMoneyInfo
						.get(mfactyId));
				statisticsAllDTO.setOrderNoPayNum(mfactyNoPayOrderNumInfo
						.get(mfactyId));
				statisticsAllDTO.setOrderNoPayMoney(mfactyNoPayOrderMoneyInfo
						.get(mfactyId));
				statisticsAllDTO.setRecordTime(customerList.get(i)
						.getRecordTime());
				statisticsAllDTO.setUserName(customerList.get(i).getUserName());
				summaryList.add(statisticsAllDTO);
			}
		}
		Map<String, Object> map = new HashMap<String, Object>();
		CustomerTradeDataDTO customerTradeDataDTO = new CustomerTradeDataDTO();
		customerTradeDataDTO.setTreadNum(orderNum);
		customerTradeDataDTO.setMoney(orderMoney);
		customerTradeDataDTO.setTreadMfctyNum(orderMfactrySet.size());
		customerTradeDataDTO.setInquiryNum(inquiryNum);
		customerTradeDataDTO.setInquiryMfctyNum(inqueryMfactrySet.size());
		map.put("summaryInfo", customerTradeDataDTO);
		map.put("summaryList", summaryList);
		return vo.setTotal(customerList.size()).setModel(map);
	}

}
