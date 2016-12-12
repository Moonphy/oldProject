package com.qipeipu.crm.dtos.statistics.crmAnalyse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

import java.util.List;

/**
 * Created by laiyiyu on 2015/4/22.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class StatisticsCrmEntity {
    /**
     * 使用crm总人数
     */
    private int totalUseCrm;
    /**
     * 总任务数
     */
    private int totalTaskNum;
    /**
     * 总拜访数
     */
    private int totalVisitNum;
    /**
     * 总建厂数
     */
    private int totalCreateNum;
    /**
     * 个人拜访信息集合
     */
    private List<StatisticsPersonalEntity> personalEntityList;
}
