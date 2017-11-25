package com.qipeipu.crm.dtos.visit;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

import java.util.List;

/**
 * Created by laiyiyu on 2015/4/10.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class CustMaintainEntity {

    private CustomerBasedEntity customerBasedEntity;

    private List<MaintainEntity> maintainEntityList;


    private List<MaintainLogEntity> maintainLogEntityList;

}
