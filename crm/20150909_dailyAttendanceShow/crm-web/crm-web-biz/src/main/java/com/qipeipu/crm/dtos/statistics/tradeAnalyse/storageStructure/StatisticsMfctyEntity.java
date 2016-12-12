package com.qipeipu.crm.dtos.statistics.tradeAnalyse.storageStructure;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

import java.util.List;

/**
 * Created by laiyiyu on 2015/4/16.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class StatisticsMfctyEntity {
    /**
     * 厂id
     */
    private String mfctyID;
    /**
     * 厂名
     */
    private String mfctyName;
    /**
     * 该厂的总订单数
     */
    private int orderAllNum;
    /**
     * 该厂的订单总额
     */
    private double allOrderMoney;
    /**
     * 订单平均金额：单总额/总订单数
     */
    private double orderAverageAmount;
    /**
     * 注册审核通过到首单的天数
     */
    private int registerToFirstTradeDay;
    /**
     * 注册审核通过到首单的日期
     */
    private String registerToFirstTradeDate;
    /**
     * 注册审核通过到激活的天数
     */
    private int sensitizeToFirstTradeDay;
    /**
     * 注册审核通过到激活的日期
     */
    private String sensitizeToFirstTradeDate;
    /**
     * 通过注册的时间
     */
    private String registerTime;
    /**
     * 是否为交易客户：有一单交易成功
     */
    private boolean isTrade;
    /**
     * 是否为注册客户
     */
    private boolean isRegister;
    /**
     * 是否为选择时间段内注册
     */
    private boolean isSelectDateRangeRegister;
    /**
     * 是否为活跃账户 orderAllNum>10或者allMoney>2w的为活跃账户
     */
    private boolean isActive;
    /**
     * 是否为激活客户 （订单金额>=1000，且成功交易）
     */
    private boolean isSensitize;
    /**
     * 总询价单数
     */
    private int inqueryAllNum;
    /**
     * 询价单转订单数
     */
    private int inqueryToOrderNum;
    /**
     * 询价单转订单比 （inqueryToOrderNum:inqueryAllNum）
     */
    private double inqueryToOrderRatio;
    /**
     * 退单总数
     */
    private int returnGoodsNum;
    /**
     * 退单总金额
     */
    private double returnGoodsMenoy;
    /**
     * 订单退款率 ： 退款总金额/订单总金额
     */
    private double orderReturnRatio;
    /**
     * 订单出错率 ：总退单数/总订单数
     */
    private double returnNumToOrderNumRatio;
    /**
     * 状态  0：创建 1:提交认证　2：激活（审核通过）　-1：删除　-2:冻结
     */
    private int status;
    /**
     * 城市id
     */
    private Integer cityID;
    /**
     * 城市名称
     */
    private String cityName;
    /**
     * 订单集合
     */
    private List<StatisticsOrderMainEntity> statisticsOrderMainEntities;
    /**
     * 询价单集合
     */
    private List<StatisticsInqueryMainEntity> statisticsInquiryMainEntities;
    /**
     * 退单集合
     */
    private List<StatisticsReturnGoodsEntity> statisticsReturnGoodsEntities;
}
