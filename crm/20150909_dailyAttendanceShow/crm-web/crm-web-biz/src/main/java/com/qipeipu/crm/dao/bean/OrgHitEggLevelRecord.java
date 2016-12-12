package com.qipeipu.crm.dao.bean;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

import java.util.Date;

/**
 * Created by Administrator:LiuJunyong on 2015/7/29.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrgHitEggLevelRecord {
    //组织id
    private long orgId = 0 ;
    //创建时间
    private Date createTime ;
    //更新时间
    private Date updateTime ;
    //规则级别: 0 不参与  1 高级  3 中级   5 低级
    private Integer state ;

    //开始时间
    //结束时间
}
