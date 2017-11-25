package com.qipeipu.crm.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.qipeipu.crm.constant.CouponConst;
import com.qipeipu.crm.dtos.customer.CouponEntity;
import com.qipeipu.crm.dtos.customer.CouponTotalEntity;
import com.qipeipu.crm.dtos.customer.OrgForCouponEntity;
import com.qipeipu.crm.dtos.global.ResultDTO;
import com.qipeipu.crm.dtos.global.ResultState;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.user.UserDTO;
import com.qipeipu.crm.service.base.CouponTypeService;
import com.qipeipu.crm.service.customer.CouponService;
import com.qipeipu.crm.session.UserSessionInfo;
import com.qipeipu.crm.session.bean.CrmSessionUser;
import com.qipeipu.crm.utils.bean.tools.GUtils;
import com.qipeipu.crm.wx.util.ExceptionUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.beanutils.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by laiyiyu on 2015/6/2.
 */
@Slf4j
@Controller
@RequestMapping(value = "coupon")
public class CouponController {

    @Autowired
    private CouponService couponService;

    @RequestMapping(value = "find/list", method = RequestMethod.GET)
    public void findOrgForCouponList(HttpServletResponse response, VoModel vo, String key){
        try {
            couponService.getCouponForMfctyList(key, vo);
            GUtils.responseJson(response, ResultDTO.successResult(vo));
        }catch (Exception e){
            log.error(ExceptionUtil.getStackMsg(e));
            GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "error"));
        }
    }

    //查询该汽修厂的优惠券统计
    @RequestMapping(value = "find/specif", method = RequestMethod.GET)
    public void findCouponByID(HttpServletResponse response, String orgID){
        try {
            OrgForCouponEntity orgForCouponEntity = couponService.getOrgForCouponDetailByMfctyID(orgID);
            GUtils.responseJson(response, ResultDTO.successResult(orgForCouponEntity));
        }catch (Exception e){
            log.error(ExceptionUtil.getStackMsg(e));
            GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "error"));
        }
    }

    //更新该汽修厂的优惠券（按优惠券统计数据）
    @RequestMapping(value = "edit/coupon", method = RequestMethod.POST)
    public void editCouponByID(HttpServletRequest request, HttpServletResponse response, String totoalCoupons, String orgID){
        try {
            //输入初始化
            List<CouponTotalEntity> couponTotalEntities = new ArrayList<>();
            JSONArray accidentCarsArr = JSON.parseArray(totoalCoupons);
            for(int i=0;i<accidentCarsArr.size();i++){
                JSONObject jo = (JSONObject) accidentCarsArr.get(i);
                double money = Double.parseDouble((String)jo.get("money")) ;
                int unUsedNum = Integer.parseInt((String) jo.get("unUsedNum")) ;
                String createTime = (String) jo.get("createTime") ;
                String expiryDate = (String) jo.get("expiryDate") ;
                CouponTotalEntity couponTotalEntity = CouponTotalEntity.builder()
//                        .mfctyID(orgID)
                        .unUsedNum(unUsedNum)
                        .money(money)
                        .createTime(createTime)
                        .expiryDate(expiryDate)
                        .build();
                couponTotalEntities.add(couponTotalEntity);
            }

            //获取操作人员信息
            UserDTO user = new UserDTO() ;
            BeanUtils.copyProperties(user , UserSessionInfo.user_getUserOfRequest(request));

            //操作前记录
            List<CouponEntity> oldCouponEntities = couponService.findUnusedCouponsByMfctyID(orgID) ;
            //更新
            couponService.updateOrgForCouponDetail(orgID, couponTotalEntities);
            //操作后记录
            List<CouponEntity> newCouponEntities = couponService.findUnusedCouponsByMfctyID(orgID) ;

            //系统操作日志记录录入
            couponService.addEditOperationInfo2SysLog(user, orgID , oldCouponEntities , newCouponEntities) ;

            GUtils.responseJson(response, ResultDTO.successResult(ResultState.SUCCESS_CODE));
        }catch (Exception e){
            log.error(ExceptionUtil.getStackMsg(e));
            GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "error"));
        }
    }

    @RequestMapping(value = "edit/resetCoupon", method = RequestMethod.GET)
    public void resetCoupon(HttpServletRequest request, HttpServletResponse response, String orgID){
        try {
            if(couponService.isValidReset(orgID)) {
                //获取操作人员信息
                UserDTO user = new UserDTO() ;
                BeanUtils.copyProperties(user , UserSessionInfo.user_getUserOfRequest(request));

                //操作前记录
                List<CouponEntity> oldCouponEntities = couponService.findUnusedCouponsByMfctyID(orgID) ;
                //更新
                couponService.resetCoupon(orgID);
                //操作后记录
                List<CouponEntity> newCouponEntities = couponService.findUnusedCouponsByMfctyID(orgID) ;

                //系统操作日志记录录入
                couponService.addEditOperationInfo2SysLog(user, orgID , oldCouponEntities , newCouponEntities) ;

                GUtils.responseJson(response, ResultDTO.successResult("重置成功"));
            }else{
                GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "无法重置"));
            }
        }catch (Exception e){
            log.error(ExceptionUtil.getStackMsg(e));
            GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "error"));
        }
    }

    //暂时给一个入口来看操作日志记录

}
