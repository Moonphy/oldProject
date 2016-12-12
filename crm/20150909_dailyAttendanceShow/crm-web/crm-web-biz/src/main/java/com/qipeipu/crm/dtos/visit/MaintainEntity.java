package com.qipeipu.crm.dtos.visit;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

/**
 * Created by laiyiyu on 2015/4/7.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class MaintainEntity {


    private Integer maintainID;


    private Integer custID;


    private Integer userID;

    private String userName;

    private String mp;

    /**
     * 1是开发，2是维护
     */
    private Integer maintainType;

    private String createTime;


    private String updateTime;

}
