package com.qipeipu.crm.dtos.statistics.crmAnalyse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

/**
 * Created by laiyiyu on 2015/5/22.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class StatisticsCrmGroupByCityVo {
    /**
     * 城市
     */
    private String cityName;
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
}
