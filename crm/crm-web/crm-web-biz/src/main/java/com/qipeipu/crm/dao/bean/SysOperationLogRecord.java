package com.qipeipu.crm.dao.bean;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

import java.util.Date;

/**
 * Created by Administrator:LiuJunyong on 2015/7/16.
 *
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SysOperationLogRecord {
    //操作id
    private long operationId = 0 ;

    //操作时间
    private Date createTime ;

    //操作人id
    private Long operatorId ;

    //操作人名称
    private String operatorName ;

    //操作类型(0：未知；1：增；2：删；3：改；4：查)
    private Integer operationTypeId ;

    //业务模块类型:(0: 未知，1：优惠券管理...)(其他详细见业务模块表)
    private Long bizModelTypeId ;

    //业务模块名称
    private String bizModelName ;

    //业务模块关键字(优惠券管理：汽修厂id；...)(其他详细见业务模块对应关键字表)
    private Long bizModelKey ;

    //具体描述
    private String description ;
}
