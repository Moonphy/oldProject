package com.qipeipu.crm.dtos.statistics.storageStructure;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

/**
 * Created by laiyiyu on 2015/4/20.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class StatisticsReturnGoodsDetailEntity {
    /**
     * 退单详情id
     */
    private String detailID;
    /**
     * 退单主表id
     */
    private String returnID;
}
