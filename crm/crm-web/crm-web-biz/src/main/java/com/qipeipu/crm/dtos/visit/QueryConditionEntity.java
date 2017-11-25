package com.qipeipu.crm.dtos.visit;

import lombok.Data;

import java.util.List;

/**
 * Created by laiyiyu on 2015/4/2.
 */

@Data

public class QueryConditionEntity {

    private boolean isAuthority;


    private Integer provinceID;

    private Integer cityID;


    private Integer areaID;

    private Integer mfctyID;

    List<Integer> mfctyIDList;

    List<String> qpuUserIDList;

}
