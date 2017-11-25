package com.qipeipu.crm.dtos.statistics.tradeAnalyse.storageStructure;

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
public class StatisticsInqueryDetailEntity {
    /**
     * 询单明细id
     */
    private Integer inquiryDetailID;
    /**
     * 询单id
     */
    private Integer inquiryID;
    /**
     * 配件名称
     */
    private Integer partsName;
}
