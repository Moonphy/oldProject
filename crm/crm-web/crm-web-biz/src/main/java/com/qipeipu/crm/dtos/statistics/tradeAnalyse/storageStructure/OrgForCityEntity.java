package com.qipeipu.crm.dtos.statistics.tradeAnalyse.storageStructure;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

/**
 * Created by laiyiyu on 2015/4/28.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class OrgForCityEntity {
    private String mfctyID;

    private Integer cityID;

    private String cityName;
}
