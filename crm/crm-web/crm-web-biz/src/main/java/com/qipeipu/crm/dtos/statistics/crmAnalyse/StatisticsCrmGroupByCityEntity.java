package com.qipeipu.crm.dtos.statistics.crmAnalyse;

import com.qipeipu.crm.dtos.basedata.CityDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

/**
 * Created by laiyiyu on 2015/5/18.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class StatisticsCrmGroupByCityEntity {

    private CityDTO cityDTO;

    private StatisticsCrmEntity statisticsCrmEntity;


}
