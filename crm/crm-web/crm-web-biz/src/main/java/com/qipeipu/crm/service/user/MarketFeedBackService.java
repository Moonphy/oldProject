package com.qipeipu.crm.service.user;

import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.user.MarketFeedBackEntity;
import com.qipeipu.crm.dtos.visit.PlatTypeEntity;

import java.util.List;

/**
 * Created by laiyiyu on 2015/4/13.
 */
public interface MarketFeedBackService {

    public void getMarketFeedBackList(Integer userID, VoModel<?, ?> vo);

    /**
     *  根据feedBackID，查询指定平台回馈的问题
     * @param feedBackID
     * @return
     */
    public List<MarketFeedBackEntity> getMarketFeedBackByFeedBackID( Integer feedBackID);


    /**
     * 新建平台问题
     * @param marketFeedBackEntity
     * @return
     */

    public int createMarketFeedBack(MarketFeedBackEntity marketFeedBackEntity);


    /**
     * 删除人员平台问题
     * @param feedBackID
     * @return
     */
    public int delMarketFeedBack(Integer feedBackID);


    /**
     * 获取平台类型实体
     * @return
     */
    public List<PlatTypeEntity> getAllPlatType();
}
