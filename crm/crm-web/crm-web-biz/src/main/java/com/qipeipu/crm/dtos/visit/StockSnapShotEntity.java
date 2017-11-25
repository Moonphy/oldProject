package com.qipeipu.crm.dtos.visit;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

/**
 * Created by laiyiyu on 2015/5/20.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class StockSnapShotEntity {
    private Integer stockSnapShotID;

    private String partsName;

    private Double unitPrice;

    private Integer carTypeID;
}
