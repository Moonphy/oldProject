package com.qipeipu.crm.service.visitAll;

import com.qipeipu.crm.dtos.visit.PlatTypeEntity;
import com.qipeipu.crm.dtos.visit.PlatformQuestionEntity;

import java.util.List;

/**
 * Created by laiyiyu on 2015/3/25.
 */
public interface WxPlatFormQuestionService {

    /**
     *  根据feedBackID，查询指定平台回馈的问题
     * @param feedBackID
     * @return
     */
    public List<PlatformQuestionEntity> getPlatformQuestionByFeedBackID( Integer feedBackID);


    /**
     * 新建平台问题
     * @param platformQuestionEntity
     * @return
     */

    public int createPlatFormQuestion(PlatformQuestionEntity platformQuestionEntity);


    /**
     * 删除平台问题
     * @param feedBackID
     * @return
     */
    public int delPlatFormQuestion(Integer feedBackID);


    /**
     * 获取平台类型实体
     * @return
     */
    public List<PlatTypeEntity> getAllPlatType();
}
