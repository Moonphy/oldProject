package com.qipeipu.crm.dtos.statistics.storageStructure;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

import java.util.List;

/**
 * Created by laiyiyu on 2015/4/17.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class StatisticsInqueryMainEntity {
    /**
     * 询价单id
     */
    private Integer inquiryID;
    /**
     * 询价单号
     */
    private String inquiryNo;
    /**
     * 车型id;
     */
    private Integer carTypeID;
    /**
     * 客服id, 一个orgid(厂id对多个客服id)
     */
    private String userID;
    /**
     * 询单状态
     */
    private Integer status;
    /**
     * 发布时间
     */
    private String publishTime;
    /**
     * 询单明细集合
     */
    private List<StatisticsOrderDetailEntity> statisticsOrderDetailEntityList;
}
