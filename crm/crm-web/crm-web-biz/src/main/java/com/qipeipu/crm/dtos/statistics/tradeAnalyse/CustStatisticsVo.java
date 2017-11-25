package com.qipeipu.crm.dtos.statistics.tradeAnalyse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

/**
 * Created by laiyiyu on 2015/5/22.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class CustStatisticsVo {
    /**
     * 城市名称
     */
    private String cityName;
    /**
     * 在选择时间段内注册
     */
    private int dateRangeRegisterNum;
    /**
     * 交易客户数量
     */
    private int transactionNum;
    /**
     * 激活客户数
     */
    private int sensitizeNum;
    /**
     * 活跃客户数
     */
    private int activateNum;
    /**
     * 交易客户留存率（时间段内交易客户/累计交易客户数）
     */
    private String tradeStayRatio;
    /**
     *活跃客户留存率（活跃客户数/累计交易客户数）
     */
    private String activateRatio;
}
