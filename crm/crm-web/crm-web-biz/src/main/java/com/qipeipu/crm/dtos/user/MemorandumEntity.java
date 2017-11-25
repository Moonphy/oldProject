package com.qipeipu.crm.dtos.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

/**
 * Created by laiyiyu on 2015/4/9.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class MemorandumEntity {

    private Integer noteID;

    private Integer userID;

    private String content;

    private String planTime;

    private String createTime;

    private String updateTime;


}
