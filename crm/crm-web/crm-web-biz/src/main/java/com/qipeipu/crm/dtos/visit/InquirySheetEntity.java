package com.qipeipu.crm.dtos.visit;

import lombok.Data;

import java.util.List;

/**
 * Created by laiyiyu on 2015/4/2.
 */
@Data
public class InquirySheetEntity {

    private Integer inquiryID;

    private String inquiryNo;

    private String publishTime;

    private Integer status;

    private Integer carTypeId;

    private String brandSystem;

    private Integer allNum;

    private Double allMenoey;

    private String userID;

    private String mfctyName;

    List<PartDetailEntity> partDetailEntityList;
}
