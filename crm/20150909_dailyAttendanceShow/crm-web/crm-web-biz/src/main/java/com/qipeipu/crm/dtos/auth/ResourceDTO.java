package com.qipeipu.crm.dtos.auth;

import com.qipeipu.crm.dao.bean.ResourceRecord;
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
public class ResourceDTO extends ResourceRecord implements Serializable {

    private static final long serialVersionUID = 1604427093017039934L;

    //子树集
    List<ResourceDTO> subDTO ;

    //角色是否持有该资源
    Boolean isChecked ;
}
