package com.qipeipu.crm.dtos.visit;

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

public class CustomerBasedDTO {


    private Integer id;

    /**
     * 厂名
     */
    private String mfctyName;


    /**
     * 联系电话
     */
    private String cactTel;


    /**
     * 联系人
     */
    private String cactMan;

    /**
     * 地址
     */
    private String address;


    /**
     * 汽修厂类型: 一/二/三类
     */
    private Integer mfctyType;



    /**
     * 烤漆房
     */
    private String boothRoom;

    /**
     * 升降架
     */
    private String liftingFrame;

    /**
     * 经营面积
     */
    private Integer businessArea;


    private String updateTime;





}
