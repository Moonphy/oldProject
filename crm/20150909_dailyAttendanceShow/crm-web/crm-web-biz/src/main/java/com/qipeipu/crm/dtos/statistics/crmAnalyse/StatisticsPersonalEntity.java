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
public class StatisticsPersonalEntity {
    /**
     * 用户id
     */
    private Integer userID;
    /**
     * 用户名
     */
    private String userName;
    /**
     * 所在地区
     */
    private String area;
    /**
     * 拜访客户数
     */
    private int visitCustNum;
    /**
     * 任务数
     */
    private int taskNum;
    /**
     * 是否使用crm：visitCustNum>1
     */
    private boolean isUserCrm;
    /**
     * 工作天数
     */
    private int workDay;
    /**
     * 工作时长
     */
    private String workTime;
    /**
     * 工作时长:毫秒数
     */
    private long workTimeForLong;
    /**
     * 建厂数
     */
    private int createMfctyNum;
    /**
     * 拜访详情集合
     */
    List<VisitDetailEntity> visitDetailEntityList;
}
