package com.qipeipu.crm.controller;

import com.baturu.trade.inquiry.dtos.InquiryDTO;
import com.baturu.trade.inquiry.dtos.InquiryFillingParam;
import com.baturu.trade.inquiry.service.InquiryQueryService;
import com.google.common.collect.Lists;
import com.qipeipu.crm.dtos.customer.CustomerBaseDataDTO;
import com.qipeipu.crm.dtos.global.ResultDTO;
import com.qipeipu.crm.dtos.global.ResultState;
import com.qipeipu.crm.dtos.main.inquiry.dto.InquiryInCSDTO;
import com.qipeipu.crm.dtos.main.order.dto.OrderInCSDTO;
import com.qipeipu.crm.service.customer.CustomerService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.ServletRequestDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.mvc.SimpleFormController;

import javax.servlet.http.HttpServletRequest;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * 单据相关
 * Created by johnkim on 15-2-11.
 */
@Slf4j
@Controller
@RequestMapping(value = "bill")
public class BillController extends SimpleFormController {

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(BillController.class);

    @Autowired
    private CustomerService customerService;
    @Autowired
    private InquiryQueryService inquiryQueryService;

    @RequestMapping(value = "history/inquiry", method = RequestMethod.GET)
    public String findHistoryInquiry(HttpServletRequest request, ModelMap map, CustomerBaseDataDTO dto) {
        String dispatch = "history/inquiry";
        String msg = null;
        int state = -1;
        try {
            if (dto == null) {
                msg = "无法获取到参数";
            } else if (dto.getIsNew()==null) {
                msg = "参数isNew丢失";
            } else {
                List<InquiryInCSDTO> list = customerService.findInquiryInfo(dto);
                if (list != null) {
                    state = 0;
                    map.put("params",dto);//参数信息
                    map.put("result", ResultDTO.successResult(list));
                }else{
                    msg = "查询数据失败";
                }
            }
            if(state==-1){
                map.put("result", ResultDTO.failResult(ResultState.ERROR_CODE, msg, dto));
            }
        } catch (Exception e) {
            logger.error("{询价记录详情信息}{}",e.getMessage());
        }
        return dispatch;
    }

    @RequestMapping(value = "history/business", method = RequestMethod.GET)
    public String findHistoryBusiness(HttpServletRequest request, ModelMap map, CustomerBaseDataDTO dto) {
        String dispatch = "history/business";
        String msg = null;
        int state = -1;
        try {
            if (dto == null) {
                msg = "无法获取到参数";
            } else if (dto.getIsNew()==null) {
                msg = "参数isNew丢失";
            } else {
                List<OrderInCSDTO> list = customerService.findOrderInfo(dto);
                if (list != null) {
                    state = 0;
                    map.put("params",dto);//参数信息
                    map.put("result", ResultDTO.successResult(list));
                }else{
                    msg = "查询数据失败";
                }
            }
            if(state==-1){
                map.put("result", ResultDTO.failResult(ResultState.ERROR_CODE, msg, dto));
            }
        } catch (Exception e) {
            logger.error("{交易记录详情信息}{}",e.getMessage());
        }
        return dispatch;
    }

    /***
     * 返回询价单详细信息
     * @param inquiryId 客户汽修厂Id
     * @memo ajax
     */
    @RequestMapping(value = "inquiryInfo", method = RequestMethod.GET)
    public String getInquiryInfo(HttpServletRequest request,ModelMap map,Integer inquiryId) {
        InquiryDTO inquiryDto = null;
        //调用tread服务查询
        List<Integer> inquiryIdList = new ArrayList<Integer>();
        inquiryIdList.add(inquiryId);
        InquiryFillingParam inquiryFillingParam= new InquiryFillingParam();
        inquiryFillingParam.setNeedCarType(true);
        inquiryFillingParam.setNeedInquiryDetail(true);
        inquiryFillingParam.setNeedUserInfo(true);
        List<InquiryDTO> inquiryDTOList= Lists.newArrayList(inquiryQueryService.findInquiriesByIds(inquiryIdList, inquiryFillingParam));
        if(inquiryDTOList.size()>0){
            inquiryDto=inquiryDTOList.get(0);
        }
        ResultDTO result= ResultDTO.failResult(ResultState.ERROR_CODE,"查询询价信息出错");
        if(inquiryDto!=null){
            result = ResultDTO.successResult(inquiryDto);
        }
        map.put("result",result);
        return "history/detail/inquiry";
    }

    @InitBinder
    protected void initBinder(HttpServletRequest request,
                              ServletRequestDataBinder binder) throws Exception {
        DateFormat fmt = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        CustomDateEditor dateEditor = new CustomDateEditor(fmt, true);
        binder.registerCustomEditor(Date.class, dateEditor);
        super.initBinder(request, binder);
    }
}
