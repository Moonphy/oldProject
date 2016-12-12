package com.qipeipu.crm.dao.bean;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

import java.util.Date;

/**
 * Created by Administrator:LiuJunyong on 2015/7/28.
 *
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SuperEggPlayerRecord {
    //编号id
    private long id = 0 ;

    //组织id
    private Long orgId ;

    //用户id
    private Long userId ;

    //规则生效起始时间
    private Date startTime ;

    //规则生效终止时间
    private Date endTime ;

    //中奖规则等级：0:不参与;1:高级;3:中级;5:低级(其他详细见中奖规则等级表)
    private Integer level ;

    //中奖金额比率（千分比）（可自定义中奖比例）
    private Integer ratio ;

    //创建时间
    private Date createTime ;

    //更新时间
    private Date updateTime ;
}
