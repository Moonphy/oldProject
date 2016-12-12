package com.qipeipu.crm.dtos.statistics.tradeAnalyse.storageStructure;

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
     * 厂名
     */
    private String mfctyNmae;
    /**
     * 状态 ： 0：创建 1:提交认证　2：激活（审核通过）　-1：删除　-2:冻结
     */
    private Integer status;
    /**
     * 城市id，这里用于按城市分组
     */
    private Integer cityID;
    /**
     * 城市
     */
    private String cityName;
    /**
     * 注册通过时间
     */
    private String auditTime;
}
