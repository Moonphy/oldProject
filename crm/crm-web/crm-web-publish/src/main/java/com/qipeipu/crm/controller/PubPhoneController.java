package com.qipeipu.crm.controller;

import com.qipeipu.crm.dtos.global.ResultDTO;
import com.qipeipu.crm.dtos.global.ResultState;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.phone.PublicPhoneEntity;
import com.qipeipu.crm.service.phone.PubPhoneService;
import com.qipeipu.crm.utils.bean.tools.GUtils;
import com.qipeipu.crm.wx.util.TimeUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

/**
 * Created by laiyiyu on 2015/4/14.
 */
@Slf4j
@Controller
@RequestMapping(value = "base/pubPhone")
public class PubPhoneController {

    @Autowired
    private PubPhoneService pubPhoneService;

    @RequestMapping(value = "find/pub/all", method = RequestMethod.GET)
    public String getAllPubPhone(HttpServletRequest request,
                               ModelMap map, VoModel<?, ?> vo, String key) {
        String dispatcher = "mobile/commonNo/list";
        pubPhoneService.getAllPubPhoneByParamsSql(key, vo);
        map.put("result", ResultDTO.successResult(vo));
        map.put("key", key);
        return dispatcher;
    }


    @RequestMapping(value = "find/pub", method = RequestMethod.GET)
    public String getPubPhoneByID(HttpServletRequest request,
                                ModelMap map,
                                Integer id) {
        String dispatcher = "mobile/commonNo/create";
        List<PublicPhoneEntity> publicPhoneEntityList = pubPhoneService
                .getPubPhoneByID(id);
        ResultDTO result;
        if (publicPhoneEntityList != null && publicPhoneEntityList.size()>0) {
            result = ResultDTO.successResult(publicPhoneEntityList.get(0));
        }else{
            result = ResultDTO.successResult(null);
        }
        map.put("result", result);
        map.put("flag","edit");
        return dispatcher;
    }


    @RequestMapping(value = "create/pubPhone", method = RequestMethod.POST)
    public String createPubPhone(HttpServletRequest request, ModelMap map, PublicPhoneEntity publicPhoneEntity){
        String dispatcher = "mobile/commonNo/create";
        ResultDTO result;
        String contactMan = publicPhoneEntity.getContactMan();
        String phoneNo = publicPhoneEntity.getPhoneNo();
        String currentTime = TimeUtil.getCurrentTime();

        if(GUtils.isEmptyOrNull(contactMan)){
            result = ResultDTO.failResult(ResultState.ERROR_CODE, "联系人名称不能为空");
        }else if(GUtils.isEmptyOrNull(phoneNo)) {
            result = ResultDTO.failResult(ResultState.ERROR_CODE, "联系人号码不能为空");
        }else{
            publicPhoneEntity.setCreateTime(currentTime);
            int insertState = pubPhoneService.createPubPhone(publicPhoneEntity);
            if(insertState==0){
                result = ResultDTO.failResult(ResultState.ERROR_CODE, "公共号码添加失败");
            }else{
                result = ResultDTO.successResult(ResultState.SUCCESS_CODE, "公共号码添加成功");
            }
        }
        result.setModel(publicPhoneEntity);
        map.put("result",result);
        return dispatcher;
    }

    @RequestMapping(value = "edit/pubPhone", method = RequestMethod.POST)
    public String updatePubPhone(HttpServletRequest request, ModelMap map, PublicPhoneEntity publicPhoneEntity){
        String dispatcher = "mobile/commonNo/create";
        ResultDTO result;
        String contactMan = publicPhoneEntity.getContactMan();
        String phoneNo = publicPhoneEntity.getPhoneNo();
        String currentTime = TimeUtil.getCurrentTime();

        if(GUtils.isEmptyOrNull(contactMan)){
            result = ResultDTO.failResult(ResultState.ERROR_CODE, "联系人名称不能为空");
        }else
        if(GUtils.isEmptyOrNull(phoneNo)) {
            result = ResultDTO.failResult(ResultState.ERROR_CODE, "联系人号码不能为空");
        }else{
            publicPhoneEntity.setUpdateTime(currentTime);
            int updateState = pubPhoneService.updatePubPhone(publicPhoneEntity);
            if(updateState==0){
                result = ResultDTO.failResult(ResultState.ERROR_CODE, "公共号码更改失败");
            }else{
                result = ResultDTO.successResult(ResultState.SUCCESS_CODE, "公共号码更改成功");
            }
        }
        result.setModel(publicPhoneEntity);
        map.put("result",result);
        map.put("flag","edit");
        return dispatcher;
    }

    @RequestMapping(value = "del", method = RequestMethod.GET)
    public void delPubPhone(HttpServletRequest request,HttpServletResponse response, ModelMap map, Integer id){
        try {
            if (id == null) {
                GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "无法获取到参数", id));
            } else {
                int insertState = pubPhoneService.delPub(id);
                if (insertState <= 0) {
                    GUtils.responseJson(response,ResultDTO.failResult(ResultState.ERROR_CODE,
                            "公共号码删除失败", id));
                } else {
                    GUtils.responseJson(response,ResultDTO.successResult("公共号码删除成功"));
                }
            }
        } catch (Exception e) {
            log.error("{公共号码删除失败}" + e.getMessage());
        }
    }

}
