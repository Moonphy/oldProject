package com.qipeipu.crm.dtos.phone;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

/**
 * Created by laiyiyu on 2015/3/20.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class PublicPhoneEntity {

    /**
     * 联系id
     */
    private String contactID;


    /**
     * 联系人
     */
    private String contactMan;


    /**
     * 电话号码
     */
    private String phoneNo;

    /**
     * 备注
     */
    private String memo;

    /**
     * 联系类型
     */
    private String contactTypeName;

    private int state;


    private String contactTypeID;


    private String createTime;

    private String updateTime;



}
