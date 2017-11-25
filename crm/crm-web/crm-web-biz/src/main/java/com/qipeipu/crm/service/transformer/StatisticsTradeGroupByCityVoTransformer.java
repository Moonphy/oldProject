package com.qipeipu.crm.service.transformer;

import com.google.common.base.Function;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.StatisticsTradeGroupByCityEntity;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.StatisticsTradeGroupByCityVo;

/**
 * Created by Administrator on 2015/5/22.
 */
public class StatisticsTradeGroupByCityVoTransformer implements Function<StatisticsTradeGroupByCityEntity, StatisticsTradeGroupByCityVo> {

    public static final StatisticsTradeGroupByCityVoTransformer INSTANCE = new StatisticsTradeGroupByCityVoTransformer();

    @Override
    public StatisticsTradeGroupByCityVo apply(StatisticsTradeGroupByCityEntity input) {

        StatisticsTradeGroupByCityVo output = StatisticsTradeGroupByCityVo.builder().cityName(input.getCityName())
                .orderNum(input.getStatisticsTradeEntity().getStatisticsOrderEntity().getOrderNum())
                .totalOrder(input.getStatisticsTradeEntity().getStatisticsOrderEntity().getTotalOrder())
                .totalChargebackNum(input.getStatisticsTradeEntity().getStatisticsReturnEntity().getTotalChargebackNum())
                .totalChargeback(input.getStatisticsTradeEntity().getStatisticsReturnEntity().getTotalChargeback())
                .orderReturnRatio(input.getStatisticsTradeEntity().getOrderReturnRatio())
                .returnNumToOrderNumRatio(input.getStatisticsTradeEntity().getReturnNumToOrderNumRatio())
                .registerToFirstTradeDayAverage(input.getStatisticsTradeEntity().getStatisticsOrderEntity().getRegisterToFirstTradeDayAverage())
                .sensitizeToFirstTradeDayAverage(input.getStatisticsTradeEntity().getStatisticsOrderEntity().getSensitizeToFirstTradeDayAverage())
                .build();
        return output;
    }
}
