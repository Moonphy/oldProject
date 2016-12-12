package com.qipeipu.crm.dtos.customer;

import lombok.Data;

import java.util.Date;

/**
 * Created by johnkim on 15-2-11.
 */
@Data
public class CustOfflineBuyDTO {

    private Integer id;
    /***
     * 客户ID
     */
    private Integer custId;
    /***
     * 城市ID
     */
    private Integer cityId;
    /***
     * 优先级
     */
    private Integer prior;
    /***
     * 创建时间
     */
    private Date createTime;
    /***
     * 更新时间
     */
    private Date updateTime;
    /***
     * 客服ID
     */
    private Integer userId;
}
