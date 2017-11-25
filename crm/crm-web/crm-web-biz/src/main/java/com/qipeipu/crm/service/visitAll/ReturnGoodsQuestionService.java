package com.qipeipu.crm.service.visitAll;

import com.qipeipu.crm.dtos.visit.PlatTypeEntity;
import com.qipeipu.crm.dtos.visit.ReturnGoodsQuestionEntity;

import java.util.List;

/**
 * Created by laiyiyu on 2015/3/26.
 */
public interface ReturnGoodsQuestionService {


    /**
     *  returnGoodsID，查询退货问题
     * @param returnGoodsID
     * @return
     */
    public List<ReturnGoodsQuestionEntity> getReturnGoodsQuestionByReturnGoodsID( Integer returnGoodsID);


    /**
     * 新建退货问题
     * @param returnGoodsQuestionEntity
     * @returnr
     */

    public int createsReturnGoodsQuestion(ReturnGoodsQuestionEntity returnGoodsQuestionEntity);


    /**
     * 删除平台问题
     * @param returnGoodsID
     * @return
     */
    public int delReturnGoodsQuestion(Integer returnGoodsID);


    /**
     * 获取退货类型实体
     * @return
     */
    public List<PlatTypeEntity> getAllPlatType();
}
