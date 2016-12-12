package com.qipeipu.crm.dtos.visit;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

/**
 * Created by laiyiyu on 2015/3/26.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class AccidentCarEntity {

    /**
     * 事故车Id
     */
    private Integer accidentCarID;


    private Integer taskID;


    private String carType;


    private Integer num;


    private String preBuyTime;

    private Integer state;

    private String createTime;


    private String updateTime;







}
