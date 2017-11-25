package com.qipeipu.crm.dtos.statistics;

import com.qipeipu.crm.dtos.statistics.storageStructure.StatisticsMfctyEntity;
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
    private Integer totalChargebackNum;
    /**
     * 退单总金额
     */
    private Double totalChargeback;
    /**
     * 厂集合
     */
    private Map<String, StatisticsMfctyEntity> statisticsMfctyEntityMap;
}
