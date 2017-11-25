package com.qipeipu.crm.dao.bean;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

import java.util.Date;

/**
 * Created by Administrator:LiuJunyong on 2015/7/29.
 *
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EggRoleRecord {
    //规则id
    private long ruleId = 0 ;

    //中奖规则名称
    private String ruleName ;

    //中奖规则等级：0:不参与;1:高级;3:中级;5:低级
    private Integer level ;

    //中奖概率（0~100%）
    private Integer probability ;

    //中奖金额比率（千分比）
    private Integer ratio ;

    //创建时间
    private Date createTime ;

    //更新时间
    private Date updateTime ;
}
