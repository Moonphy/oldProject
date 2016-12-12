package com.qipeipu.crm.dtos.customer;

import lombok.Data;

import java.util.Date;

/**
 * 登记联系信息
 * Created by johnkim on 15-2-9.
 */
@Data
public class CustTraceDTO {


    private Integer traceId;
    /***
     * 客户ID
     */
    private Integer custId;
    /***
     * 备注
     */
    private String memo;
    /***
     * 创建时间
     */
    private Date createTime;
    /***
     * 更新时间
     */
    private Date updateTime;
    /***
     * 客服Id
     */
    private Integer userId;
}
