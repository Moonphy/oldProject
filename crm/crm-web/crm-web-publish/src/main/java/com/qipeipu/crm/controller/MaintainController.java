package com.qipeipu.crm.controller;

import com.qipeipu.crm.dtos.global.ResultDTO;
import com.qipeipu.crm.dtos.global.ResultState;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.visit.CustMaintainEntity;
import com.qipeipu.crm.service.user.MaintainService;
import com.qipeipu.crm.utils.bean.tools.GUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletResponse;
import java.util.Collections;
import java.util.List;

/**
 * Created by laiyiyu on 2015/4/14.
 */
@Controller
@Slf4j
@RequestMapping(value = "base/maintain")
public class MaintainController {

    private static final Logger logger = Logger
            .getLogger(MaintainController.class);

    @Autowired
    private MaintainService maintainService;


    @RequestMapping(value = "find/all", method = RequestMethod.GET)
    public String getAllUserPhone(VoModel<?, ?> vo, String key, Integer mfctyID, ModelMap map) {
        String dispatch = "mobile/dev/list";
        map.put("key", key);
        map.put("mfctyID", mfctyID);
        try {
            if (vo != null) {
                maintainService.getMaintainList(key, mfctyID, vo);
                map.put("result", ResultDTO.successResult(vo));

            } else {
                map.put("result", ResultDTO.failResult(ResultState.ERROR_CODE, "无法获取到参数"));
            }
        } catch (Exception e) {
            logger.error("{维护信息列表信息查询失败}", e);
        }
        return dispatch;
    }

    @RequestMapping(value = "find", method = RequestMethod.GET)
    public String getUserPhoneByID( Integer custID, ModelMap map) {

        String dispatch = "mobile/dev/edit";
        try {
            if (custID != null) {

                List<CustMaintainEntity> custMaintainEntityList = maintainService.getCustMainByCustID(custID);
                if (custMaintainEntityList == null) {
                    custMaintainEntityList = Collections.EMPTY_LIST;
                }
                map.put("result", ResultDTO.successResult(custMaintainEntityList));
            } else {
                map.put("result", ResultDTO.failResult(ResultState.ERROR_CODE,
                        "无法获取到id参数"));
            }
        } catch (Exception e) {
            logger.error("{维护信息查询失败}" + e.getMessage());
        }
        return dispatch;
    }

    @RequestMapping(value = "update", method = RequestMethod.POST)
    public void updateUserPhone(Integer maintainUserID, String maintainTime, Integer developUserID, String developTime, Integer custID, HttpServletResponse response){
        try {
            int updateState = maintainService.updateMaintain(maintainUserID, maintainTime, developUserID, developTime, custID);
            if(updateState!=0){
                GUtils.responseJson(response,ResultDTO.successResult("维护信息更改成功"));
            }else if (updateState == -1) {
                logger.error("维护信息更改失败，custId="+custID);
                GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "维护信息更改失败"));
            }
        } catch (Exception e) {
            logger.error("{维护信息更改失败}" + e.getMessage());
            GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "维护信息更改失败"));
        }
    }


}
