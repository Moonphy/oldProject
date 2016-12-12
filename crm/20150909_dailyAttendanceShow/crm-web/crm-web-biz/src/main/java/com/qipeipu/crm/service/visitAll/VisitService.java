package com.qipeipu.crm.service.visitAll;

import com.qipeipu.crm.dtos.visit.*;

import java.util.List;

/**
 * Created by laiyiyu on 2015/3/24.
 */
public interface VisitService {

    /**
     * 根据id，获取对应的用户基本信息
     * @param id
     * @return
     */
    public List<CustomerBasedDTO> getCustomerBasedByID(Integer id);


    /**
     * 获取业务信息
     * @param custID
     * @return
     */
    public List<BusinessMessageEntity> getBusinessMessageByID(Integer custID);

    /**
     * 根据任务id获取全部的平台问题
     * @param taskID
     * @return
     */
    public List<PlatformQuestionEntity> getAllPlatformQuestionByTaskID(Integer taskID);


    /**
     * 获取退货问题列表
     * @param taskID
     * @return
     */
    public List<ReturnGoodsQuestionEntity> getAllReturnGoodsQuestionByTaskID(Integer taskID);


    /**
     * 获取详细信息列表
     * @param taskID
     * @return
     */
    public List<WxMessageDetailDTO> getAllWxMessageDetailList(Integer taskID);

}
