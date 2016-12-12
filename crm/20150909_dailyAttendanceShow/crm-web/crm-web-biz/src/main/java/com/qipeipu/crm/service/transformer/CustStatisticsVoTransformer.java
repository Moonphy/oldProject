package com.qipeipu.crm.service.transformer;

import com.google.common.base.Function;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.CustStatisticsVo;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.StatisticsTradeGroupByCityEntity;

/**
 * Created by Administrator on 2015/5/22.
 */
public class CustStatisticsVoTransformer implements Function<StatisticsTradeGroupByCityEntity, CustStatisticsVo> {

    public static final CustStatisticsVoTransformer INSTANCE = new CustStatisticsVoTransformer();

    @Override
    public CustStatisticsVo apply(StatisticsTradeGroupByCityEntity input) {
        CustStatisticsVo out = CustStatisticsVo.builder()
                .activateNum(input.getStatisticsTradeEntity().getStatisticsOrderEntity().getActivateNum())
                .activateRatio(input.getStatisticsTradeEntity().getStatisticsOrderEntity().getActivateRatio())
                .cityName(input.getCityName())
                .dateRangeRegisterNum(input.getStatisticsTradeEntity().getStatisticsOrderEntity().getRegisterNum())
                .sensitizeNum(input.getStatisticsTradeEntity().getStatisticsOrderEntity().getSensitizeNum())
                .tradeStayRatio(input.getStatisticsTradeEntity().getStatisticsOrderEntity().getTradeStayRatio())
                .transactionNum(input.getStatisticsTradeEntity().getStatisticsOrderEntity().getTransactionNum())
                .build();
        return out;
    }
}
