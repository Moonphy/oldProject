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
public class StatisticsInqueryEntity {
    /**
     * 总询价单数
     */
    private Integer inqueryAllNum;
    /**
     * 询价单转订单数
     */
    private Integer inqueryToOrderNum;
    /**
     * 询价单转订单比 （inqueryAllNum:inqueryToOrderNum）
     */
    private Double inqueryToOrderRatio;
    /**
     * 厂集合
     */
    Map<String, StatisticsMfctyEntity> statisticsMfctyEntityMap;
}
