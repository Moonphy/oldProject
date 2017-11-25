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
public class CouponTotalEntity implements Comparable<CouponTotalEntity> {
    /**
     * 厂id
     */
    private String mfctyID;
    /**
     * 优惠券金额
     */
    private Double money;
    /**
     * 优惠券总张数
     */
    private Integer couponNum;
    /**
     * 历史有效张数
     */
    private int historyCouponNum;
    /**
     * 未使用张数
     */
    private Integer unUsedNum;
    /**
     * 生效时间
     */
    private String createTime;
    /**
     * 过期时间
     */
    private String expiryDate;
    /**
     * 实际最低使用额度
     */
    private Double quota;
    /**
     * 标准最低使用额度
     */
    private Double standardQuota;



    @Override
    public int compareTo(CouponTotalEntity o) {
        int result = this.getMoney().compareTo(o.getMoney());
        if(result>0){
            return 1;
        }else if(result<0){
            return -1;
        }else{
            return 0;
        }
    }
}
