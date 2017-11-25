package com.qipeipu.crm.dtos.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

/**
 * Created by Administrator:LiuJunyong on 2015/7/28.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserHitEggDTO {
    //组织名称
    //private String orgName ;
    //组织ID
    private Long orgId ;

    //用户姓名
    private String userName ;
    //用户id
    private Long userId ;
    //登陆名
    private String userLoginName ;
    //登陆手机号
    private String userLoginMobile ;
    //登陆邮箱
    private String userLoginEmail ;

    //中奖规则等级：0:不参与;1:高级;3:中级;5:低级
    private Integer ruleLevel;
    private String ruleLevelName ;
    //中奖金额比率（千分比）（可自定义中奖比例）
    private Integer ratio ;
    //规则生效起始时间
    private String startTime ;
    //规则生效终止时间
    private String endTime ;

    //创建时间
    //private String createTime;
    //修改时间
    //private String updateTime;
}
