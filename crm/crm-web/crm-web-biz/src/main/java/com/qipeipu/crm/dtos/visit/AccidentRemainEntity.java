package com.qipeipu.crm.dtos.visit;

import lombok.Data;

import java.util.List;

/**
 * Created by laiyiyu on 2015/3/27.
 */
@Data
public class AccidentRemainEntity {

    private Integer taskID;

    private String preBuyTime;

    private String mfctyName;


    private Integer allNum;


    private List<AccidentCarEntity> accidentCarEntityList;















}
