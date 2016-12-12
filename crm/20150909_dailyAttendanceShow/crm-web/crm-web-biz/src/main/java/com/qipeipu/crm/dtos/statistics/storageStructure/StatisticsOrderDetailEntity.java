package com.qipeipu.crm.dtos.statistics.storageStructure;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

/**
 * Created by laiyiyu on 2015/4/17.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class StatisticsOrderDetailEntity {
    /**
     * 订单明细id
     */
    private String orderDetailID;
    /**
     * 订单id
     */
    private String orderMainID;
    /**
     * 明细来源，询价单或商城或极使采购
     */
    private String dtlfrom;
}
