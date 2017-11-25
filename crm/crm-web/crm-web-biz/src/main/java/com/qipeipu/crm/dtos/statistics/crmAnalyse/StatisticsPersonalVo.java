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
public class StatisticsPersonalVo {
    /**
     * 用户名
     */
    private String userName;
    /**
     * 任务数
     */
    private int taskNum;
    /**
     * 拜访客户数
     */
    private int visitCustNum;
    /**
     * 建厂数
     */
    private int createMfctyNum;
    /**
     * 工作天数
     */
    private int workDay;
    /**
     * 工作时长
     */
    private String workTime;
}
