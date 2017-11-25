package com.qipeipu.crm.dao.bean;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

import java.util.Date;

/**
 * Created by Administrator:LiuJunyong on 2015/7/30.
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CouponTypeRecord {
    //优惠券类型id
    private int couponTypeId = 0 ;

    //修改时间
    private Date updateTime ;

    //创建时间
    private Date createTime ;

    //优惠券额
    private Integer couponAmt ;

    //期限(天)
    private Integer limitDays ;

    //能使用该优惠券的下限消费金额
    private Integer quota ;

    //未使用张数的上限持有数
    private Integer maxUnusedNum ;

    //备注
    private String memo ;
}
