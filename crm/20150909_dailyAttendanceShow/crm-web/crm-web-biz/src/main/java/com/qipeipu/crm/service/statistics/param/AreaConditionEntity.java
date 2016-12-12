package com.qipeipu.crm.service.statistics.param;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

/**
 * Created by laiyiyu on 2015/4/16.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class AreaConditionEntity {

    private Integer areaID;

    private Integer cityID;

    private Integer provinceID;
}
