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
public class MfctyByIDAndStatusEntity {
    /**
     * 厂id
     */
    private String mfctyID;
    /**
     * 状态 ： 0：创建 1:提交认证　2：激活（审核通过）　-1：删除　-2:冻结
     */
    private Integer status;
}
