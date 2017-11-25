package com.qipeipu.crm.dtos.customer;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

/**
 * Created by laiyiyu on 2015/5/25.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class QpuOrgEntity {
    /**
     * 组织ID
     */
    private String orgID;
    /**
     *组织名称
     */
    private String mfctyName;
    /**
     *组织类型 10:汽修厂,20:服务商,21:合作服务商,22:直营服务商,30:代理商
     */
    private int orgType;
    /**
     *工商注册号
     */
    private String businessLicenseNo;
    /**
     *工商注册照片相对路径url
     */
    private String businessLicensePic;
    /**
     *法人姓名
     */
    private String legalPerson;
    /**
     *法人身份证号
     */
    private String identityNo;
    /**
     *法人身份证照片
     */
    private String identityNoPic;
    /**
     *联系人姓名
     */
    private String contactPerson;
    /**
     *联系人手机号
     */
    private String contactMobile;
    /**
     *公司业务电话号码
     */
    private String businessTelephone;
    /**
     *邮箱
     */
    private String email;
    /**
     *业务类型
     */
    private Integer businessType;
    /**
     *余额
     */
    private Double balance;
    /**
     *用户状态．0：创建 1:提交认证　2：激活（审核通过）　-1：删除　-2:冻结
     */
    private Integer status;
    /**
     *传真
     */
    private String fax;
    /**
     *区域或县id
     */
    private Integer countyID;
    /**
     *地区名称
     */
    private String countyName;
    /**
     *城市id
     */
    private String cityID;
    /**
     *城市名称
     */
    private String cityName;
    /**
     *省份ID
     */
    private Integer provinceID;
    /**
     *省份名称
     */
    private String provinceName;
    /**
     *地区ID（大区）
     */
    private Integer regionID;
    /**
     *地区名称（大区）
     */
    private String regionName;
    /**
     *企业详细地址
     */
    private String address;
    /**
     *门头照片url，逗号分隔
     */
    private String facadePics;
    /**
     *签约时间
     */
    private String signTime;
    /**
     *更新时间
     */
    private String updateTime;
    /**
     * 创建时间
     */
    private String createTime;
    /**
     * 审核时间
     */
    private String auditTime;














}
