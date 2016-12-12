package com.qipeipu.crm.dtos.phone;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

/**
 * Created by laiyiyu on 2015/3/24.
 */

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class DepartDTO {

    private String userID;

    private String deptID;

    private String createTime;

    private String updateTime;






}
