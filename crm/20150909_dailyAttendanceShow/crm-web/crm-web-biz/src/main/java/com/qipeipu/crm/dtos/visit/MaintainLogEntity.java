package com.qipeipu.crm.dtos.visit;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

/**
 * Created by laiyiyu on 2015/4/10.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class MaintainLogEntity {

    private Integer maintainID;


    private Integer custID;


    private Integer userID;

    /**
     * 1是开发，2是维护
     */
    private Integer maintainType;

    private String createTime;


    private String updateTime;
}
