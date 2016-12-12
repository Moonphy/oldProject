package com.qipeipu.crm.dtos.visit;

import lombok.Data;

/**
 * Created by laiyiyu on 2015/3/25.
 */
@Data
public class PlatformQuestionEntity {

    /**
     * 问题回馈id
     */
    private Integer feedBackID;

    /**
     * 任务id
     */
    private Integer taskID;


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
