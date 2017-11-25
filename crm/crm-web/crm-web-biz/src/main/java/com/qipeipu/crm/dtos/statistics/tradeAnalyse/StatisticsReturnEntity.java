package com.qipeipu.crm.dtos.statistics.tradeAnalyse;

import com.qipeipu.crm.dtos.statistics.tradeAnalyse.storageStructure.StatisticsMfctyEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

import java.util.Map;

/**
 * Created by laiyiyu on 2015/4/20.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class StatisticsReturnEntity {
    /**
     * 总退单数
     */
    private int totalChargebackNum;
    /**
     * 退单总金额
     */
    private double totalChargeback;
    /**
     * 厂集合
     */
    private Map<String, StatisticsMfctyEntity> statisticsMfctyEntityMap;
}
