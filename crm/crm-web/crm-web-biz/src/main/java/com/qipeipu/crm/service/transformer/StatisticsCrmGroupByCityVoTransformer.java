package com.qipeipu.crm.service.transformer;

import com.google.common.base.Function;
import com.qipeipu.crm.dtos.statistics.crmAnalyse.StatisticsCrmGroupByCityEntity;
import com.qipeipu.crm.dtos.statistics.crmAnalyse.StatisticsCrmGroupByCityVo;

/**
 * Created by laiyiyu on 2015/5/22.
 */
public class StatisticsCrmGroupByCityVoTransformer implements Function<StatisticsCrmGroupByCityEntity, StatisticsCrmGroupByCityVo> {

    public static final StatisticsCrmGroupByCityVoTransformer INSTANCE = new StatisticsCrmGroupByCityVoTransformer();

    @Override
    public StatisticsCrmGroupByCityVo apply(StatisticsCrmGroupByCityEntity input) {
        StatisticsCrmGroupByCityVo out = StatisticsCrmGroupByCityVo.builder()
                .cityName(input.getCityDTO().getCityName())
                .totalCreateNum(input.getStatisticsCrmEntity().getTotalCreateNum())
                .totalTaskNum(input.getStatisticsCrmEntity().getTotalTaskNum())
                .totalUseCrm(input.getStatisticsCrmEntity().getTotalUseCrm())
                .totalVisitNum(input.getStatisticsCrmEntity().getTotalVisitNum())
                .build();
        return out;
    }
}
