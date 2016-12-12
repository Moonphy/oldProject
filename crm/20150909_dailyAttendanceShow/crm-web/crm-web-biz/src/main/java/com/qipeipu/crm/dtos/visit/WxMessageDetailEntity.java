package com.qipeipu.crm.dtos.visit;

import lombok.Data;

import java.util.List;

/**
 * Created by laiyiyu on 2015/3/26.
 */
@Data
public class WxMessageDetailEntity {

    /**
     * 拜访Id
     */
    private Integer visitID;


    private Integer taskID;

    /**
     * 拜访时间
     */
    private String enterTime;



    private Integer visitFrequency;


    private String people;

    private String content;

    private String leaveTime;

    private String createTime;


    private String updateTime;

    private Integer userID;

    private List<AccidentCarEntity> accidentCarEntityList;



}
