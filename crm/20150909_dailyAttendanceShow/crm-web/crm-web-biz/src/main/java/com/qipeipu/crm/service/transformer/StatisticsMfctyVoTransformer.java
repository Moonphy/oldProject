package com.qipeipu.crm.service.transformer;

import com.google.common.base.Function;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.StatisticsMfctyVo;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.storageStructure.StatisticsMfctyEntity;

/**
 * Created by laiyiyu on 2015/5/22.
 */
public class StatisticsMfctyVoTransformer implements Function<StatisticsMfctyEntity, StatisticsMfctyVo> {

    public static final StatisticsMfctyVoTransformer INSTANCE = new StatisticsMfctyVoTransformer();

    @Override
    public StatisticsMfctyVo apply(StatisticsMfctyEntity input) {
        StatisticsMfctyVo out = StatisticsMfctyVo.builder().allOrderMoney(input.getAllOrderMoney())
                .mfctyName(input.getMfctyName())
                .orderAllNum(input.getOrderAllNum())
                .returnGoodsMenoy(input.getReturnGoodsMenoy())
                .returnGoodsNum(input.getReturnGoodsNum())
                .build();
        return out;
    }
}
