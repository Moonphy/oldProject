package com.qipeipu.crm.service.transformer;

import com.google.common.base.Function;
import com.qipeipu.crm.dtos.customer.OrgForCouponEntity;
import com.qipeipu.crm.dtos.customer.QpuOrgEntity;

/**
 * Created by Administrator on 2015/6/2.
 */
public class OrgForCouponEntityTransformer implements Function<QpuOrgEntity, OrgForCouponEntity> {

    public static final OrgForCouponEntityTransformer INSTANCE = new OrgForCouponEntityTransformer();

    @Override
    public OrgForCouponEntity apply(QpuOrgEntity input) {
        OrgForCouponEntity out = OrgForCouponEntity.builder()
                .address(input.getAddress())
                .cityName(input.getCityName())
                .mfctyName(input.getMfctyName())
                .orgID(input.getOrgID())
                .contactMobile(input.getContactMobile())
                .contactPerson(input.getContactPerson())
                .auditTime(input.getAuditTime())
                .build();
        return out;
    }
}
