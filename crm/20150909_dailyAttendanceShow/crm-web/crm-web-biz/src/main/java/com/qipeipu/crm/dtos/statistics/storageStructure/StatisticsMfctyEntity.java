package com.qipeipu.crm.dtos.statistics.storageStructure;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

import java.util.Collection;

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
    private Integer orderAllNum;
    /**
     * 该厂的订单总额
     */
    private Double allOrderMoney;
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
    private Integer inqueryAllNum;
    /**
     * 询价单转订单数
     */
    private Integer inqueryToOrderNum;
    /**
     * 询价单转订单比 （inqueryToOrderNum:inqueryAllNum）
     */
    private Double inqueryToOrderRatio;
    /**
     * 退单总数
     */
    private Integer returnGoodsNum;
    /**
     * 退单总金额
     */
    private Double returnGoodsMenoy;
    /**
     * 状态  0：创建 1:提交认证　2：激活（审核通过）　-1：删除　-2:冻结
     */
    private Integer status;
    /**
     * 订单集合
     */
    private Collection<StatisticsOrderMainEntity> statisticsOrderMainEntities;
    /**
     * 询价单集合
     */
    private Collection<StatisticsInqueryMainEntity> statisticsInquiryMainEntities;
    /**
     * 退单集合
     */
    private Collection<StatisticsReturnGoodsEntity> statisticsReturnGoodsEntities;
}
