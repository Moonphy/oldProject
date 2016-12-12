package com.qipeipu.crm.dtos.statistics;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

/**
 * Created by laiyiyu on 2015/4/16.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class StatisticsAllEntity {
    /**
     * 统计订单情况实体
     */
    private StatisticsOrderEntity statisticsOrderEntity;
    /**
     * 统计询单情况实体
     */
    private StatisticsInqueryEntity statisticsInqueryEntity;
}
