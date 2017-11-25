package com.qipeipu.crm.dtos.basedata;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

/**
 * Created by laiyiyu on 2015/4/24.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class AreaDetailEntity {

    private Integer areaID;

    private String areaName;

    private Integer cityID;

    private String cityName;

    private Integer provinceID;

    private String provinceName;
}
