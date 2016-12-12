package com.qipeipu.crm.controller;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.ServletRequestDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.mvc.SimpleFormController;

import com.qipeipu.crm.dtos.customer.CustOfflineBuyDTO;
import com.qipeipu.crm.dtos.customer.CustTraceDTO;
import com.qipeipu.crm.dtos.customer.CustomerBaseDataDTO;
import com.qipeipu.crm.dtos.customer.CustomerDTO;
import com.qipeipu.crm.dtos.customer.params.CustomerParamsDTO;
import com.qipeipu.crm.dtos.global.ResultDTO;
import com.qipeipu.crm.dtos.global.ResultState;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.main.MorgDTO;
import com.qipeipu.crm.service.customer.CustOffLineBuyService;
import com.qipeipu.crm.service.customer.CustTraceService;
import com.qipeipu.crm.service.customer.CustomerService;
import com.qipeipu.crm.service.main.MorgService;
import com.qipeipu.crm.session.UserSessionInfo;
import com.qipeipu.crm.session.bean.CrmSessionUser;
import com.qipeipu.crm.utils.bean.tools.GUtils;

/**
 * 客户相关 Created by johnkim on 15-2-5.
 */
@Controller
@RequestMapping(value = "customer")
public class CustomerController extends SimpleFormController {

	private static final Logger logger = Logger
			.getLogger(CustomerController.class);

	@Autowired
	private CustomerService customerService;
	@Autowired
	private MorgService mOrgService;
	@Autowired
	private CustTraceService custTraceService;
	@Autowired
	private CustOffLineBuyService custOffLineBuyService;

	@RequestMapping(value = "new", method = RequestMethod.POST)
	public String createCustomer(HttpServletRequest request, ModelMap map,
			CustomerDTO customer, Integer[] offlines) {
		String dispatch = "customer/new";
		String msg = null;
		int state = -1;
		try {
			if (customer == null) {
				msg = "无法获取到参数";
			} else if (customer.getMfctyId() == null) {
				msg = "请输入汽修厂ID";
			} else if (GUtils.isEmptyOrNull(String.valueOf(customer.getMp()))
					&& GUtils
							.isEmptyOrNull(String.valueOf(customer.getEmail()))) {
				msg = "请输入手机账户名或邮箱账户名";
			} else if (GUtils.isEmptyOrNull(customer.getMfctyName())) {
				msg = "请输入厂家名";
			} else if (GUtils.isEmptyOrNull(customer.getAddress())) {
				msg = "请输入地址";
			} else if (GUtils.isEmptyOrNull(customer.getCactMan())) {
				msg = "请输入联系人";
			} else if (GUtils.isEmptyOrNull(customer.getCactTel())) {
				msg = "请输入联系电话";
			} else if (customer.getCreateTime() == null) {
				msg = "请输入注册时间";
			} else {
				Integer userId = UserSessionInfo.getUserIdOfRequest(request);
				customer.setUserId(userId);
				ResultDTO resultDto = customerService.createCustomer(customer);
				if (resultDto.isSuccess()) {
					if (offlines != null && offlines.length > 0) {// 线下
						int len = offlines.length;
						CustOfflineBuyDTO[] dtos = getCustOfflineBuyDTOs(
								offlines, customer, userId);
						if (custOffLineBuyService
								.update(dtos, customer.getId())) {
							state = 0;
							map.put("result",
									ResultDTO.successResult("客户信息录入成功"));
						} else {
							msg = "客户信息录入成功，客户采购构成更新失败";
						}
					} else {
						state = 0;
						map.put("result", ResultDTO.successResult("客户信息录入成功"));
					}
				} else {
					//获取详细错误信息
					msg = resultDto.getMsg();
				}
			}
			if (state == -1) {
				map.put("result", ResultDTO.failResult(ResultState.ERROR_CODE,
						msg, customer));
			}
		} catch (Exception e) {
			logger.error("{新客户信息录入失败}" + e.getMessage());
		}
		return dispatch;
	}

	/***
	 * [共用代码]更新setCustOfflineBuyDTOs
	 *
	 * @param offlines
	 * @param customer
	 * @param userId
	 * @return
	 */
	private CustOfflineBuyDTO[] getCustOfflineBuyDTOs(Integer[] offlines,
			CustomerDTO customer, Integer userId) {
		int len = offlines.length;
		CustOfflineBuyDTO[] dtos = new CustOfflineBuyDTO[len];
		Integer custId = customer.getId();
		Date date = new Date();
		CustOfflineBuyDTO tmp = null;
		for (int i = 0; i < len; i++) {
			tmp = new CustOfflineBuyDTO();
			tmp.setCityId(offlines[i]);
			tmp.setUserId(userId);
			tmp.setCustId(custId);
			tmp.setCreateTime(date);
			tmp.setUpdateTime(date);
			tmp.setPrior(i + 1);
			dtos[i] = tmp;
		}
		return dtos;
	}

	@RequestMapping(value = "edit/{id}", method = RequestMethod.GET)
	public String editCustomer(HttpServletRequest request, ModelMap map,
			@PathVariable("id") Integer id) {
		String dispatch = "customer/new";
		try {
			CrmSessionUser user = UserSessionInfo
					.user_getUserOfRequest(request);

			CustomerDTO customer = new CustomerDTO();
			customer.setId(id);
			customer.setUserId(user.getUserId());

			//构造查询参数
			CustomerParamsDTO params = CustomerParamsDTO.builder().setIsAdmin(
					user.getIsAdmin());
			VoModel vo = VoModel.builder().setParams(customer, params);
			vo = customerService.findCustomer(vo);
			List<CustomerDTO> list = (List<CustomerDTO>) vo.getModel();
			if (list != null && list.size() > 0) {
				customer = list.get(0);
				map.put("result", ResultDTO.successResult(customer));
			} else {
				map.put("result", ResultDTO.failResult(ResultState.ERROR_CODE,
						"未查询到此汽修厂信息{或此客户不属于你}。", customer));
			}
			map.put("flag", 1);
			map.put("id", id);
		} catch (Exception e) {
			logger.error("{客户信息编辑失败}" + e.getMessage());
		}
		return dispatch;
	}

	@RequestMapping(value = "edit/{id}", method = RequestMethod.POST)
	public String editCustomer(HttpServletRequest request, ModelMap map,
			CustomerDTO customer, Integer[] offlines) {
		String dispatch = "customer/new";
		String msg = null;
		int state = -1;
		try {
			if (customer == null) {
				msg = "无法获取到参数";
			} else if (customer.getMfctyId() == null) {
				msg = "汽修厂ID丢失";
			} else if (GUtils.isEmptyOrNull(String.valueOf(customer.getMp()))
					&& GUtils
					.isEmptyOrNull(String.valueOf(customer.getEmail()))) {
				msg = "请输入手机账户名或邮箱账户名";
			} else if (GUtils.isEmptyOrNull(customer.getMfctyName())) {
				msg = "请输入厂家名";
			} else if (GUtils.isEmptyOrNull(customer.getAddress())) {
				msg = "请输入地址";
			} else if (GUtils.isEmptyOrNull(customer.getCactMan())) {
				msg = "请输入联系人";
			} else if (GUtils.isEmptyOrNull(customer.getCactTel())) {
				msg = "请输入联系电话";
			} else if (customer.getCreateTime() == null) {
				msg = "请输入注册时间";
			} else {
				CrmSessionUser user = UserSessionInfo
						.user_getUserOfRequest(request);

				//验证当前客户是否是当前客服的，是否存在
				CustomerDTO unintCustomer = new CustomerDTO();
				unintCustomer.setId(customer.getId());
				unintCustomer.setUserId(user.getUserId());
				//构造查询参数
				CustomerParamsDTO params = CustomerParamsDTO.builder()
						.setIsAdmin(user.getIsAdmin());
				VoModel vo = VoModel.builder().setParams(unintCustomer, params);

				vo = customerService.findCustomer(vo);
				List<CustomerDTO> list = (List<CustomerDTO>) vo.getModel();
				if (list != null && list.size() > 0) {
					//是当前客服或存在，合法
					unintCustomer = list.get(0);
					//使用数据库中的客户id
					customer.setMfctyId(unintCustomer.getMfctyId());
					customer.setUserId(user.getUserId());
					ResultDTO resultDto = customerService.editCustomer(vo
							.setParams(customer, params));
					if (resultDto.isSuccess()) {
						if (offlines != null && offlines.length > 0) {// 线下
							int len = offlines.length;
							CustOfflineBuyDTO[] dtos = getCustOfflineBuyDTOs(
									offlines, customer, customer.getUserId());
							if (custOffLineBuyService.update(dtos,
									customer.getId())) {
								state = 0;
								map.put("result",
										ResultDTO.successResult("客户信息编辑成功"));
							} else {
								msg = "客户信息更新成功，客户采购构成更新失败";
							}
						} else {
							state = 0;
							map.put("result",
									ResultDTO.successResult("客户信息编辑成功"));
						}
					} else {
						//获取详细错误信息
						msg = resultDto.getMsg();
					}
				} else {
					//不属于当前客服或不存在，非法
					msg = "未查询到此汽修厂信息{或此客户不属于你}。";
				}
			}
			if (state == -1) {
				map.put("result", ResultDTO.failResult(ResultState.ERROR_CODE,
						msg, customer));
			}
			map.put("flag", 1);
			map.put("id", customer.getId());
		} catch (Exception e) {
			logger.error("{客户信息编辑失败}" + e.getMessage());
		}
		return dispatch;
	}

	/***
	 * 返回某客户线下采购构成
	 *
	 * @param custId
	 *            客户汽修厂Id
	 * @memo ajax
	 */
	@RequestMapping(value = "offlineBuy", method = RequestMethod.GET)
	public void custOfflineBuy(HttpServletRequest request,
			HttpServletResponse response, Integer custId) {
		List<CustOfflineBuyDTO> list = custOffLineBuyService
				.findByCustId(custId);
		ResultDTO result = ResultDTO.failResult(ResultState.ERROR_CODE,
				"未查询到该客户线下采购构成信息。");
		if (list != null) {
			result = ResultDTO.successResult(list);
		}
		GUtils.responseJson(response, result);
	}

	/***
	 * 返回客户汽修厂资料信息
	 *
	 * @param mfctyId
	 *            客户汽修厂Id
	 * @memo ajax
	 */
	@RequestMapping(value = "orgInfo", method = RequestMethod.GET)
	public void getMorgInfo(HttpServletRequest request,
			HttpServletResponse response, Integer mfctyId) {
		MorgDTO org = mOrgService.getMorgInfo(mfctyId);
		ResultDTO result = ResultDTO.failResult(ResultState.ERROR_CODE,
				"未查询到此汽修厂信息,请检查汽修厂ID是否输入正确。");
		if (org != null) {
			result = ResultDTO.successResult(org);
		}
		GUtils.responseJson(response, result);
	}

	@RequestMapping(value = "clist", method = RequestMethod.GET)
	public String findCustomer(HttpServletRequest request, ModelMap map,
			CustomerDTO customer, VoModel vo, CustomerParamsDTO params) {
		String dispatch = "customer/clist";
		try {
			if (vo != null) {
				CrmSessionUser user = UserSessionInfo
						.user_getUserOfRequest(request);

				//只查询客服自己的客户
				customer.setUserId(user.getUserId());
				if (params == null) {
					params = CustomerParamsDTO.builder();
				}
				params.setIsAdmin(user.getIsAdmin());
				vo.setParams(customer, params);
				vo = customerService.findCustomer(vo);
				map.put("result", ResultDTO.successResult(vo));
				VoModel<?, ?> vo2 = vo.clone();
				VoModel<?, ?> customerVoModel = customerService
						.findAllCustomer(vo2);
				map.put("tradeInfo", ResultDTO.successResult(customerVoModel));
			} else {
				map.put("result",
						ResultDTO.failResult(ResultState.ERROR_CODE, "无法获取到参数"));
			}
		} catch (Exception e) {
			logger.error("{客户列表信息查询失败}", e);
		}
		return dispatch;
	}

	@RequestMapping(value = "memo/{id}", method = RequestMethod.GET)
	public String memo(HttpServletRequest request, ModelMap map,
			@PathVariable("id") Integer id, VoModel vo, CustomerParamsDTO params) {
		String dispatch = "customer/memo";
		try {
			if (id != null) {
				CrmSessionUser user = UserSessionInfo
						.user_getUserOfRequest(request);

				CustomerDTO customer = new CustomerDTO();
				boolean isAdmin = user.getIsAdmin();
				//只查询客服自己的客户
				customer.setMfctyId(id);
				customer.setUserId(user.getUserId());
				if (params == null) {
					params = CustomerParamsDTO.builder();
				}
				CustomerParamsDTO _params = CustomerParamsDTO.builder();
				_params.setIsAdmin(isAdmin);
				VoModel _vo = VoModel.builder();
				_vo.setParams(customer, _params);
				_vo = customerService.findCustomer(_vo);
				List<CustomerDTO> list = (List<CustomerDTO>) _vo.getModel();
				if (list.size() <= 0) {
					map.put("result", ResultDTO.failResult(
							ResultState.ERROR_CODE, "无法获取用户基本信息,或此用户不属于你"));
				} else {
					_vo.setModel(list.get(0));
					CustTraceDTO dto = new CustTraceDTO();
					dto.setCustId(id);
					dto.setUserId(user.getUserId());
					params.setIsAdmin(isAdmin);
					vo = custTraceService.findMemo(vo.setParams(dto, params));
					CustomerBaseDataDTO baseDataDto = new CustomerBaseDataDTO();
					CustomerDTO cust = (CustomerDTO) _vo.getModel();
					baseDataDto.setCustId(cust.getMfctyId());
					baseDataDto.setTime(cust.getRecordTime());
					baseDataDto = customerService
							.findCustomerTransactionInfo(baseDataDto);
					map.put("result", ResultDTO.successResult(_vo));
					map.put("history", ResultDTO.successResult(vo));
					map.put("baseData", ResultDTO.successResult(baseDataDto));
				}
			} else {
				map.put("result", ResultDTO.failResult(ResultState.ERROR_CODE,
						"无法获取到id参数"));
			}
		} catch (Exception e) {
			logger.error("{客户基本信息、客户数据信息、历史记录信息查询失败}" + e.getMessage());
		}
		return dispatch;
	}

	@RequestMapping(value = "memo/add", method = RequestMethod.POST)
	public void addMemo(HttpServletRequest request,
			HttpServletResponse response, CustTraceDTO custTrace,
			CustomerDTO customer) {
		try {
			if (custTrace != null) {
				CrmSessionUser user = UserSessionInfo
						.user_getUserOfRequest(request);

				//只查询客服自己的客户
				custTrace.setUserId(user.getUserId());
				boolean isSuccess = custTraceService.add(custTrace);
				boolean isAdmin = user.getIsAdmin();
				CustomerParamsDTO params = CustomerParamsDTO.builder()
						.setIsAdmin(isAdmin);
				customer.setUserId(user.getUserId());
				VoModel vo = VoModel.builder().setParams(customer, params);
				vo = customerService.findCustomer(vo);
				List<CustomerDTO> list = (List<CustomerDTO>) vo.getModel();
				if (list.size() <= 0) {
					GUtils.responseJson(response, ResultDTO.failResult(
							ResultState.ERROR_CODE, "未找到客户信息，或此客户不属于你"));
				} else {
					//取出新的star
					Integer star = customer.getStar();
					//查询出来的客户信息
					customer = list.get(0);
					//设置star
					customer.setStar(star);
					ResultDTO resultDto = customerService.editCustomer(VoModel
							.builder().setParams(customer, params));
					if (!isSuccess) {
						GUtils.responseJson(response, ResultDTO.failResult(
								ResultState.ERROR_CODE, "登记信息保存失败"));
					} else if (!resultDto.isSuccess()) {
						GUtils.responseJson(response, ResultDTO.failResult(
								ResultState.ERROR_CODE, "登记信息保存成功，但更新star失败"));
					} else {
						GUtils.responseJson(response,
								ResultDTO.successResult("登记信息已保存"));
					}
				}
			} else {
				GUtils.responseJson(response,
						ResultDTO.failResult(ResultState.ERROR_CODE, "无法获取到参数"));
			}
		} catch (Exception e) {
			logger.error("{客户基本信息、客户数据信息、历史记录信息查询失败}" + e.getMessage());
		}
	}

	@Override
	@InitBinder
	protected void initBinder(HttpServletRequest request,
			ServletRequestDataBinder binder) throws Exception {
		DateFormat fmt = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		CustomDateEditor dateEditor = new CustomDateEditor(fmt, true);
		binder.registerCustomEditor(Date.class, dateEditor);
		super.initBinder(request, binder);
	}
}
