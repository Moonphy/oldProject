package com.qipeipu.crm.dtos.phone;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

/**
 * Created by laiyiyu on 2015/3/23.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class UserPhoneDTO {

    private Integer contactID;
    private Integer userID;
    private String contactMan;
    private String phoneNo;
    private String memo;
    private String state;
    private Integer contactTypeID;
    private String createTime;
    private String updateTime;



}
