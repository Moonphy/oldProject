package com.qipeipu.crm.dtos.global;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

import java.io.Serializable;
import java.util.List;

/**
 * Created by Administrator:LiuJunyong on 2015/8/18.
 * 树结构数据
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BeanTree<T> implements Serializable {
    private static final long serialVersionUID = 5551839205214766022L;

    //数据
    private T model ;

    //子关系
    private List<BeanTree<T>> subTrees ;
}
