package com.qipeipu.crm.service.impl.statistics.utilInterface;

import com.qipeipu.crm.dtos.basedata.CityDTO;
import com.qipeipu.crm.service.statistics.param.AreaConditionEntity;

import java.util.List;
import java.util.Map;

/**
 * Created by laiyiyu on 2015/4/29.
 */
public interface StatisticsMfctyGroupByCityMethod {
    public Map<CityDTO, List<Integer>> cityToMfctyIDsMapGroupBy(AreaConditionEntity areaCondition);

    public List<Integer> cityToMfctyIDs(AreaConditionEntity areaCondition);
}
