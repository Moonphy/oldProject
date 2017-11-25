package com.qipeipu.crm.dtos.auth;

import com.qipeipu.crm.dao.bean.RoleRecord;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

import java.io.Serializable;
import java.util.List;

/**
 * Created by Administrator:LiuJunyong on 2015/8/19.
 *
 */
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class RoleDTO extends RoleRecord implements Serializable {

    private static final long serialVersionUID = -1454766017059656500L;

    //子树集
    List<RoleDTO> subDTO ;

    //用户是否充当该角色
    Boolean isChecked ;
}
