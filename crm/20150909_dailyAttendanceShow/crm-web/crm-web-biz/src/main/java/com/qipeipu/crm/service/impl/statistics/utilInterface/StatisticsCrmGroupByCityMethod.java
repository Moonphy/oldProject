package com.qipeipu.crm.service.impl.statistics.utilInterface;

import com.qipeipu.crm.dtos.basedata.CityDTO;
import com.qipeipu.crm.service.statistics.param.AreaConditionEntity;

import java.util.Collection;
import java.util.Map;

/**
 * Created by laiyiyu on 2015/5/18.
 */
public interface StatisticsCrmGroupByCityMethod {
    public Map<CityDTO, Collection<Integer>> cityToUserIDsMapGroupBy(AreaConditionEntity areaCondition);
}
