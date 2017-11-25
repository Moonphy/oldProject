package com.qipeipu.crm.dao.bean;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

import java.io.Serializable;
import java.util.Date;

/**
 * Created by Administrator:LiuJunyong on 2015/8/7.
 *
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleRecord implements Serializable {
    private static final long serialVersionUID = 4421617262204498575L;

    //职务角色id(自增长主键)
    private int roleId = 0 ;

    //更新时间(自更新)
    private Date updateTime ;

    //创建时间
    private Date createTime ;

    //职务角色编码
    private String roleCode ;

    //职务角色名称
    private String roleName ;

    //角色状态(0:可用,1:不可用)
    private Integer state ;

    //父职务角色id(0:无父职务角色id)
    private Integer parentId ;
}
