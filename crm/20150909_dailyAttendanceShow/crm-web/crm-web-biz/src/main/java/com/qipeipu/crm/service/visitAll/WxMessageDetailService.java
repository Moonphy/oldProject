package com.qipeipu.crm.service.visitAll;

import com.qipeipu.crm.dtos.visit.AccidentCarEntity;
import com.qipeipu.crm.dtos.visit.WxMessageDetailEntity;

import java.util.List;

/**
 * Created by laiyiyu on 2015/3/26.
 */
public interface WxMessageDetailService {


    /**
     * 获取指定信息详情
     * @param visitID
     * @return
     */
    public List<WxMessageDetailEntity> getDetailByVisitID(Integer visitID);

    /**
     * 删除详细信息详情
     * @param visitID
     * @return
     */
    public int delDetailMessage(Integer visitID);


    /**
     * 批量插入事故车辆
     * @param accidentCarEntityList
     * @return
     */
    public int batchInsertAccidentCar(List<AccidentCarEntity> accidentCarEntityList);


    /**
     * 创建信息详情
     * @param wxMessageDetailEntity
     * @return
     */
    public int insertMessageDetail(WxMessageDetailEntity wxMessageDetailEntity, Integer userID);


    /**
     * 获取拜访数
     * @param taskID
     * @return
     */
    public Integer getVisitCount(Integer taskID);


}
