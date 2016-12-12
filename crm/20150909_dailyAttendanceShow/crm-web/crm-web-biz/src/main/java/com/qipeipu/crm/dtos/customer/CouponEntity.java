package com.qipeipu.crm.dtos.customer;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

/**
 * Created by laiyiyu on 2015/6/2.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class CouponEntity {
    // 流水Id
    private int fctyCouponId;
    // 流水号
    private String fctyCouponNo;
    // 汽修厂Id
    private String mfctyId;
    // 用户Id
    private String custId;
    // 金额
    private Double money;
    // 来源origin:(1：注册赠 2：免费赠 3：订单支付 4：支付失败恢复 5：退款打入 )
    private int origin;
    // 状态state:(0: 未用，1：已用)
    private Integer state;
    // 创建时间
    private String createTime;
    // 修改时间
    private String updateTime;
    // 过期时间
    private String expiryDate;
    // 所需消费金额（元）
    private Double quota;
    //单据id
    private Long billId;
    //单据号
    private String billNo;
}
