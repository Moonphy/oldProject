package com.qipeipu.crm.dtos.customer;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

/**
 * Created by laiyiyu on 2015/5/25.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class QpuOrgDetailVo {
    /**
     * 汽修厂基本信息实体
     */
    private QpuOrgEntity qpuOrgEntity;
    /**
     * 汽修厂是否过滤
     */
    private boolean isFilter;
    /**
     * 汽配铺门头照片集合
     */
    private String[] orgFacadePics;
}
