package com.qipeipu.crm.dtos.statistics.crmAnalyse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

/**
 * Created by laiyiyu on 2015/5/8.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class StatisticsCrmGroupByModelEntity<T> {

    private T groupByModel;

    private StatisticsCrmEntity statisticsCrmEntity;
}
