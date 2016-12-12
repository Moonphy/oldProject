package com.qipeipu.crm.dtos.user;

import lombok.Data;

/**
 * Created by laiyiyu on 2015/4/13.
 */
@Data
public class MarketFeedBackEntity {
    private Integer feedBackID;

    private Integer userID;


    private Integer platTypeID;


    /**
     * 平台类型名称
     */
    private String platTypeName;

    /**
     * 内容
     */
    private String content;

    /**
     * 创建时间
     */

    private String createTime;


    /**
     * 修改时间
     */
    private String updateTime;


}
