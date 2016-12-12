package com.qipeipu.crm.dtos.statistics.tradeAnalyse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

/**
 * Created by Administrator on 2015/5/22.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class StatisticsMfctyVo {
    /**
     * 厂名
     */
    private String mfctyName;
    /**
     * 该厂的订单总额
     */
    private double allOrderMoney;
    /**
     * 该厂的总订单数
     */
    private int orderAllNum;
    /**
     * 退单总金额
     */
    private double returnGoodsMenoy;
    /**
     * 退单总数
     */
    private int returnGoodsNum;
}
