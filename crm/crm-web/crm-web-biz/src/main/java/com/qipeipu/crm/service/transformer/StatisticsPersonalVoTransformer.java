package com.qipeipu.crm.service.transformer;

import com.google.common.base.Function;
import com.qipeipu.crm.dtos.statistics.crmAnalyse.StatisticsPersonalEntity;
import com.qipeipu.crm.dtos.statistics.crmAnalyse.StatisticsPersonalVo;

/**
 * Created by Administrator on 2015/5/22.
 */
public class StatisticsPersonalVoTransformer implements Function<StatisticsPersonalEntity, StatisticsPersonalVo> {

    public static final StatisticsPersonalVoTransformer INSTANCE = new StatisticsPersonalVoTransformer();

    @Override
    public StatisticsPersonalVo apply(StatisticsPersonalEntity input) {
        StatisticsPersonalVo out = StatisticsPersonalVo.builder()
                .createMfctyNum(input.getCreateMfctyNum())
                .taskNum(input.getTaskNum())
                .userName(input.getUserName())
                .visitCustNum(input.getVisitCustNum())
                .workDay(input.getWorkDay())
                .workTime(input.getWorkTime())
                .build();
        return out;
    }
}
