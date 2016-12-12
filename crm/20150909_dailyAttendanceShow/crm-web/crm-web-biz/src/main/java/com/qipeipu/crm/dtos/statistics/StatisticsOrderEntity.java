package com.qipeipu.crm.dtos.statistics;

import com.qipeipu.crm.dtos.statistics.storageStructure.StatisticsMfctyEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

import java.util.Map;

/**
 * Created by laiyiyu on 2015/4/16.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class StatisticsOrderEntity {
    /**
     * 总订单数
     */
    private Integer orderNum;
    /**
     * 所有订单总额
     */
    private Double totalOrder;
    /**
     * 注册客户数:汽修厂状态为2的即通过审核，根据筛选条件变化
     */
    private Integer registerNum;
    /**
     * 活跃客户数
     */
    private Integer activateNum;
    /**
     * 激活客户数
     */
    private Integer sensitizeNum;
    /**
     * 交易客户数量
     */
    private Integer transactionNum;
    /**
     * 厂集合
     */
    private Map<String, StatisticsMfctyEntity> statisticsMfctyEntityMap;
}
