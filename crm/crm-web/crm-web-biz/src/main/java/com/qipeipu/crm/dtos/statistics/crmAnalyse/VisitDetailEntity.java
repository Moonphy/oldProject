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
public class VisitDetailEntity {
    /**
     * 拜访id
     */
    private Integer visitID;
    /**
     * 任务id
     */
    private Integer taskID;
    /**
     * 用户id
     */
    private Integer userID;
    /**
     * 用户名称
     */
    private String userName;
    /**
     * 厂名
     */
    private String mfctyName;
    /**
     * 拜访时间
     */
    private String enterTime;
    /**
     * 离店时间
     */
    private String leaveTime;
    /**
     * 拜访内容
     */
    private String content;
    /**
     * 是否有事故车
     */
    private boolean hasAccidentCar;
    /**
     * 事故车统计集合
     */
    private List<StatisticsAccidentEntity> accidentEntityList;
}
