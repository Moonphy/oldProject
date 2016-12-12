package com.qipeipu.crm.dtos.global;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

import java.io.Serializable;

/**
 * Created by Administrator:LiuJunyong on 2015/8/26.
 * 分页模型
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PageModel implements Serializable {

    private static final long serialVersionUID = -73308423464699871L;

    /***
     * 总页数
     */
    private long total = 0 ;
    /***
     * 当前页码
     */
    private int pageIndex = 0 ;
    /***
     * 每页显示条数
     */
    private int pageSize = 10 ;
    /***
     * 数据模型
     */
    private Object model;
}
