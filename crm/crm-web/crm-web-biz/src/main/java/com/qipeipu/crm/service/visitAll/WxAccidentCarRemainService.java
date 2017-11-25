package com.qipeipu.crm.service.visitAll;

import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.visit.AccidentRemainEntity;

import java.util.List;

/**
 * Created by laiyiyu on 2015/3/27.
 */

public interface WxAccidentCarRemainService {


    /**
     * 用户获取当天事故车提醒列表
     * @param userID
     * @return
     */
    public void getCurrentRemain(Integer userID, String searchKey, VoModel<?, ?> vo);


    public List<AccidentRemainEntity> getAccidentCarDetailList(Integer taskID);


    /**
     * 获取事故车列表
     * @param userID
     * @param searchKey
     * @param vo
     */
    public void getRemainCarList( Integer userID, String searchKey, VoModel<?, ?> vo);


    /**
     * 事故车改为已读状态
     * @param accidentCarID
     * @return
     */
    public Integer readAccidentCar(Integer accidentCarID);


    /**
     * 事故车提醒
     * @param userID
     * @return
     */
    public Integer hasNewAccidentCar(Integer userID);




}
