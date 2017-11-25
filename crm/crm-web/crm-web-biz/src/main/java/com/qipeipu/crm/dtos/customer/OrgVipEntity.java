package com.qipeipu.crm.dtos.customer;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

/**
 * Created by laiyiyu on 2015/6/3.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class OrgVipEntity {
    /**
     * 会员级别Id
     */
    private Integer levelID;
    /**
     * 组织Id
     */
    private String orgID;
    /**
     * 系统录入时间
     */
    private String createTime;
    /**
     * 更新时间
     */
    private String updateTime;
    /**
     * 开始时间
     */
    private String startTime;
    /**
     * 结束时间
     */
    private String endTime;
}
